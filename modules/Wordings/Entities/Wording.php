<?php

namespace modules\Wordings\Entities;

use App\Models\Utilities\Language;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Wording extends Model {
    use HasFactory;

    protected $fillable = ['wording_key', 'wording_value', 'wording_language_id'];

    public function language() {
        return $this->belongsTo(Language::class,  'wording_language_id');
    }
}
