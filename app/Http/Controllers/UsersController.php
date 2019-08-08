<?php

namespace App\Http\Controllers;

use App\Course;
use App\Lesson;
use App\License;
use App\Profile;
use App\Territory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\User;
use App\Notifications\InstructorApproval;
use App\Notifications\InstructorCreated;
use App\Notifications\InstructorNewCourse;
use App\Notifications\InstructorNewLicense;
use App\Notifications\InstructorUpdated;

class UsersController extends Controller
{
    private $user;

    /**
     * constructor function.
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['enroll']]);
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
        $relations = ['roles', 'profile', 'licenses'];
        $request->has('role') && $request->role == 'instructor' ? array_push($relations,'licenses') : null;
        $users = User::whereHas('roles', function ($q) use ($request) {
            $q->where('name', $request->role);
        })->with($relations)->get();

        return response()->json([
            'users' => $users
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
            'name'      => explode('@', $request->email)[0],
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'status'    => $request->status ? true : false
        ];

        $profileData = [
            'first_name'        => $request->first_name,
            'last_name'         => $request->last_name,
            'sub_domain'        => $request->sub_domain,
            'address'           => $request->address,
            'city'              => $request->city,
            'state'             => $request->state,
            'zip_code'          => $request->zip_code,
            'cell_phone'        => $request->cell_phone,
            'work_phone'        => $request->work_phone,
            'additional_name'   => $request->additional_name,
            'additional_email'  => $request->additional_email,
            'additional_name2'  => $request->additional_name2,
            'additional_email2' => $request->additional_email2,
            'info'              => $request->info
        ];
        if($request->hasFile('avatar'))
        {
            $profileData['avatar'] = $this->handleFileUpload($request->file('avatar'));
        }
        if($request->hasFile('application_docs'))
        {
            $profileData['application_docs'] = $this->handleFileUpload($request->file('application_docs'));
        }
        if($request->hasFile('custom_flyer'))
        {
            $profileData['custom_flyer'] = $this->handleFileUpload($request->file('custom_flyer'));
        }

        $user = User::create($data);
        $profile = new Profile($profileData);
        $user->profile()->save($profile);

        if($request->has('roles')) {
            if (in_array(3, $request->roles) && $request->has('licenses')) {
                $user->licenses()->delete();
                foreach ($request->licenses as $index => $license) {
					var_dump($license);
                    if (!empty($license['regulation']) && !empty($license['code']) && !empty($license['expiration'])) {
                        $licenseData = [
                            'regulation_id' => $license['regulation'],
                            'user_id' => $user->id,
                            'code' => $license['code'],
                            'expiration' => $license['expiration']
                        ];
                        if($_FILES['licenses']['name'][$index] && !empty($_FILES['licenses']['name'][$index]['certificate'])) {
                            $licenseData['certificate'] = $this->handleFileUpload($license['certificate']);
                        } else {
                            $licenseData['certificate'] = $license['certificate_file'];
                        }
                        //$user->notify(new InstructorNewLicense($profileData['first_name'], $license['code']));
                        License::create($licenseData);
                    }
                }
                $user->notify(new InstructorCreated($profileData['first_name']));
            } else {
                $user->roles()->sync($request->roles);
            }
        }

        return response()->json([
            'user' => $user,
            'profile' => $user->profile,
            'roles' => $user->roles->pluck('id')
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $regulations = $user->licenses->pluck('regulation_id');
        $courses = Course::whereIn('regulation_id', $regulations)->orderBy('created_at', 'desc')->get();
        $territories = Territory::whereIn('regulation_id', $regulations)->orderBy('created_at', 'desc')->get();
        return response()->json([
            'user' => $user,
            'user_courses' => $user->courses->pluck('id'),
            'user_territories' => $user->territories->pluck('id'),
            'profile' => $user->profile,
            'licenses' => $user->licenses,
            'courses' => $courses,
            'territories' => $territories,
            'roles' => $user->roles->pluck('id')
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  User $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $data = [
            'name'      => explode('@', $request->email)[0],
            'email'     => $request->email,
            'status'    => $request->status ? true : false
        ];
        if($request->has('password'))
        {
            $data['password'] = Hash::make($request->password);
        }
        $profileData = [
            'first_name'        => $request->first_name,
            'last_name'         => $request->last_name,
            'sub_domain'        => $request->sub_domain,
            'address'           => $request->address,
            'city'              => $request->city,
            'state'             => $request->state,
            'zip_code'          => $request->zip_code,
            'cell_phone'        => $request->cell_phone,
            'work_phone'        => $request->work_phone,
            'additional_name'   => $request->additional_name,
            'additional_email'  => $request->additional_email,
            'additional_name2'  => $request->additional_name2,
            'additional_email2' => $request->additional_email2,
            'info'              => $request->info
        ];
        if($request->hasFile('avatar'))
        {
            $profileData['avatar'] = $this->handleFileUpload($request->file('avatar'));
        }
        if($request->hasFile('application_docs'))
        {
            $profileData['application_docs'] = $this->handleFileUpload($request->file('application_docs'));
        }
        if($request->hasFile('custom_flyer'))
        {
            $profileData['custom_flyer'] = $this->handleFileUpload($request->file('custom_flyer'));
        }

        $user->update($data);
        $user->profile()->update($profileData);

        if($request->has('roles')) {
            if (in_array(3, $request->roles) && $request->has('licenses')) {
                $user->licenses()->delete();
                foreach ($request->licenses as $index => $license) {
                    if (!empty($license['regulation']) && !empty($license['code']) && !empty($license['expiration'])) {
                        $licenseData = [
                            'regulation_id' => $license['regulation'],
                            'user_id' => $user->id,
                            'code' => $license['code'],
                            'expiration' => $license['expiration']
                        ];
                        if ($_FILES['licenses']['name'][$index] && !empty($_FILES['licenses']['name'][$index]['certificate'])) {
                            $licenseData['certificate'] = $this->handleFileUpload($license['certificate']);
                            $user->notify(new InstructorNewLicense($profileData['first_name'], $licenseData['code']));
                        } else {
                            $licenseData['certificate'] = $license['certificate_file'];
                        }
                        License::create($licenseData);
                    }
                }
            } else {
                $user->roles()->sync($request->roles);
            }
            if (in_array(3, $request->roles))
            {
				$coursesData = array_merge($request->courses, $request->workshops);
                $user->courses()->sync($coursesData);
                $user->territories()->sync($request->territories);
                $user->notify(new InstructorUpdated($profileData['first_name']));
                if ($coursesData) {
                    foreach ($coursesData as $courseID) {
                        $course = Course::find($courseID);
                        $user->notify(new InstructorNewCourse($profileData['first_name'], $course));
                    }
                }
            }
        }

        return response()->json([
            'user' => $user,
            'profile' => $user->profile,
            'roles' => $user->roles->pluck('id')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  User $user
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(User $user)
    {
        $status = $user->status == 1 ? 0 : 1;
        $user->update(['deleted' => true, 'status' => $status]);
        return response()->json([
            'user' => 'success'
        ], 200);
    }

    private function canUserPerformOn($userID, $checkSelf = false) {
        $currentUser = $this->user;
        $user = User::find($userID);
        $checkSelf = $checkSelf ? $currentUser->id !== $user->id : true;
        if (
            ($currentUser->hasRole("system") && !$user->hasRole("system") && $checkSelf)
            ||
            ($currentUser->hasRole("admin") && !$user->hasRole("admin") && $checkSelf)
        ) {
            return true;
        } else {
            return false;
        }
    }

    public function revertStatus($userID)
    {
        if ($this->canUserPerformOn($userID, true)) {
            $user = User::find($userID);
            $status = $user->status == 1 ? 0 : 1;
            $user->update(['status' => $status]);
            if ($user->status == 1) {
                $user->notify(new InstructorApproval($user->profile->first_name));
            }
            return response()->json([
                'user' => 'success'
            ], 200);
        } else {
            return response()->json([
                'user' => 'error'
            ], 501);
        }
    }

    public function enroll($userID, $classID)
    {
        $student = User::find($userID);
        $class   = Lesson::find($classID);
        if ($student && $class) {
            $enrollment = $student->enroll($class);
            return response()->json([
                'response' => $enrollment
            ], 200);
        } else {
            return response()->json([
                'response' => 'Requested resource could not be found!'
            ], 501);
        }
    }

    /**
     * @param $file
     * @return string
     */
    private function handleFileUpload($file) {
        $filenameonly = str_replace($file->getClientOriginalExtension(), "", $file->getClientOriginalName());
        $filename = time() . '-' . Str::slug($filenameonly, '-') .'.' . $file->getClientOriginalExtension();
        $path = '/storage/users/';
        $destinationPath = public_path() . $path;
        $file->move($destinationPath, $filename);
        return $path . $filename;
    }
}
