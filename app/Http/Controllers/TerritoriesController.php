<?php

namespace App\Http\Controllers;

use App\Territory;
use Illuminate\Http\Request;

class TerritoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $territories = Territory::with('regulation')->get();
        return response()->json([
            'territories' => $territories
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
        $territory = Territory::create([
            'name' => $request->get('name'),
            'regulation_id' => $request->get('regulation'),
            'zip_codes' => $request->get('zip_codes')
        ]);
        return response()->json([
            'territory' => $territory
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  Territory $territory
     * @return \Illuminate\Http\Response
     */
    public function show(Territory $territory)
    {
        return response()->json([
            'territory' => $territory
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Territory $territory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Territory $territory)
    {
        $territory->update([
            'name' => $request->get('name'),
            'regulation_id' => $request->get('regulation'),
            'zip_codes' => $request->get('zip_codes')
        ]);
        return response()->json([
            'territory' => $territory
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Territory $territory
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Territory $territory)
    {
        $territory->delete();
        return response()->json([
            'territory' => 'success'
        ], 200);
    }
}