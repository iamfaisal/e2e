<?php

namespace App\Http\Controllers;

use App\Sponsor;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class SponsorsController extends Controller
{
    private $user;

    /**
     * constructor function.
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->user = Auth::Guard('api')->user();
//        if (!$this->user) {
//            return response()->json([
//                'unauthenticated' => true
//            ], 403);
//        }
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $this->user;
        $sponsors = Sponsor::with('regulation', 'user')
            ->orderBy('created_at', 'desc')
            ->when($request->fromInstructor, function ($query) use($user) {
                return $query->where('user_id', $user->id);
            });

        return response()->json([
            'sponsors' => $sponsors->get()
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
            'regulation_id' => $request->get('regulation'),
            'user_id' => $request->get('user'),
            'company' => $request->get('company'),
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'email' => $request->get('email'),
            'phone' => $request->get('phone'),
            'extension' => $request->get('extension'),
            'address' => $request->get('address'),
            'city' => $request->get('city'),
            'zip_code' => $request->get('zip_code')
        ];
        if($request->hasFile('avatar'))
        {
            $data['avatar'] = $this->handleFileUpload($request->file('avatar'));
        }
        if($request->hasFile('logo'))
        {
            $data['logo'] = $this->handleFileUpload($request->file('logo'));
        }
        $sponsor = Sponsor::create($data);
        return response()->json([
            'sponsor' => $sponsor
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  Sponsor $sponsor
     * @return \Illuminate\Http\Response
     */
    public function show(Sponsor $sponsor)
    {
        return response()->json([
            'sponsor' => $sponsor
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Sponsor $sponsor
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Sponsor $sponsor)
    {
        $data = [
            'regulation_id' => $request->get('regulation'),
            'user_id' => $request->get('user'),
            'company' => $request->get('company'),
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'email' => $request->get('email'),
            'phone' => $request->get('phone'),
            'extension' => $request->get('extension'),
            'address' => $request->get('address'),
            'city' => $request->get('city'),
            'zip_code' => $request->get('zip_code')
        ];
        if($request->hasFile('avatar'))
        {
            $data['avatar'] = $this->handleFileUpload($request->file('avatar'));
        }
        if($request->hasFile('logo'))
        {
            $data['logo'] = $this->handleFileUpload($request->file('logo'));
        }
        $sponsor->update($data);
        return response()->json([
            'sponsor' => $sponsor
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Sponsor $sponsor
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Sponsor $sponsor)
    {
        $sponsor->delete();
        return response()->json([
            'sponsor' => 'success'
        ], 200);
    }

    /**
     * @param $file
     * @return string
     */
    private function handleFileUpload($file) {
        $filenameonly = str_replace($file->getClientOriginalExtension(), "", $file->getClientOriginalName());
        $filename = time() . '-' . Str::slug($filenameonly, '-') .'.' . $file->getClientOriginalExtension();
        $path = '/uploads/sponsors/';
        $destinationPath = public_path() . $path;
        $file->move($destinationPath, $filename);
        return $path . $filename;
    }
}
