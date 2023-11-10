<?php

namespace App\Models\Utilities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Industry extends Model {
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = ['title', 'slug', 'description'];

    public function getActivitylogOptions(): LogOptions {
        return LogOptions::defaults();
    }
}
