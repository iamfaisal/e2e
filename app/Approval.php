<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Approval extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'lesson_id', 'class_date', 'start_time', 'end_time', 'course', 'venue', 'price',
        'capacity', 'alternate_instructor', 'guest_speaker', 'sponsors', 'flyer_image', 'notes',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
