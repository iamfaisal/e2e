<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
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
}
