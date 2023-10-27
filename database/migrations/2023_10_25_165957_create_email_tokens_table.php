<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('email_tokens', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('token', 255);
            $table->tinyInteger('status')->default(0);
            $table->timestamp('expired_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('email_tokens');
    }
};
