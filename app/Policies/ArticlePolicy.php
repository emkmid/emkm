<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ArticlePolicy
{
    public function edit(User $user, Article $article)
    {
        // Admin can edit all articles, or user can edit their own
        return $user->role === 'admin' || $user->id === $article->user_id;
    }
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Article $article): bool
    {
        // Admin can update all articles, or user can update their own
        return $user->role === 'admin' || $user->id === $article->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Article $article): bool
    {
        // Admin can delete all articles, or user can delete their own
        return $user->role === 'admin' || $user->id === $article->user_id;
    }
}
