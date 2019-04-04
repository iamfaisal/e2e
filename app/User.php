<?php

namespace App;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'status'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function routeNotificationForMail()
    {
        return $this->emailsToArray();
    }

    private function emailsToArray() {
        $userEmails = [$this->email];
        if(!is_null($email = $this->profile->additional_email)) {
            $userEmails[] = $email;
        }
        if(!is_null($email = $this->profile->additional_email2)) {
            $userEmails[] = $email;
        }
        return $userEmails;
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function allPermissions()
    {
        return $this->roles()->has('permissions')->with('permissions')->get();
    }

    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles->contains('name', $role);
        }

        return !! $role->intersect($this->roles)->count();
    }

    public function isJust($role) // expects the string
    {
        return $this->roles->count() === 1 && $this->roles->contains('name', $role);
    }

    public function assign($role)
    {
        if (is_string($role)) {
            return $this->roles()->save(
                Role::whereName($role)->firstOrFail()
            );
        }

        return $this->roles()->save($role);
    }

    public function enroll($lesson)
    {
        if (is_integer($lesson)) {
            return $this->enrollments()->save(
                Lesson::find($lesson)
            );
        }

        return $this->enrollments()->save($lesson);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function sponsors()
    {
        return $this->hasMany(Sponsor::class);
    }

    public function venues()
    {
        return $this->hasMany(Venue::class);
    }

    public function licenses()
    {
        return $this->hasMany(License::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function classes()
    {
        return $this->belongsToMany(Lesson::class);
    }

    public function enrollments()
    {
        return $this->belongsToMany(Lesson::class, 'lesson_student', 'student_id', 'lesson_id');
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }

    public function territories()
    {
        return $this->belongsToMany(Territory::class);
    }
}
