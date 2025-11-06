<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class QueryLogger
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only enable in local environment or when explicitly enabled
        if (!config('app.debug') || !config('database.log_queries', false)) {
            return $next($request);
        }

        $startTime = microtime(true);
        
        // Enable query logging
        DB::enableQueryLog();
        
        $response = $next($request);
        
        $queries = DB::getQueryLog();
        $executionTime = (microtime(true) - $startTime) * 1000; // Convert to ms
        
        // Log slow queries (> 100ms)
        $slowQueries = array_filter($queries, function($query) {
            return $query['time'] > 100;
        });
        
        if (count($slowQueries) > 0) {
            Log::warning('Slow queries detected', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'queries' => $slowQueries,
                'total_time' => $executionTime . 'ms'
            ]);
        }
        
        // Log requests with too many queries (> 20)
        if (count($queries) > 20) {
            Log::warning('Too many queries', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'query_count' => count($queries),
                'total_time' => $executionTime . 'ms'
            ]);
        }
        
        // Add debug header in development
        if (config('app.debug')) {
            $response->headers->set('X-Query-Count', count($queries));
            $response->headers->set('X-Query-Time', round($executionTime, 2) . 'ms');
        }
        
        return $response;
    }
}
