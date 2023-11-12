<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class LectureFile extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['lecture_id', 'main_file', 'original_name', 'hash_name', 'extension', 'size', 'duration'];

    public function lecture() {
        return $this->belongsTo(Lecture::class, 'lecture_id');
    }

    protected $appends = ['path'];

    public function getPathAttribute() {
        $path = ($this->main_file ? Lecture::$mediaPath : Lecture::$additionalFilePath);
        $path .= '/' . $this->hash_name;
        return asset('storage/' . $path . '.' . $this->extension);
    }

    public static function createMedia(int $lectureId, object $mediaData) {
        return self::create([
            'lecture_id' => $lectureId,
            'main_file' => 0,
            'original_name' => $mediaData->original_file_name,
            'hash_name' => $mediaData->hash_name,
            'extension' => $mediaData->extension,
            'size' => $mediaData->size,
            'duration' => $mediaData->extra->duration,
        ]);
    }

    public static function createAdditional(int $lectureId, object $mediaData) {
        return self::create([
            'lecture_id' => $lectureId,
            'original_name' => $mediaData->original_file_name,
            'hash_name' => $mediaData->hash_name,
            'extension' => $mediaData->extension,
            'size' => $mediaData->size,
        ]);
    }

    public static function getMediaFile(int $mediaFileId) {
        return self::where("id", $mediaFileId)->first();
    }

    public static function getAdditionalFiles(int $lectureId) {
        return self::where("lecture_id", $lectureId)->where("main_file", 0)->get();
    }
}
