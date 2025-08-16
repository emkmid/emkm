<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Mews\Purifier\Facades\Purifier;
use Illuminate\Support\Facades\Auth;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool { return Auth::check(); }

    public function rules(): array {
        return [
            'title' => ['required','string','max:200'],
            'excerpt' => ['nullable','string','max:300'],
            'content_html' => ['required','string','min:5'],
            'published_at' => ['nullable','date'],
            'meta' => ['nullable','array'],
            'thumbnail_path' => ['image', 'file', 'max:2000']
        ];
    }

    public function sanitizedContent(): string {
        $html = $this->input('content_html', '');
        return Purifier::clean($html, 'trix');
    }
}