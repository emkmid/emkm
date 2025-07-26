<?php

namespace App\Policies;

use App\Models\IncomeCategory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class IncomeCategoryPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, IncomeCategory $incomeCategory): bool
    {
        return $user->id === $incomeCategory->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, IncomeCategory $incomeCategory): bool
    {
        return $user->id === $incomeCategory->user_id;
    }
}
