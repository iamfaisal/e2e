<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cancellation extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'lesson_id', 'reason'
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
