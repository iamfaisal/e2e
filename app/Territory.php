<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Territory extends Model
{
    protected $fillable = [
        'name', 'regulation_id', 'zip_codes'
    ];

    public function regulation()
    {
        return $this->belongsTo(Regulation::class);
    }
}
