<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    use Sluggable;

    protected $fillable = [
        'user_id','title','excerpt','content_html','meta','published_at', 'thumbnail_path', 'reading_time'
    ];

    protected $appends = ['thumbnail_url'];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'onUpdate' => false,
            ]   
        ];
    }

    /**
     * Get the full URL for the thumbnail
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail_path) {
            return null;
        }

        // Check if it's already a full URL
        if (filter_var($this->thumbnail_path, FILTER_VALIDATE_URL)) {
            return $this->thumbnail_path;
        }

        // Return a relative URL so it works regardless of APP_URL/ngrok host and avoids mixed-content issues
        return '/storage/' . ltrim($this->thumbnail_path, '/');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany {
        return $this->hasMany(ArticleImage::class);
    }
    
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function likes()
    {
        return $this->hasMany(ArticleLike::class);
    }

    public function likedByUsers()
    {
        return $this->belongsToMany(User::class, 'article_likes')
                    ->withTimestamps();
    }

    public function isLikedBy(User $user)
    {
        return $this->likedByUsers->contains('id', $user->id);
    }
}
