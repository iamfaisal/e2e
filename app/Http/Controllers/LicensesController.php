<?php

namespace App\Http\Controllers;

use App\License;
use Illuminate\Http\Request;

class LicensesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $licenses = Sponsor::with('regulation', 'user')
            ->orderBy('created_at', 'desc');
        return response()->json([
            'licenses' => $licenses->get()
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
            'code' => $request->get('code'),
            'expiration' => $request->get('expiration')
        ];
        if($request->hasFile('certificate'))
        {
            $data['certificate'] = $this->handleFileUpload($request->file('certificate'));
        }
        $license = License::create($data);
        return response()->json([
            'license' => $license
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  License $license
     * @return \Illuminate\Http\Response
     */
    public function show(License $license)
    {
        return response()->json([
            'license' => $license
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  License $license
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, License $license)
    {
        $data = [
            'regulation_id' => $request->get('regulation'),
            'user_id' => $request->get('user'),
            'code' => $request->get('code'),
            'expiration' => $request->get('expiration')
        ];
        if($request->hasFile('certificate'))
        {
            $data['certificate'] = $this->handleFileUpload($request->file('certificate'));
        }
        $license->update($data);
        return response()->json([
            'license' => $license
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  License $license
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(License $license)
    {
        $license->delete();
        return response()->json([
            'license' => 'success'
        ], 200);
    }

    /**
     * @param $file
     * @return string
     */
    private function handleFileUpload($file) {
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $path = '/uploads/licenses/';
        $destinationPath = public_path() . $path;
        $file->move($destinationPath, $filename);
        return $path . $filename;
    }
}
