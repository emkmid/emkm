<?php

namespace App\Http\Controllers\Education;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Models\Article;
use App\Services\ArticleImageUploader;
use App\Services\FeatureService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArticleController extends Controller
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }
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
        $user = auth()->user();

        // Check if user has access to create articles
        if (!$this->featureService->hasAccess($user, 'articles.create')) {
            return redirect()
                ->route('articles.index')
                ->with('error', 'Fitur artikel tidak tersedia di paket Anda.');
        }

        // Check article limit
        $articleCount = $user->articles()->count();
        
        if ($this->featureService->hasReachedLimit($user, 'articles.max_count', $articleCount)) {
            $limit = $this->featureService->getLimit($user, 'articles.max_count');
            
            return redirect()
                ->route('articles.index')
                ->with('error', "Anda telah mencapai batas {$limit} artikel. Upgrade untuk membuat lebih banyak artikel.")
                ->with('upgrade_prompt', [
                    'feature' => 'More Articles',
                    'current_limit' => $limit,
                    'basic_limit' => 50,
                    'pro_limit' => 'Unlimited',
                ]);
        }

        // Check if user can upload images
        $canUploadImages = $this->featureService->hasAccess($user, 'articles.images');

        $limit = $this->featureService->getLimit($user, 'articles.max_count');

        return Inertia::render('dashboard/admin/education/article/create', [
            'canUploadImages' => $canUploadImages,
            'quota' => [
                'current' => $articleCount,
                'limit' => $limit,
                'remaining' => $this->featureService->getRemainingQuota($user, 'articles.max_count', $articleCount),
                'is_unlimited' => $limit === -1,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        $user = $request->user();

        // Double check feature access
        if (!$this->featureService->hasAccess($user, 'articles.create')) {
            abort(403, 'Anda tidak memiliki akses ke fitur ini.');
        }

        // Check limit again
        $articleCount = $user->articles()->count();
        if ($this->featureService->hasReachedLimit($user, 'articles.max_count', $articleCount)) {
            return redirect()
                ->back()
                ->with('error', 'Limit artikel tercapai. Upgrade untuk membuat lebih banyak artikel.');
        }

        $validatedData = $request->validated();
        $validatedData['user_id'] = $user->id;
        $validatedData['reading_time'] = $this->calculateReadingTime($validatedData['content_html']);

        // Only allow thumbnail upload if user has access
        if ($request->hasFile('thumbnail_path')) {
            if ($this->featureService->hasAccess($user, 'articles.images')) {
                $validatedData['thumbnail_path'] = $request->file('thumbnail_path')->store('article-images');
            } else {
                return redirect()
                    ->back()
                    ->with('error', 'Upgrade ke paket Basic untuk upload gambar artikel.');
            }
        }

        Article::create($validatedData);

        return redirect()->route('articles.index')->with('success', 'Artikel berhasil dibuat.');
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
        return Inertia::render('dashboard/admin/education/article/edit', [
            'article' => $article->only('id','title','excerpt','content_html','slug','meta','published_at'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article)
    {
        Gate::authorize('update', $article);

        $validatedData = $request->validate([
            'title'         => 'sometimes|required|string|max:255',
            'excerpt'       => 'sometimes|required|string',
            'content_html'  => 'sometimes|required|string',
            'published_at'  => 'sometimes|required|date',
            'thumbnail_path'=> 'nullable|image',
        ]);

        $validatedData['user_id'] = $article->user_id;

        $validatedData['reading_time'] = $this->calculateReadingTime(
            $validatedData['content_html'] ?? $article->content_html
        );

        if ($request->hasFile('thumbnail_path')) {
            if ($article->thumbnail_path) {
                Storage::delete($article->thumbnail_path);
            }
            $path = $request->file('thumbnail_path')->store('article-images');
            $validatedData['thumbnail_path'] = $path;
        }

        $article->update($validatedData);

        return redirect()
            ->route('articles.index')
            ->with('success', 'Article updated successfully.');
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

    private function calculateReadingTime($content)
    {
        $words = str_word_count(strip_tags($content));
        $minutes = ceil($words / 200);
        return $minutes;
    }
}
