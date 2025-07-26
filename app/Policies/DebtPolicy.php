<?php

namespace App\Policies;

use App\Models\Debt;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DebtPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Debt $debt): bool
    {
        return $user->id === $debt->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Debt $debt): bool
    {
        return $user->id === $debt->user_id;
    }
}
