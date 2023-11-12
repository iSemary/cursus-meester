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
        Schema::create('lecture_files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lecture_id');
            $table->tinyInteger('main_file')->default(0);
            $table->string('original_name', 255);
            $table->string('hash_name', 255);
            $table->char('extension', 10);
            $table->integer('size')->nullable();
            $table->integer('duration')->nullable()->comment('in seconds');
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
        Schema::dropIfExists('lecture_files');
    }
};
