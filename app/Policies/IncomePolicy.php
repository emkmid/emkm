<?php

namespace App\Policies;

use App\Models\Income;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class IncomePolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Income $income): bool
    {
        return $user->id === $income->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Income $income): bool
    {
        return $user->id === $income->user_id;
    }
}
