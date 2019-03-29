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
        $data = [
            'user_id' => $request->get('instructor'),
            'course_id' => $request->get('course'),
            'venue_id' => $request->get('venue'),
            'start_date' => $request->get('start_date_time'),
            'end_date' => $request->get('end_date_time'),
            'price' => $request->get('price'),
            'capacity' => $request->get('capacity'),
            'alternate_instructor' => $request->get('alternate_instructor'),
            'guest_speaker' => $request->get('guest_speaker'),
            'rsvp_contact' => $request->get('rsvp_contact'),
            'rsvp_phone' => $request->get('rsvp_phone'),
            'rsvp_email' => $request->get('rsvp_email'),
            'rsvp_link_text' => $request->get('rsvp_link_text'),
            'rsvp_link_url' => $request->get('rsvp_link_url'),
            'status' => 'New'
        ];
        $lesson = Lesson::create($data);
        return response()->json([
            'class' => $lesson
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  Lesson $class
     * @return \Illuminate\Http\Response
     */
    public function show(Lesson $class)
    {
        return response()->json([
            'class' => $class
        ], 200);
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
        $data = [
            'user_id' => $request->get('instructor'),
            'course_id' => $request->get('course'),
            'venue_id' => $request->get('venue'),
            'start_date' => $request->get('start_date_time'),
            'end_date' => $request->get('end_date_time'),
            'price' => $request->get('price'),
            'capacity' => $request->get('capacity'),
            'alternate_instructor' => $request->get('alternate_instructor'),
            'guest_speaker' => $request->get('guest_speaker'),
            'rsvp_contact' => $request->get('rsvp_contact'),
            'rsvp_phone' => $request->get('rsvp_phone'),
            'rsvp_email' => $request->get('rsvp_email'),
            'rsvp_link_text' => $request->get('rsvp_link_text'),
            'rsvp_link_url' => $request->get('rsvp_link_url'),
            'status' => 'New'
        ];
        $class->update($data);
        return response()->json([
            'class' => $class
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Lesson $class
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Lesson $class)
    {
        $class->delete();
        return response()->json([
            'class' => 'success'
        ], 200);
    }
}
