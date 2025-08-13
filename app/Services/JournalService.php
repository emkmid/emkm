<?php
namespace App\Services;

use App\Models\Journal;
use App\Models\JournalEntry;
use Illuminate\Support\Facades\DB;

class JournalService
{
    public static function add($userId, $date, $description, $entries)
    {
        return DB::transaction(function () use ($userId, $date, $description, $entries) {
            $journal = Journal::create([
                'user_id' => $userId,
                'date' => $date,
                'description' => $description,
            ]);

            foreach ($entries as $entry) {
                JournalEntry::create([
                    'journal_id' => $journal->id,
                    'account_id' => $entry['account_id'],
                    'type' => $entry['type'],
                    'amount' => $entry['amount'],
                ]);
            }

            return $journal;
        });
    }
}
