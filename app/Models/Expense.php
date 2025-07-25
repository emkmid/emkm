<?php

namespace App\Models;

use App\Traits\HasHashid;
use Illuminate\Database\Eloquent\Model;
use Vinkla\Hashids\Facades\Hashids;

class Expense extends Model
{
    use HasHashid;
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function expenseCategory()
    {
        return $this->belongsTo(ExpenseCategory::class);
    }

    public function getIdAttribute($value)
    {
        // Jika kamu tetap ingin bisa akses ID asli (misal id_raw), bisa buat accessor lain juga
        return Hashids::encode($this->attributes['id']);
    }

    public function getIdRawAttribute()
    {
        return $this->attributes['id'];
    }
}
