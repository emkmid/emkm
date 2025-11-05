<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasHashid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Vinkla\Hashids\Facades\Hashids;

class Expense extends Model
{
    use HasFactory, HasHashid, Auditable;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'expense_category_id',
        'description',
        'amount',
        'date',
    ];

    /**
     * Tipe data asli untuk atribut.
     *
     * @var array
     */
    protected $casts = [
        'date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function expense_category(): BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class);
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
