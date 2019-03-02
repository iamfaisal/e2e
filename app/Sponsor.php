<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sponsor extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'regulation_id', 'user_id', 'company', 'first_name', 'last_name', 'email', 'phone',
        'extension', 'avatar', 'logo', 'address', 'city', 'zip_code'
    ];

    public function regulation()
    {
        return $this->belongsTo(Regulation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classes()
    {
        return $this->belongsToMany(Lesson::class);
    }
}
