<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('login_attempts', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('agent', 1024);
            $table->string('ip', 165);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('login_attempts');
    }
};
