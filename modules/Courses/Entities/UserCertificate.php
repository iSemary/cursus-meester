<?php

namespace modules\Courses\Entities;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserCertificate extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'course_id',
        'reference_code',
        'file_name',
    ];

    public function course() {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
