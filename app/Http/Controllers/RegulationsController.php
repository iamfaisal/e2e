<?php

namespace App\Http\Controllers;

use App\Regulation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class RegulationsController extends Controller
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
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $regulations = Regulation::orderBy('created_at', 'desc');
        return response()->json([
            'regulations' => $regulations->get()
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
            'name' => $request->get('name'),
            'abbreviation' => $request->get('abbreviation'),
            'commission_name' => $request->get('commission_name'),
            'commission_abbreviation' => $request->get('commission_abbreviation'),
            'contact_first_name' => $request->get('contact_first_name'),
            'contact_last_name' => $request->get('contact_last_name'),
            'contact_email_address' => $request->get('contact_email_address'),
            'contact_phone' => $request->get('contact_phone'),
            'contact_street_address' => $request->get('contact_street_address'),
            'contact_city' => $request->get('contact_city'),
            'contact_state' => $request->get('contact_state'),
            'contact_zip_code' => $request->get('contact_zip_code'),
            'regulations' => $request->get('regulations'),
            'ce_requirements_statement' => $request->get('ce_requirements_statement'),
            'must_specify_courses' => $request->get('must_specify_courses') || false
        ];
        if($request->hasFile('regulations_doc'))
        {
            $data['regulations_doc'] = $this->handleFileUpload($request->file('regulations_doc'));
        }
        $regulation = Regulation::create($data);
        return response()->json([
            'regulation' => $regulation
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  Regulation $regulation
     * @return \Illuminate\Http\Response
     */
    public function show(Regulation $regulation)
    {
        return response()->json([
            'regulation' => $regulation
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Regulation $regulation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Regulation $regulation)
    {
        $data = [
            'name' => $request->get('name'),
            'abbreviation' => $request->get('abbreviation'),
            'commission_name' => $request->get('commission_name'),
            'commission_abbreviation' => $request->get('commission_abbreviation'),
            'contact_first_name' => $request->get('contact_first_name'),
            'contact_last_name' => $request->get('contact_last_name'),
            'contact_email_address' => $request->get('contact_email_address'),
            'contact_phone' => $request->get('contact_phone'),
            'contact_street_address' => $request->get('contact_street_address'),
            'contact_city' => $request->get('contact_city'),
            'contact_state' => $request->get('contact_state'),
            'contact_zip_code' => $request->get('contact_zip_code'),
            'regulations' => $request->get('regulations'),
            'ce_requirements_statement' => $request->get('ce_requirements_statement'),
            'must_specify_courses' => $request->get('must_specify_courses') || false
        ];
        if($request->hasFile('regulations_doc'))
        {
            $data['regulations_doc'] = $this->handleFileUpload($request->file('regulations_doc'));
        }
        $regulation->update($data);
        return response()->json([
            'regulation' => $request->all()
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Regulation $regulation
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Regulation $regulation)
    {
        $regulation->delete();
        return response()->json([
            'regulation' => 'success'
        ], 200);
    }

    /**
     * @param $file
     * @return string
     */
    private function handleFileUpload($file) {
        $filenameonly = str_replace($file->getClientOriginalExtension(), "", $file->getClientOriginalName());
        $filename = time() . '-' . Str::slug($filenameonly, '-') .'.' . $file->getClientOriginalExtension();
        $path = '/uploads/regulations/';
        $destinationPath = public_path() . $path;
        $file->move($destinationPath, $filename);
        return $path . $filename;
    }
}
