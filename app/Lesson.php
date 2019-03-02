<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'course_id', 'venue_id', 'start_date', 'end_date', 'price', 'capacity',
        'alternate_instructor', 'guest_speaker', 'rsvp_contact', 'rsvp_phone', 'rsvp_email',
        'rsvp_link_text', 'rsvp_link_url', 'flyer', 'flyer_image', 'docs', 'roster', 'status',
        'is_approved', 'is_deleted', 'is_cancelled'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function approval()
    {
        return $this->hasOne(Approval::class);
    }

    public function cancellation()
    {
        return $this->hasOne(Cancellation::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class);
    }

    public function sponsors()
    {
        return $this->belongsToMany(Sponsor::class);
    }
}
