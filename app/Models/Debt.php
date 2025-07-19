<?php

namespace App\Models;

use App\Traits\HasHashid;
use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    use HasHashid;
    protected $guarded = ['id'];
}
