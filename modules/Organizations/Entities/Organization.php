<?php

namespace modules\Organizations\Entities;

use App\Services\Uploader\FileHandler;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Organization extends Model {
    use SoftDeletes, LogsActivity, HasFactory;

    protected $filePath = "organizations/logo";

    protected $fillable = ['name', 'slug', 'description', 'industry_id', 'logo', 'status'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }


    public function setLogoAttribute($value) {
        $logo = $this->logo;
        if ($value) {
            // Remove old image if exists
            if ($this->logo) {
                FileHandler::delete([$this->filePath . $this->logo]);
            }
            // store uploaded image
            $logo = FileHandler::image($value, $this->filePath, false);
            $this->attributes['logo'] = basename($logo);
        }
    }

    public function getLogoAttribute($value): string {
        if ($value) {
            return asset('storage/' . $this->filePath . '/' . $value);
        } else {
            return asset('storage/' . $this->filePath . '/' . 'default.png');
        }
    }
}
