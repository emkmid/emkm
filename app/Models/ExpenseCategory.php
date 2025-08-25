<?php

namespace App\Models;

use App\Traits\HasHashid;
use Illuminate\Database\Eloquent\Model;

class ExpenseCategory extends Model
{
    use HasHashid;
    protected $guarded = ['id'];

    public function account()
    {
        return $this->belongsTo(ChartOfAccount::class, 'account_id');
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
