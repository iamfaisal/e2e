<?php

namespace App;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'status', 'deleted'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function routeNotificationForMail()
    {
        return $this->emailsToArray();
    }

    public function emailsToArray() {
        $userEmails = [$this->email];
        if(is_object($this->profile) && property_exists($this->profile, "additional_email")) {
            $userEmails[] = $this->profile->additional_email;
        }
        if(is_object($this->profile) && property_exists($this->profile, "additional_email2")) {
            $userEmails[] = $this->profile->additional_email2;
        }
        return array_filter($userEmails);
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
