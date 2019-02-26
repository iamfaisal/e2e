<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Territory extends Model
{
    public function regulation()
    {
        return $this->belongsTo(Regulation::class);
    }
}
