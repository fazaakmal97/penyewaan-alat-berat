<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    public function upload(UploadedFile $file, string $directory): array
    {
        Storage::disk('public')->makeDirectory($directory);

        $name = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs($directory, $name, 'public');

        if (! $path || ! Storage::disk('public')->exists($path)) {
            throw new \RuntimeException('Gagal menyimpan file upload.');
        }

        return [
            'name' => $name,
            // Path relatif agar bisa diakses via Vite proxy (/storage) atau APP_URL yang benar
            'url' => '/storage/'.$path,
        ];
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
