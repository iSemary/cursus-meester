<?php

namespace modules\Categories\Entities;

use App\Services\Uploader\FileHandler;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use modules\Courses\Entities\Course;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Category extends Model {
    use SoftDeletes, LogsActivity, HasFactory;
    const SOFT_SKILLS_ID = 1; // Soft skills ID

    protected $fillable = ['title', 'slug', 'parent_id', 'icon', 'order_number', 'status'];

    protected $filePath = "categories/icons";

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }

    public function courses() {
        return $this->hasMany(Course::class, "id");
    }

    public function setIconAttribute($value) {
        $icon = $this->icon;
        if ($value) {
            // Remove old image if exists
            if ($this->icon) {
                FileHandler::delete([$this->filePath . $this->icon]);
            }
            // store uploaded image
            $icon = FileHandler::image($value, $this->filePath, false);
            $this->attributes['icon'] = basename($icon);
        }
    }

    public function getIconAttribute($value): string {
        if ($value) {
            return asset('storage/' . $this->filePath . '/' . $value);
        } else {
            return asset('storage/' . $this->filePath . '/' . 'default.png');
        }
    }
}
