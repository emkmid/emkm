<?php

namespace App\Http\Controllers\Education;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EducationController extends Controller
{
    public function articles()
    {
        $articles = Article::query()
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->select('id', 'title', 'slug', 'excerpt', 'published_at', 'created_at')
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
        ]);
    }
}
