<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Regulation extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'abbreviation', 'commission_name', 'commission_abbreviation',
        'contact_first_name', 'contact_last_name', 'contact_email_address', 'contact_phone',
        'contact_street_address', 'contact_city', 'contact_state', 'contact_zip_code',
        'regulations', 'regulations_doc', 'ce_requirements_statement', 'must_specify_courses'
    ];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function territories()
    {
        return $this->hasMany(Territory::class);
    }

    public function sponsors()
    {
        return $this->hasMany(Sponsor::class);
    }
}
