<?php

namespace App\Models;

use App\Traits\HasHashid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Vinkla\Hashids\Facades\Hashids;

class Product extends Model
{
    use HasFactory, HasHashid;

    protected $fillable = [
        'product_category_id',
        'name',
        'price',
        'stock',
    ];

    public function product_category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
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
