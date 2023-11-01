<?php

namespace App\Models\Utilities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ProfileSocialLink extends Model {
    use HasFactory, SoftDeletes, LogsActivity;
    protected $fillable = ['user_id', 'link_type', 'link_url'];


    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }
}
