<?php

namespace modules\Courses\Entities;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rate extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['course_id', 'user_id', 'rate', 'comment'];

    protected $hidden = ['id', 'course_id', 'updated_at', 'deleted_at'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
