<?php

namespace App\Policies;

use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductCategoryPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProductCategory $productCategory): bool
    {
        return $user->id === $productCategory->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProductCategory $productCategory): bool
    {
        return $user->id === $productCategory->user_id;
    }
}
