<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;

    const STATUS_ACTIVE = 'active';
    const STATUS_UPCOMING = 'upcoming';
    const STATUS_FINISHED = 'finished';
    const STATUS_CANCELED = 'canceled';

    protected $fillable = [
        'title',
        'location',
        'latitude',
        'longitude',
        'description',
        'start_time',
        'end_time',
        'status',
        'preview_image',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getStatusAttribute()
    {
        $dbStatus = $this->attributes['status'] ?? self::STATUS_UPCOMING;
        $start = Carbon::parse($this->start_time, 'Europe/Kyiv')->setTimezone('UTC');
        $end = Carbon::parse($this->end_time, 'Europe/Kyiv')->setTimezone('UTC');
        if ($dbStatus === self::STATUS_CANCELED) {
            return self::STATUS_CANCELED;
        }
        if (now()->lt($start)) {
            return self::STATUS_UPCOMING;
        }
        if (now()->between($start, $end)) {
            return self::STATUS_ACTIVE;
        }
        return self::STATUS_FINISHED;
    }
}
