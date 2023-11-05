<?php

namespace modules\Organizations\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Organization extends Model {
    use SoftDeletes, LogsActivity, HasFactory;
    protected $fillable = ['name', 'description', 'industry_id', 'logo', 'status'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }
}
