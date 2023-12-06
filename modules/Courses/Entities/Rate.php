<?php

namespace modules\Courses\Entities;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rate extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['course_id', 'user_id', 'rate', 'comment'];

    protected $hidden = ['id', 'course_id', 'updated_at', 'deleted_at'];

    protected $appends = ['created_at_diff'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function getCreatedAtDiffAttribute() {
        return (isset($this->attributes['created_at']) && $this->attributes['created_at'] ? Carbon::parse($this->attributes['created_at'])->diffForHumans()  : "");
    }

    public static function getByCourseId(int $courseId) {
        $rates = self::where('course_id', $courseId)->with(["user" => function ($query) {
            $query->select(['id', 'full_name', 'username']);
        }])->orderBy("id", "DESC")->get();
        return $rates;
    }
}
