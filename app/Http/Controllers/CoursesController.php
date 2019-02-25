<?php

namespace App\Http\Controllers;

use App\Category;
use App\Regulation;
use Illuminate\Http\Request;
use App\Course;

class CoursesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $courses = Course::with('categories:name,label', 'regulation')->get();
        $categories = Category::all();
        $regulations = Regulation::all();
        return response()->json([
            'courses' => $courses,
            'categories' => $categories,
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
        $course = Course::create($request->all());
        return response()->json([
            'course' => $course
        ], 200);
    }


    /**
     * Display the specified resource.
     *
     * @param  Course $course
     * @return \Illuminate\Http\Response
     */
    public function show(Course $course)
    {
        return response()->json([
            'course' => $course
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Course $course
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Course $course)
    {
        $course->update($request->all());
        return response()->json([
            'course' => $course
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Course $course
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Course $course)
    {
        $course->delete();
        return response()->json([
            'course' => 'success'
        ], 200);
    }
}
