<?php

namespace modules\Payments\Entities;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use modules\Courses\Entities\Course;

class Cart extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['course_id', 'user_id', 'status'];
   
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function course() {
        return $this->belongsTo(Course::class);
    }

}
