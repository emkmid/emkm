<?php

namespace App\Http\Controllers\Education;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Models\Article;
use App\Services\ArticleImageUploader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $articles = Article::query()
            ->latest('published_at')
            ->select('id','title','slug','excerpt','published_at','created_at')
            ->paginate(12);
        return Inertia::render('dashboard/admin/education/article/index', compact('articles'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dashboard/admin/education/article/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        $validatedData = $request->validated();

        $validatedData['user_id'] = $request->user()->id;

        if ($request->hasFile('thumbnail_path')) {
            $path = $request->file('thumbnail_path')->store('article-images');
            $validatedData['thumbnail_path'] = $path;
        }

        $article = Article::create($validatedData);

        return redirect()->route('articles.index')->with('success', 'Article created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        return Inertia::render('dashboard/admin/education/article/show', compact('article'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        Gate::authorize('edit', $article);
        return Inertia::render('Articles/Edit', [
            'article' => $article->only('id','title','excerpt','content_html','slug','meta','published_at'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article)
    {
        Gate::authorize('update', $article);
        $article->update([
            'title' => $request->input('title'),
            'excerpt' => $request->input('excerpt'),
            'content_html' => $request->sanitizedContent(),
            'meta' => $request->input('meta'),
            'published_at' => $request->input('published_at'),
        ]);

        return back()->with('success','Saved.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        Gate::authorize('delete', $article);
        $article->delete();
        return redirect()->route('articles.index')->with('success','Deleted.');
    }

    public function upload(Request $request, ArticleImageUploader $uploader) {
        $request->validate(['image' => ['required','image','max:3072']]);
        $img = $uploader->upload($request->file('image'), $request->user()->id);

        return response()->json([
            'url' => $img->url(),
            'href' => $img->url(),
        ]);
    }
}
