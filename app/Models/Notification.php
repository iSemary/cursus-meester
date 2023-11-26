<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Notification extends Model {
    use HasFactory, SoftDeletes, Notifiable;

    protected $fillable = ['user_id', 'type_id', 'localized', 'subject', 'body', 'data', 'read_at'];
    protected $casts = ['localized' => 'boolean'];

    public function getSubjectAttribute() {
        if ($this->attributes['localized']) {
            return __($this->attributes['subject']);
        }
        return $this->attributes['subject'];
    }

    public function scopeSelectList($query) {
        return $query->select(["id", "subject", 'localized', "read_at", "body", "created_at"]);
    }
}
