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
        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->integer('exam_id');
            $table->integer('exam_question_id');
            $table->integer('user_id');
            $table->integer('answer_id')->nullable();
            $table->text('answer_text');
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
        Schema::dropIfExists('exam_results');
    }
};
