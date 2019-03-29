<?php

namespace App\Http\Controllers;

use App\Approval;
use App\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;

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
        $currentDateTime = Carbon::now()->toDateTimeString();
        $user = Auth::Guard('api')->user();
        $classes = Lesson::with('course', 'user', 'venue')
            ->orderBy('created_at', 'desc')
            ->when($request->archived, function ($query) use($currentDateTime) {
                return $query->where('end_date', '<', $currentDateTime);
            }, function ($query) use($currentDateTime) {
                return $query->where('end_date', '>=', $currentDateTime);
            })
            ->when($user->isJust("instructor") && $request->fromInstructor, function ($query) use($user) {
                return $query->where('user_id', $user->id);
            });

        // show only approved, show only cancelled, show archived

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
            'class' => $class,
            'sponsors' => $class->sponsors
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
        if($request->hasFile('flyer'))
        {
            $data['flyer'] = $this->handleFileUpload($request->file('flyer'));
        }
        if($request->hasFile('flyer_image'))
        {
            $data['flyer_image'] = $this->handleFileUpload($request->file('flyer_image'));
        }
        if($request->has('sponsors')) {
            $class->sponsors()->sync($request->sponsors);
        }
        $class->update($data);
        return response()->json([
            'class' => $class
        ], 200);
    }

    /**
     * @param Request $request
     * @param Lesson $class
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve(Request $request, Lesson $class)
    {
        $approvalData = [
            'lesson_id' => $class->id,
            'class_date' => $request->get('class_date') ? true : false,
            'start_time' => $request->get('start_time') ? true : false,
            'end_time' => $request->get('end_time') ? true : false,
            'course' => $request->get('course') ? true : false,
            'venue' => $request->get('venue') ? true : false,
            'price' => $request->get('price') ? true : false,
            'capacity' => $request->get('capacity') ? true : false,
            'alternate_instructor' => $request->get('alternate_instructor') ? true : false,
            'guest_speaker' => $request->get('guest_speaker') ? true : false,
            'sponsors' => $request->get('sponsors') ? true : false,
            'flyer_image' => $request->get('flyer_image') ? true : false,
            'notes' => $request->get('notes')
        ];

        $class->approval()->delete();
        $approval = new Approval($approvalData);
        $class->approval()->save($approval);

        $data = ['status' => 'Approved'];
        if($request->hasFile('flyer'))
        {
            $data['flyer'] = $this->handleFileUpload($request->file('flyer'));
        }
        if($request->hasFile('flyer_image'))
        {
            $data['flyer_image'] = $this->handleFileUpload($request->file('flyer_image'));
        }
        if($request->hasFile('doc'))
        {
            $data['doc'] = $this->handleFileUpload($request->file('doc'));
        }
        $class->update($data);

        return response()->json([
            'class' => $class
        ], 200);
    }

    /**
     * @param Request $request
     * @param Lesson $class
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancel(Request $request, Lesson $class)
    {

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

    /**
     * @param $file
     * @return string
     */
    private function handleFileUpload($file) {
        $filenameonly = str_replace($file->getClientOriginalExtension(), "", $file->getClientOriginalName());
        $filename = time() . '-' . Str::slug($filenameonly, '-') .'.' . $file->getClientOriginalExtension();
        $path = '/uploads/classes/';
        $destinationPath = public_path() . $path;
        $file->move($destinationPath, $filename);
        return $path . $filename;
    }
}
