<?php

namespace App\Services;

use App\Models\Journal;
use App\Models\JournalEntry;

class AccountingService
{
    public static function isNormalDebit(string $type): bool
    {
        return in_array($type, ['aset','biaya'], true);
    }

    public static function endingBalance(string $type, float $sumDebit, float $sumCredit): float
    {
        return self::isNormalDebit($type)
            ? ($sumDebit - $sumCredit)
            : ($sumCredit - $sumDebit);
    }
}