<?php

namespace App\Http\Controllers;

use App\Lesson;
use Illuminate\Http\Request;

class ClassesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // if school / admin return all, if instructor return only his
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  Lesson $class
     * @return \Illuminate\Http\Response
     */
    public function show(Lesson $class)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Lesson $class
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Lesson $class)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Lesson $class
     * @return \Illuminate\Http\Response
     */
    public function destroy(Lesson $class)
    {
        //
    }
}
