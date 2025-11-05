<?php

namespace App\Http\Controllers\Examples;

use App\Models\Article;
use App\Services\FeatureService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * EXAMPLE: Article Controller dengan Feature Limits
 */
class ArticleControllerExample
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }

    public function create(Request $request)
    {
        $user = $request->user();

        // 1. Cek apakah bisa buat artikel
        if (!$this->featureService->hasAccess($user, 'articles.create')) {
            return redirect()
                ->route('dashboard')
                ->with('error', 'Fitur artikel tidak tersedia di paket Anda.');
        }

        // 2. Cek limit total artikel
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

        // 3. Cek apakah bisa upload gambar
        $canUploadImages = $this->featureService->hasAccess($user, 'articles.images');

        return Inertia::render('articles/create', [
            'canUploadImages' => $canUploadImages,
            'quota' => [
                'current' => $articleCount,
                'limit' => $this->featureService->getLimit($user, 'articles.max_count'),
                'remaining' => $this->featureService->getRemainingQuota($user, 'articles.max_count', $articleCount),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Double check
        if (!$this->featureService->hasAccess($user, 'articles.create')) {
            abort(403);
        }

        $articleCount = $user->articles()->count();
        if ($this->featureService->hasReachedLimit($user, 'articles.max_count', $articleCount)) {
            return redirect()->back()->with('error', 'Limit artikel tercapai.');
        }

        // Validate
        $rules = [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
        ];

        // Hanya allow image upload jika paket support
        if ($this->featureService->hasAccess($user, 'articles.images')) {
            $rules['images'] = 'nullable|array|max:5';
            $rules['images.*'] = 'image|mimes:jpeg,png,jpg,gif|max:2048';
        }

        $validated = $request->validate($rules);

        $article = Article::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'],
        ]);

        // Handle images jika allowed
        if ($this->featureService->hasAccess($user, 'articles.images') && $request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Store image...
            }
        }

        return redirect()
            ->route('articles.show', $article)
            ->with('success', 'Artikel berhasil dibuat!');
    }
}
