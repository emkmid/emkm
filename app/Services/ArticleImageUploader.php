<?php
namespace App\Services;

use App\Models\ArticleImage;
use Illuminate\Http\UploadedFile;

class ArticleImageUploader
{
    public function upload(UploadedFile $file, int $userId): ArticleImage
    {
        abort_unless(in_array($file->getMimeType(), ['image/jpeg','image/png','image/webp','image/gif']), 422, 'Invalid image');
        abort_if($file->getSize() > 3 * 1024 * 1024, 422, 'Max 3MB');

        $disk = 'public';
        $path = $file->store('articles/'.date('Y/m/d'), $disk);

        return ArticleImage::create([
            'user_id' => $userId,
            'disk' => $disk,
            'path' => $path,
            'size' => $file->getSize(),
            'mime' => $file->getMimeType(),
        ]);
    }
}
