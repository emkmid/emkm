<?php

namespace App\Http\Controllers\Education;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EducationController extends Controller
{
    public function articles()
    {
        $articles = Article::query()
            ->whereNotNull('published_at')
            ->latest('published_at')
            // include thumbnail_path so frontend can render thumbnails
            ->select('id', 'title', 'slug', 'excerpt', 'published_at', 'created_at', 'thumbnail_path')
            ->paginate(12);

        return Inertia::render('education/article/index', compact('articles'));
    }

    public function articleShow(Article $article)
    {
        // Make sure the article is published
        if (!$article->published_at) {
            abort(404);
        }

        // Load related articles (same category or recent articles)
        $relatedArticles = Article::query()
            ->whereNotNull('published_at')
            ->where('id', '!=', $article->id)
            ->latest('published_at')
            ->limit(3)
            ->select('id', 'title', 'slug', 'excerpt', 'published_at')
            ->get();

        return Inertia::render('education/article/show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
            'totalLikes' => $article->likedByUsers()->count()
        ]);
    }
    
    public function toggleLike(Article $article)
    {
        $user = Auth::user();
        $article->likedByUsers()->toggle($user->id);
        // cek status setelah toggle (true kalau sudah like, false kalau unlike)
        $liked = $article->likedByUsers()->where('user_id', $user->id)->exists();
        return response()->json([
            'liked' => $liked,
            'totalLikes' => $article->likedByUsers()->count(),
        ]);
    }

    public function likeStatus(Article $article)
    {
        $user = Auth::user();

        return response()->json([
            'liked' => $article->isLikedBy($user),
            'totalLikes' => $article->likedByUsers()->count(),
        ]);
    }
}
