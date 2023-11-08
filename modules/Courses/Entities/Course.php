<?php

namespace modules\Courses\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Models\Utilities\Currency;
use App\Models\Utilities\Language;
use modules\Categories\Entities\Category;
use modules\Organizations\Entities\Organization;

class Course extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'thumbnail',
        'skill_level',
        'category_id',
        'user_id',
        'organization_id',
        'language_id',
        'currency_id',
        'price',
        'offer_price',
        'offer_percentage',
        'offer_expired_at',
        'published_at',
    ];

    protected $dates = ['offer_expired_at', 'published_at'];

    protected $hidden = [
        "deleted_at",
        "created_at",
    ];

    public function rate() {
        return $this->hasMany(Rate::class);
    }

    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    }


    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function organization() {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function language() {
        return $this->belongsTo(Language::class, 'language_id');
    }

    public function currency() {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    public function isPublished() {
        return $this->published_at !== null;
    }

    public function scopePublished($query) {
        return $query->whereNotNull('published_at');
    }

    public function  scopeOwned($query) {
        return $query->where("user_id", auth()->guard('api')->id());
    }
}
