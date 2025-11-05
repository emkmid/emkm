<?php

namespace App\Http\Middleware;

use App\Services\FeatureService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckFeatureAccess
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $featureKey): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$this->featureService->hasAccess($user, $featureKey)) {
            return redirect()->route('dashboard')->with('error', 
                'Fitur ini tidak tersedia di paket Anda. Upgrade untuk mengaksesnya.'
            );
        }

        return $next($request);
    }
}
