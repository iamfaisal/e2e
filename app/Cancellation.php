<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cancellation extends Model
{
    protected $fillable = [
        'lesson_id', 'reason'
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
