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
        return Inertia::render('education/article/show', compact('article'));
    }
}
