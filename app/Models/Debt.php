<?php

namespace App\Models;

use App\Traits\HasHashid;
use Illuminate\Database\Eloquent\Model;
use Vinkla\Hashids\Facades\Hashids;

class Debt extends Model
{
    use HasHashid;
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getIdAttribute($value)
    {
        return Hashids::encode($this->attributes['id']);
    }

    public function getIdRawAttribute()
    {
        return $this->attributes['id'];
    }
}
