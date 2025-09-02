<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'avatar',
        'location',
        'phone',
        'interests',
        'event_counts',
        'event_created',
        'rating',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
