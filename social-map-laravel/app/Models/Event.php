<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'location',
        'description',
        'start_time',
        'end_time',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
