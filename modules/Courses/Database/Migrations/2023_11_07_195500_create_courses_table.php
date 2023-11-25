<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->string('description', 5000);
            $table->longText('content');
            $table->string('thumbnail', 255)->default('default.png');
            $table->tinyInteger('skill_level');
            $table->integer('category_id');
            $table->integer('user_id');
            $table->integer('organization_id')->nullable();
            $table->integer('language_id');
            $table->integer('currency_id');
            $table->float('price')->unsigned();
            $table->tinyInteger('offer_price')->default(0);
            $table->float('offer_percentage')->unsigned();
            $table->timestamp('offer_expired_at')->nullable();
            $table->tinyInteger('has_certificate')->default(1);
            $table->tinyInteger('status')->default(0); // default is pending
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('courses');
    }
};
