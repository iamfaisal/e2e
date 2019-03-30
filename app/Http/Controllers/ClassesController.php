<?php

namespace App\Http\Controllers;

use App\Lesson;
use App\Approval;
use App\Cancellation;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ClassesController extends Controller
{
    private $user;

    /**
     * constructor function.
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->user = Auth::Guard('api')->user();
//        if (!$this->user) {
//            return response()->json([
//                'unauthenticated' => true
//            ], 403);
//        }
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $currentDateTime = Carbon::now()->toDateTimeString();
        $user = $this->user;
        $classes = Lesson::with('course', 'user', 'venue')
            ->orderBy('created_at', 'desc')
            ->where('is_deleted', false)
            ->when($request->archived, function ($query) use($currentDateTime) {
                return $query->where('end_date', '<', $currentDateTime);
            }, function ($query) use($currentDateTime) {
                return $query->where('end_date', '>=', $currentDateTime);
            })
            ->when($request->cancelled, function ($query) {
                return $query->where('is_cancelled', true);
            })
            ->when($request->fromInstructor, function ($query) use($user) {
                return $query->where('user_id', $user->id);
            });
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve(Request $request)
    {
        $class = Lesson::find($request->class_id);
        $approvalData = [
            'lesson_id' => $class->id,
            'start_time' => $request->get('start_time') ? true : false,
            'end_time' => $request->get('end_time') ? true : false,
            'course' => $request->get('course') ? true : false,
            'venue' => $request->get('venue') ? true : false,
            'price' => $request->get('price') ? true : false,
            'capacity' => $request->get('capacity') ? true : false,
            'alternate_instructor' => $request->get('alternate_instructor') ? true : false,
            'guest_speaker' => $request->get('guest_speaker') ? true : false,
            'sponsors' => $request->get('sponsors') ? true : false,
            'flyer_image' => $request->get('flyer_image_cb') ? true : false,
            'notes' => $request->get('notes')
        ];

        $class->approval()->delete();
        $approval = new Approval($approvalData);
        $class->approval()->save($approval);

        $data = [
            'status' => $request->get('status'),
            'is_approved' => $request->get('status') === "Approved" ? true : false
        ];
        if($request->hasFile('flyer'))
        {
            $data['flyer'] = $this->handleFileUpload($request->file('flyer'));
        }
        if($request->hasFile('flyer_image'))
        {
            $data['flyer_image'] = $this->handleFileUpload($request->file('flyer_image'));
        }
        if($request->hasFile('docs'))
        {
            $data['docs'] = $this->handleFileUpload($request->file('docs'));
        }
        $class->update($data);

        return response()->json([
            'class' => $class
        ], 200);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancel(Request $request)
    {
        $class = Lesson::find($request->class_id);
        $cancellationData = ['reason' => $request->get('reason')];
        $class->cancellation()->delete();
        $cancellation = new Cancellation($cancellationData);
        $class->cancellation()->save($cancellation);
        $class->update([
            'status' => 'Cancelled',
            'is_cancelled' => true
        ]);
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
        $class->update([
            'is_deleted' => true
        ]);
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
