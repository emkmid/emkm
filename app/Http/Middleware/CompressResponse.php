<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompressResponse
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only compress if client accepts gzip
        $acceptEncoding = $request->header('Accept-Encoding', '');
        
        if (!str_contains($acceptEncoding, 'gzip')) {
            return $response;
        }

        // Don't compress already compressed content or images
        $contentType = $response->headers->get('Content-Type', '');
        $skipTypes = ['image/', 'video/', 'audio/', 'application/zip', 'application/x-gzip'];
        
        foreach ($skipTypes as $type) {
            if (str_contains($contentType, $type)) {
                return $response;
            }
        }

        // Don't compress if content is too small (< 1KB)
        $content = $response->getContent();
        if (strlen($content) < 1024) {
            return $response;
        }

        // Compress the content
        $compressed = gzencode($content, 6); // Compression level 6 (balanced)
        
        if ($compressed !== false) {
            $response->setContent($compressed);
            $response->headers->set('Content-Encoding', 'gzip');
            $response->headers->set('Content-Length', strlen($compressed));
            $response->headers->set('Vary', 'Accept-Encoding');
        }

        return $response;
    }
}
