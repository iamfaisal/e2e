<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Territory extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'regulation_id', 'zip_codes'
    ];

    public function regulation()
    {
        return $this->belongsTo(Regulation::class);
    }
}
