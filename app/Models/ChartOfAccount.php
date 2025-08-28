<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChartOfAccount extends Model
{
    protected $guarded = ['id'];

    public function expenseCategories()
    {
        return $this->hasMany(ExpenseCategory::class, 'account_id');
    }

    public function incomeCategories()
    {
        return $this->hasMany(IncomeCategory::class, 'account_id');
    }

    public function journalEntries()
    {
        return $this->hasMany(JournalEntry::class, 'account_id');
    }
}
