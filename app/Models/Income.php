<?php

namespace App\Models;

use App\Traits\HasHashid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Vinkla\Hashids\Facades\Hashids;

class Income extends Model
{
    use HasFactory, HasHashid;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'income_category_id',
        'date',
        'amount',
        'description',
    ];

    /**
     * Get the income_category that owns the Income
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function income_category(): BelongsTo
    {
        return $this->belongsTo(IncomeCategory::class);
    }

    /**
     * Get the user that owns the Income
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
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
