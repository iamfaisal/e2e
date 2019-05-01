<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name', 'label'
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }
}
