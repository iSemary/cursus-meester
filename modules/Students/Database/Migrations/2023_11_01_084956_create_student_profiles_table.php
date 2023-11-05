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
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('position', 5000)->nullable();
            $table->string('bio', 5000)->nullable();
            $table->string('avatar', 255)->nullable();
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
        Schema::dropIfExists('student_profiles');
    }
};
