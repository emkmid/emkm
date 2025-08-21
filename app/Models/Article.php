<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Article extends Model
{
    use Sluggable;

    protected $fillable = [
        'user_id','title','excerpt','content_html','meta','published_at', 'thumbnail_path', 'reading_time'
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
                'onUpdate' => false,
            ]   
        ];
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
