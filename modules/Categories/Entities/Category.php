<?php

namespace modules\Categories\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use modules\Courses\Entities\Course;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Category extends Model {
    use SoftDeletes, LogsActivity, HasFactory;
    protected $fillable = ['title', 'slug', 'parent_id', 'icon', 'order_number', 'status'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }

    public function courses() {
        return $this->hasMany(Course::class, "id");
    }
}
