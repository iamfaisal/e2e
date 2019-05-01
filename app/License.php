<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class License extends Model
{
    protected $fillable = [
        'user_id', 'regulation_id', 'code', 'certificate', 'expiration'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
