<?php

namespace App\Models;

use App\Traits\HasHashid;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasHashid;
    protected $guarded = ['id'];
}
