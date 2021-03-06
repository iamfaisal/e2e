<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title', 'regulation_id', 'number', 'code', 'hours', 'description', 'expiration_date',
        'class_flyer_template', 'class_docs_template', 'material', 'commercial_link', 
		'is_deleted', 'is_workshop'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function assign($category)
    {
        if (is_string($category)) {
            return $this->categories()->save(
                Category::whereName($category)->firstOrFail()
            );
        }

        return $this->categories()->save($category);
    }

    public function regulation()
    {
        return $this->belongsTo(Regulation::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
