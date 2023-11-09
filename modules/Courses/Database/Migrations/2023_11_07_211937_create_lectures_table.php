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
        Schema::create('lectures', function (Blueprint $table) {
            $table->id();
            $table->integer('course_id');
            $table->string('title', 255);
            $table->text('description', 1024);
            $table->string('file_name', 255)->nullable();
            $table->integer('order_number')->default(1);
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
        Schema::dropIfExists('lectures');
    }
};
