<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class LectureFile extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['lecture_id', 'original_name', 'hash_name', 'extension', 'size', 'duration'];

    public function lecture() {
        return $this->belongsTo(Lecture::class, 'lecture_id');
    }

    public static function createMedia(int $lectureId, object $mediaData) {
        return self::create([
            'lecture_id' => $lectureId,
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
}
