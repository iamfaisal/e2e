<?php

namespace App\Http\Controllers;

use App\Lesson;
use Illuminate\Http\Request;

class ClassesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth('api')->user();
        $classes = Lesson::with('course', 'user', 'venue')
            ->orderBy('created_at', 'desc')
            ->when($user->isJust("instructor") && $request->fromInstructor, function ($query) use($user) {
                return $query->where('user_id', $user->id);
            });

        // show only approved, show only cancelled

        return response()->json([
            'classes' => $classes->get()
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
