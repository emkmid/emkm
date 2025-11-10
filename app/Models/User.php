<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Auditable;

    /**
     * Fields to audit (empty means all fields will be audited)
     */
    protected $auditableFields = ['name', 'email', 'role'];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'google_id',
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

    public function articles()
    {
        return $this->hasMany(Article::class);
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

    public function userNotifications()
    {
        return $this->hasMany(UserNotification::class);
    }

    public function unreadNotifications()
    {
        return $this->hasMany(UserNotification::class)->unread();
    }

    public function businessProfile()
    {
        return $this->hasOne(BusinessProfile::class);
    }

    /**
     * Get all customers for this user.
     */
    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    /**
     * Get all invoices for this user.
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
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
     * Note: This is set dynamically in HandleInertiaRequests middleware, not from database
     */
    public function getCurrentSubscriptionAttribute()
    {
        // Check if it's already been set (from middleware)
        if (isset($this->attributes['current_subscription'])) {
            return $this->attributes['current_subscription'];
        }
        
        // Otherwise, load it fresh
        return $this->subscriptions()
            ->whereIn('status', ['active', 'trial'])
            ->latest('starts_at')
            ->with('package')
            ->first();
    }

    /**
     * Mutator to prevent current_subscription from being saved to database
     */
    public function setCurrentSubscriptionAttribute($value)
    {
        // Store in attributes array but won't be saved to database
        // because it's not in fillable or database columns
        $this->attributes['current_subscription'] = $value;
    }

    /**
     * Get auditable attributes, excluding virtual attributes
     */
    protected function getAuditableAttributes()
    {
        $attributes = $this->getAttributes();
        
        // Exclude virtual/appended attributes that don't exist in database
        unset($attributes['current_subscription']);
        
        return $attributes;
    }

    /**
     * Override getDirty to exclude current_subscription from updates
     */
    public function getDirty()
    {
        $dirty = parent::getDirty();
        
        // Remove current_subscription as it's not a database column
        unset($dirty['current_subscription']);
        
        return $dirty;
    }
}
