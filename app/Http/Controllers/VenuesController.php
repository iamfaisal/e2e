<?php

namespace App\Http\Controllers;

use App\Venue;
use Illuminate\Http\Request;

class VenuesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $venues = Venue::with('regulation', 'user')
            ->orderBy('created_at', 'desc');
        return response()->json([
            'venues' => $venues->get()
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
        $venue = Venue::create([
            'regulation_id' => $request->get('regulation'),
            'user_id' => $request->get('user'),
            'name' => $request->get('name'),
            'address' => $request->get('address'),
            'city' => $request->get('city'),
            'zip_code' => $request->get('zip_code')
        ]);
        return response()->json([
            'venue' => $venue
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  Venue $venue
     * @return \Illuminate\Http\Response
     */
    public function show(Venue $venue)
    {
        return response()->json([
            'venue' => $venue
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Venue $venue
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Venue $venue)
    {
        $venue->update([
            'regulation_id' => $request->get('regulation'),
            'user_id' => $request->get('user'),
            'name' => $request->get('name'),
            'address' => $request->get('address'),
            'city' => $request->get('city'),
            'zip_code' => $request->get('zip_code')
        ]);
        return response()->json([
            'venue' => $venue
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Venue $venue
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Venue $venue)
    {
        $venue->delete();
        return response()->json([
            'venue' => 'success'
        ], 200);
    }
}