<?php

namespace App\Services\Uploader;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

class FileHandler {

    /**
     * The function takes an image file, resizes it to the specified dimensions, saves it to a specified
     * path, creates a thumbnail, and returns the path of the resized image.
     * 
     * @param file The file parameter is the image file that you want to process and save. It should be an
     * instance of the UploadedFile class, which is typically obtained from an HTML form file input field.
     * @param string path The `path` parameter is a string that represents the directory where the image
     * will be saved. It is used to specify the location where the image file will be stored on the server.
     * @param int width The width parameter specifies the desired width of the image after resizing.
     * @param int height The height parameter is an optional parameter that specifies the desired height of
     * the resized image. If no value is provided, the default height is set to 512 pixels.
     * 
     * @return string the path of the saved image file.
     */
    public static function image($file, string $path, int $width = 512, int $height = 512): string {
        // `Unique filename
        $filename = uniqid() . '_' . $file->getClientOriginalName();
        $image = Image::make($file);

        // Resize the image
        $image->resize($width, $height, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        // Save the image to the specified path
        Storage::disk('public')->put($path . '/' . $filename, $image->encode());
        // create a thumbnail
        self::thumbnail($file, $filename, $path . '/thumbnails');
        // Return the path
        return $path . '/' . $filename;
    }

    /**
     * The function "thumbnail" takes an image file, resizes it to create a thumbnail, and saves the
     * thumbnail to a specified path.
     * 
     * @param file The original image file that you want to create a thumbnail of. This can be a file path
     * or an instance of the `Illuminate\Http\UploadedFile` class.
     * @param filename The filename parameter is the name of the file that you want to create a thumbnail
     * for.
     * @param thumbnailPath The `thumbnailPath` parameter is the path where the thumbnail image will be
     * saved. It is a string that represents the directory or folder where the thumbnail image will be
     * stored.
     * @param width The width of the thumbnail image in pixels. By default, it is set to 100 pixels.
     * @param height The height parameter specifies the desired height of the thumbnail image.
     */
    public static function thumbnail($file, $filename, $thumbnailPath, $width = 100, $height = 100): void {
        $image = Image::make($file);
        // Resize the image to create the thumbnail
        $image->resize($width, $height, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        // Save the thumbnail to the specified path
        Storage::disk('public')->put($thumbnailPath . '/' . $filename, $image->encode());
    }

    /**
     * The function deletes multiple files from the public disk in a Laravel application.
     * 
     * @param array files An array of file paths to be deleted.
     */
    public static function delete(array $files): void {
        if ($files && is_array($files)) {
            foreach ($files as $key => $file) {
                Storage::disk('public')->delete($file);
            }
        }
    }
}
