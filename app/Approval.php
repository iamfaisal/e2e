<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Approval extends Model
{
    protected $fillable = [
        'lesson_id', 'start_time', 'end_time', 'course', 'venue', 'price',
        'capacity', 'alternate_instructor', 'guest_speaker', 'sponsors', 'flyer_image', 'notes',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
