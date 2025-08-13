<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $guarded = ['id'];

    public function entries()
    {
        return $this->hasMany(JournalEntry::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
