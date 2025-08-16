<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ArticleImage extends Model
{
    protected $fillable = ['article_id','user_id','disk','path','size','mime'];

    public function article(): BelongsTo { return $this->belongsTo(Article::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }

    public function url(): string {
        return Storage::disk($this->disk)->url($this->path);
    }
}
