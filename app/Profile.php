<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'last_name', 'sub_domain', 'address', 'city', 'state', 'zip_code', 'cell_phone',
        'work_phone', 'additional_name', 'additional_email', 'additional_name2', 'additional_email2',
        'info', 'avatar', 'application_docs', 'custom_flyer'
    ];
}
