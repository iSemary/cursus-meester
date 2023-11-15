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
        Schema::create('user_certificates', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->integer('course_id');
            $table->string('reference_code', 156)->nullable()->unique();
            $table->string('file_name', 255)->nullable()->unique();
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
        Schema::dropIfExists('user_certificates');
    }
};
