<?php

namespace App\Http\Controllers;

use App\Regulation;
use Illuminate\Http\Request;

class RegulationsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $regulations = Regulation::orderBy('created_at', 'desc')->get();
        return response()->json([
            'regulations' => $regulations
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
        $regulation = Regulation::create($request->all());
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
        $regulation->update($request->all());
        return response()->json([
            'regulation' => $regulation
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
}
