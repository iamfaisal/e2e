<?php

namespace App\Http\Controllers;

use App\Category;
use App\Regulation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Course;

class CoursesController extends Controller
{
    private $user;

    /**
     * constructor function.
     */
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->user = Auth::Guard('api')->user();
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $courses = Course::
                    orderBy('created_at', 'desc')
					->when($request->workshop, function ($query) {
						return $query->where('is_workshop', true);
					}, function ($query) {
						return $query->where('is_workshop', false);
					})
					->with('regulation','categories:name,label');

        if ($request->has('active')) {
            $courses->where("is_deleted", false);
        }

        $categories = Category::all();
        $regulations = Regulation::all();
        return response()->json([
            'courses' => $courses->get(),
            'categories' => $categories,
            'regulations' => $regulations
        ], 200);
    }

    public function materials(Request $request)
    {
        $courses = Course::with('regulation')
            ->orderBy('created_at', 'desc')
            ->where("is_deleted", false)
			->when($request->workshop, function ($query) {
					return $query->where('is_workshop', true);
				}, function ($query) {
					return $query->where('is_workshop', false);
				})
			->whereHas('users', function($query) {
    			$query->where('id', $this->user->id);
			});
        $regulations = Regulation::all();
        return response()->json([
            'courses' => $courses->get(),
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
            'is_workshop' => $request->get('is_workshop'),
            'commercial_link' => $request->get('commercial_link')
        ];
        if($request->hasFile('class_flyer_template'))
        {
            $data['class_flyer_template'] = $this->handleFileUpload($request->file('class_flyer_template'));
        }
        if($request->hasFile('class_docs_template'))
        {
            $data['class_docs_template'] = $this->handleFileUpload($request->file('class_docs_template'));
        }
        if($request->hasFile('material'))
        {
            $data['material'] = $this->handleFileUpload($request->file('material'));
        }
        $course = Course::create($data);

        if($request->has('categories')) {
            $course->categories()->sync($request->categories);
        }

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
            'course' => $course,
            'categories' => $course->categories
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
            $data['class_flyer_template'] = $this->handleFileUpload($request->file('class_flyer_template'));
        }
        if($request->hasFile('class_docs_template'))
        {
            $data['class_docs_template'] = $this->handleFileUpload($request->file('class_docs_template'));
        }
        if($request->hasFile('material'))
        {
            $data['material'] = $this->handleFileUpload($request->file('material'));
        }
        if($request->has('categories')) {
            $course->categories()->sync($request->categories);
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
            'is_deleted' => !$course->is_deleted
        ]);
        return response()->json([
            'course' => 'success'
        ], 200);
    }

    /**
     * @param $file
     * @return string
     */
    private function handleFileUpload($file) {
        $filenameonly = str_replace($file->getClientOriginalExtension(), "", $file->getClientOriginalName());
        $filename = time() . '-' . Str::slug($filenameonly, '-') .'.' . $file->getClientOriginalExtension();
        $path = '/storage/courses/';
        $destinationPath = public_path() . $path;
        $file->move($destinationPath, $filename);
        return $path . $filename;
    }
}
