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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->integer('course_id');
            $table->string('title', 255);
            $table->string('description', 5000);
            $table->string('file_name', 255);
            $table->json('config')->nullable();
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
        Schema::dropIfExists('certificates');
    }
};
