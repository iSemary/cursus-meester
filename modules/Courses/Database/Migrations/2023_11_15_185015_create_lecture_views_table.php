<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('lecture_views', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('lecture_id');
            $table->bigInteger('user_id');
            $table->integer('view_time')->default(0);
            $table->boolean('finished')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('lecture_views');
    }
};
