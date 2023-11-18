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
        Schema::create('exam_question_options', function (Blueprint $table) {
            $table->id();
            $table->string('title', 1024);
            $table->smallInteger('order_number')->default(1);
            $table->tinyInteger('valid_answer')->default(0);
            $table->integer('exam_question_id');
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
        Schema::dropIfExists('exam_question_options');
    }
};
