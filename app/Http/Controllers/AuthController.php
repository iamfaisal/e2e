<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Hashing\Hasher as HasherContract;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' =>
            ['login', 'forgot', 'reset', 'reset_password_email']
        ]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);
        $do_remember = request('remember_me');

        if (! $token = auth('api')->attempt($credentials, $do_remember)) {
            return response()->json(['error' => 'Unauthorized'], 500);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        $user = $this->guard()->user();
        return response()->json([
            'access_token' => $token,
            'user' => $user,
            'profile' => $user->profile,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'roles' => $user->allPermissions()
        ], $user->status == 0 ? 200 : 501);
    }

    /**
     * @return mixed
     */
    public function guard()
    {
        return Auth::Guard('api');
    }

    public function forgot()
    {
        $response = Password::broker()->sendResetLink(
            request(['email'])
        );
        return $response == Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Reset link sent to your email.'], 201)
            : response()->json(['message' => 'Unable to send reset link.'], 500);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function reset()
    {
        $credentials = request(
            ['email', 'password', 'password_confirmation', 'token']
        );
        $response = Password::broker()->reset(
            $credentials, function ($user, $password) {
                $user->password = Hash::make($password);
                $user->setRememberToken(Str::random(60));
                $user->save();
            }
        );
        return $response == Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password reset successful.'], 201)
            : response()->json(['message' => 'Password reset failed.'], 500);
    }

    /**
     * @param HasherContract $hasher
     * @return \Illuminate\Http\JsonResponse
     */
    public function reset_password_email(HasherContract $hasher)
    {
        $dbTokens = DB::table('password_resets')->get();
        $email = '';
        foreach($dbTokens as $dbToken) {
            if($hasher->check(request('token'), $dbToken->token)) {
                $email = $dbToken->email;
                break;
            }
        }
        return $email
            ? response()->json(['message' => $email], 201)
            : response()->json(['message' => 'Password reset failed.'], 500);
    }
}
