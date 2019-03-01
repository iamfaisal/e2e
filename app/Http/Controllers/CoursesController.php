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
        $data = [
            'title' => $request->get('title'),
            'regulation_id' => $request->get('regulation_id'),
            'number' => $request->get('number'),
            'code' => $request->get('code'),
            'hours' => $request->get('hours'),
            'description' => $request->get('description'),
            'expiration_date' => $request->get('expiration_date'),
            'commercial_link' => $request->get('commercial_link')
        ];
        if($request->hasFile('class_flyer_template'))
        {
            $data['class_flyer_template'] = $request->file('class_flyer_template')->store('courses');
        }
        if($request->hasFile('class_docs_template'))
        {
            $data['class_docs_template'] = $request->file('class_docs_template')->store('courses');
        }
        if($request->hasFile('material'))
        {
            $data['material'] = $request->file('material')->store('courses');
        }
        $course = Course::create($data);
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
        $data = [
            'title' => $request->get('title'),
            'regulation_id' => $request->get('regulation_id'),
            'number' => $request->get('number'),
            'code' => $request->get('code'),
            'hours' => $request->get('hours'),
            'description' => $request->get('description'),
            'expiration_date' => $request->get('expiration_date'),
            'commercial_link' => $request->get('commercial_link')
        ];
        if($request->hasFile('class_flyer_template'))
        {
            $data['class_flyer_template'] = $request->file('class_flyer_template')->store('courses');
        }
        if($request->hasFile('class_docs_template'))
        {
            $data['class_docs_template'] = $request->file('class_docs_template')->store('courses');
        }
        if($request->hasFile('material'))
        {
            $data['material'] = $request->file('material')->store('courses');
        }
        $course->update($data);
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
        $course->update([
            'is_deleted' => true
        ]);
        return response()->json([
            'course' => 'success'
        ], 200);
    }
}
