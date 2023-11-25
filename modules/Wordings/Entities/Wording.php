<?php

namespace modules\Wordings\Entities;

use App\Models\Utilities\Language;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Wording extends Model {
    use HasFactory;
    public $translationPaths;

    public function __construct() {
        $this->translationPaths = [
            base_path() . '/resources/js/public/locales/',
        ];
    }

    protected $fillable = ['wording_key', 'wording_value', 'wording_language_id'];

    public function language() {
        return $this->belongsTo(Language::class,  'wording_language_id');
    }
}
