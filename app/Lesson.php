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
}
