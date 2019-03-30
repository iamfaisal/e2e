<?php

namespace App\Http\Controllers;

use App\License;
use App\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\User;

class UsersController extends Controller
{
    private $user;

    /**
     * constructor function.
     */
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->user = Auth::Guard('api')->user();
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $users = User::whereHas('roles', function ($q) use ($request) {
            $q->where('name', $request->role);
        })->with(['roles', 'profile'])->get();

        return response()->json([
            'users' => $users
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = [
            'name'      => explode('@', $request->email)[0],
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
        ];
        $profileData = [
            'first_name'        => $request->first_name,
            'last_name'         => $request->last_name,
            'sub_domain'        => $request->sub_domain,
            'address'           => $request->address,
            'city'              => $request->city,
            'state'             => $request->state,
            'zip_code'          => $request->zip_code,
            'cell_phone'        => $request->cell_phone,
            'work_phone'        => $request->work_phone,
            'additional_name'   => $request->additional_name,
            'additional_email'  => $request->additional_email,
            'additional_name2'  => $request->additional_name2,
            'additional_email2' => $request->additional_email2,
            'info'              => $request->info
        ];
        if($request->hasFile('avatar'))
        {
            $profileData['avatar'] = $this->handleFileUpload($request->file('avatar'));
        }

        $user = User::create($data);
        $profile = new Profile($profileData);
        $user->profile()->save($profile);

        if($request->has('roles')) {
            $user->roles()->sync($request->roles);
            if (in_array(3, $request->roles) && $request->has('licenses')) {
                $user->licenses()->delete();
                foreach ($request->licenses as $index => $license) {
                    if (!empty($license['regulation']) && !empty($license['code']) && !empty($license['expiration'])) {
                        $licenseData = [
                            'regulation_id' => $license['regulation'],
                            'user_id' => $user->id,
                            'code' => $license['code'],
                            'expiration' => $license['expiration']
                        ];
                        if($_FILES['licenses']['name'][$index] && !empty($_FILES['licenses']['name'][$index]['certificate'])) {
                            $licenseData['certificate'] = $this->handleFileUpload($license['certificate']);
                        } else {
                            $licenseData['certificate'] = $license['certificate_file'];
                        }
                        License::create($licenseData);
                    }
                }
            }
        }

        return response()->json([
            'user' => $user,
            'profile' => $user->profile,
            'roles' => $user->roles->pluck('id')
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return response()->json([
            'user' => $user,
            'profile' => $user->profile,
            'licenses' => $user->licenses,
            'roles' => $user->roles->pluck('id')
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  User $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $data = [
            'name'      => explode('@', $request->email)[0],
            'email'     => $request->email
        ];
        if($request->has('password'))
        {
            $data['password'] = Hash::make($request->password);
        }
        $profileData = [
            'first_name'        => $request->first_name,
            'last_name'         => $request->last_name,
            'sub_domain'        => $request->sub_domain,
            'address'           => $request->address,
            'city'              => $request->city,
            'state'             => $request->state,
            'zip_code'          => $request->zip_code,
            'cell_phone'        => $request->cell_phone,
            'work_phone'        => $request->work_phone,
            'additional_name'   => $request->additional_name,
            'additional_email'  => $request->additional_email,
            'additional_name2'  => $request->additional_name2,
            'additional_email2' => $request->additional_email2,
            'info'              => $request->info
        ];
        if($request->hasFile('avatar'))
        {
            $profileData['avatar'] = $this->handleFileUpload($request->file('avatar'));
        }

        $user->update($data);
        $user->profile()->update($profileData);

        if($request->has('roles')) {
            $user->roles()->sync($request->roles);
            if (in_array(3, $request->roles) && $request->has('licenses')) {
                $user->licenses()->delete();
                foreach ($request->licenses as $index => $license) {
                    if (!empty($license['regulation']) && !empty($license['code']) && !empty($license['expiration'])) {
                        $licenseData = [
                            'regulation_id' => $license['regulation'],
                            'user_id' => $user->id,
                            'code' => $license['code'],
                            'expiration' => $license['expiration']
                        ];
                        if ($_FILES['licenses']['name'][$index] && !empty($_FILES['licenses']['name'][$index]['certificate'])) {
                            $licenseData['certificate'] = $this->handleFileUpload($license['certificate']);
                        } else {
                            $licenseData['certificate'] = $license['certificate_file'];
                        }
                        License::create($licenseData);
                    }
                }
            }
        }

        return response()->json([
            'user' => $user,
            'profile' => $user->profile,
            'roles' => $user->roles->pluck('id')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  User $user
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(User $user)
    {
        $user->profile()->delete();
        $user->licenses()->delete();
        $user->delete();
        return response()->json([
            'user' => 'success'
        ], 200);
    }

    /**
     * @param $file
     * @return string
     */
    private function handleFileUpload($file) {
        $filenameonly = str_replace($file->getClientOriginalExtension(), "", $file->getClientOriginalName());
        $filename = time() . '-' . Str::slug($filenameonly, '-') .'.' . $file->getClientOriginalExtension();
        $path = '/uploads/users/';
        $destinationPath = public_path() . $path;
        $file->move($destinationPath, $filename);
        return $path . $filename;
    }
}
