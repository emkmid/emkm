<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

        /**
         * Attributes to append when serializing the model (so Inertia receives current subscription).
         *
         * @var array<int, string>
         */
        protected $appends = [
            'current_subscription',
        ];
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function incomes()
    {
        return $this->hasMany(Income::class);
    }

    public function expenseCategories()
    {
        return $this->hasMany(ExpenseCategory::class);
    }

    public function incomeCategories()
    {
        return $this->hasMany(IncomeCategory::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function productCategories()
    {
        return $this->hasMany(ProductCategory::class);
    }

    public function debts()
    {
        return $this->hasMany(Debt::class);
    }
    public function receivables()
    {
        return $this->hasMany(Receivable::class);
    }

    public function likes()
    {
        return $this->hasMany(ArticleLike::class);
    }

    public function likedArticles()
    {
        return $this->belongsToMany(Article::class, 'article_likes')
                    ->withTimestamps();
    }

    /**
     * User subscriptions (history). A user can have many subscriptions over time.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Current active subscription relationship (returns latest active/trial subscription if any).
     */
    public function currentSubscription()
    {
        return $this->hasOne(Subscription::class)->whereIn('status', ['active', 'trial'])->latest('starts_at');
    }

    /**
     * Accessor used by Inertia share to include the current subscription with package relation.
     */
    public function getCurrentSubscriptionAttribute()
    {
        // eager load package on the subscription for frontend convenience
        return $this->subscriptions()->whereIn('status', ['active', 'trial'])->latest('starts_at')->with('package')->first();
    }
}
