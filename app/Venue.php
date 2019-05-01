<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    protected $fillable = [
        'name', 'regulation_id', 'address', 'city', 'zip_code', 'users'
    ];

    public function regulation()
    {
        return $this->belongsTo(Regulation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}
