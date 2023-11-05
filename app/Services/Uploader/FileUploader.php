<?php

namespace App\Services\Uploader;

use Intervention\Image\ImageManagerStatic as Image;

class FileUploader {

    public function image($file, string $path, int $width = 512, int $height = 512): string {
        // Ensure the storage directory exists
        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }

        // `Unique filename
        $filename = uniqid() . '_' . $file->getClientOriginalName();

        $image = Image::make($file);

        // Resize the image
        $image->resize($width, $height, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        // Save the image to the specified path
        $image->save($path . '/' . $filename);

        // Return the path
        return $path . '/' . $filename;
    }
}
