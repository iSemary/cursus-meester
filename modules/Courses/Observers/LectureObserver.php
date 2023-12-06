<?php

namespace modules\Courses\Observers;

use App\Services\Uploader\FileHandler;
use Illuminate\Support\Facades\DB;
use modules\Courses\Entities\Lecture;
use modules\Courses\Entities\LectureFile;

class LectureObserver {
    /**
     * The "created" function creates video media and additional files for a given lecture.
     * 
     * @param Lecture lecture The parameter `` is an instance of the `Lecture` class. It is being
     * passed to the `created` method as an argument.
     */

    public function created(Lecture $lecture): void {
        $this->createLectureMediaVideo($lecture);
        $this->syncLectureAdditionalFiles($lecture);
    }

    /**
     * The function `createLectureMediaVideo` is responsible for handling the creation and updating of
     * lecture media videos.
     * 
     * @param Lecture lecture The parameter `lecture` is an instance of the `Lecture` class.
     */
    private function createLectureMediaVideo(Lecture $lecture): void {
        $uploadedMediaFile = request()->file('media_file');
        // Remove old media video if exists
        if ($uploadedMediaFile) {
            if ($lecture->lecture_media_id) {
                $lectureFile = LectureFile::find($lecture->lecture_media_id);
                if ($lectureFile) {
                    FileHandler::delete([Lecture::$mediaPath . $lectureFile->hash_name], 'protected');
                }
            }
            // store uploaded media video
            $mediaFileResponse = FileHandler::file($uploadedMediaFile['file'], Lecture::$mediaPath, 2, 'protected');
            // create lecture file row
            if ($mediaFileResponse->getStatusCode() == 200) {
                $mediaFileData = $mediaFileResponse->getData();
                $mediaFileData->mime_type = request()->media_file['type'];
                $newLectureFile = LectureFile::createFile($lecture->id, $mediaFileData, 1);
                // update existing lecture with it's new media video
                DB::table('lectures')->where('id', '=', $lecture->id)->update([
                    'lecture_media_id' => $newLectureFile->id
                ]);
            }
        }
    }

    /**
     * The function createLectureAdditionalFiles creates additional files for a given lecture.
     * 
     * @param Lecture lecture The parameter "lecture" is of type Lecture.
     */
    private function syncLectureAdditionalFiles(Lecture $lecture) {
        $uploadedAdditionalFiles = request()->file('files');
        if ($uploadedAdditionalFiles && is_array($uploadedAdditionalFiles) && count($uploadedAdditionalFiles)) {
            // Soft delete old additional files if exists
            LectureFile::where("lecture_id", $lecture->id)->where("id", "!=", $lecture->lecture_media_id)->delete();
            /** 
             * If new file then store it and create new lecture_files row
             */
            foreach ($uploadedAdditionalFiles as $key => $uploadedAdditionalFile) {
                // store new uploaded file video
                $mediaFileResponse = FileHandler::file($uploadedAdditionalFile['file'], Lecture::$additionalFilePath, 'protected');
                // create lecture file row
                if ($mediaFileResponse->getStatusCode() == 200) {
                    $mediaFileData = $mediaFileResponse->getData();
                    $mediaFileData->mime_type = request()->input('files')[$key]['type'];
                    LectureFile::createFile($lecture->id, $mediaFileData, 0);
                }
            }
        }
    }

    /**
     * Handle the Lecture "updated" event.
     */
    public function updated(Lecture $lecture): void {
        $this->createLectureMediaVideo($lecture);
        $this->syncLectureAdditionalFiles($lecture);
    }

    /**
     * Handle the Lecture "deleted" event.
     */
    public function deleted(Lecture $lecture): void {
        //
    }

    /**
     * Handle the Lecture "restored" event.
     */
    public function restored(Lecture $lecture): void {
        //
    }

    /**
     * Handle the Lecture "force deleted" event.
     */
    public function forceDeleted(Lecture $lecture): void {
        //
    }
}
