<?php

namespace App\Traits;

use App\Services\Uploader\FileHandler;

trait AvatarAttribute {
    /**
     * The function sets the avatar attribute of a user model in PHP, handling the deletion of the old
     * avatar and storing the new uploaded avatar.
     */
    public function setAvatarAttribute($value) {
        $avatar = $this->avatar;
        if ($value) {
            // Remove old avatar if exists
            if ($this->avatar) {
                FileHandler::delete([$this->filePath . $this->avatar, $this->filePath . 'thumbnails/' . $this->avatar]);
            }
            // store uploaded avatar
            $avatar = FileHandler::image($value, $this->filePath);
            $avatar = basename($avatar);
        }
        $this->attributes['avatar'] = $avatar;
    }

    /**
     * The function returns the URL of a user's avatar image, either from the storage directory or a
     * default image if no avatar is set.
     * 
     * @param string value The parameter `` is a string that represents the avatar file name or path.
     * 
     * @return string the URL of the user's avatar image. If the user has an avatar image, the function
     * will return the URL of that image. If the user does not have an avatar image, the function will
     * return the URL of a default avatar image.
     */
    public function getAvatarAttribute($value): string {
        if ($value) {
            return asset('storage/' . $this->filePath . $value);
        } else {
            return asset('storage/' . $this->filePath . 'default.png');
        }
    }
}
