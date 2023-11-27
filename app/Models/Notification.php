<?php

namespace App\Models;

use App\Enums\NotificationTypes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class Notification extends Model {
    use HasFactory, SoftDeletes, Notifiable;

    protected $fillable = ['user_id', 'type_id', 'object_id', 'localized', 'subject', 'body', 'data', 'read_at'];
    protected $casts = ['localized' => 'boolean'];

    protected $appends = ['href'];

    public function getSubjectAttribute() {
        if ($this->attributes['localized']) {
            return __($this->attributes['subject']);
        }
        return $this->attributes['subject'];
    }

    public function getHrefAttribute() {
        $typeId = (int)$this->attributes['type_id'];
        switch ($typeId) {
            case NotificationTypes::NEW_CERTIFICATE_CLAIMED:
            case NotificationTypes::NEW_RATE:
            case NotificationTypes::NEW_COURSE_APPROVED:
            case NotificationTypes::NEW_COURSE_REJECTED:
                $course = DB::table("courses")->where("id", $this->attributes['object_id'])->first();
                return "/courses/" . $course->slug;
                break;
            default:
                return "#";
        }
    }

    public function scopeSelectList($query) {
        return $query->select(["id", "subject", 'type_id', 'object_id', 'localized', "read_at", "body", "created_at"]);
    }
}
