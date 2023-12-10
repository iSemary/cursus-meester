<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('stripe_logs', function (Blueprint $table) {
            $table->id();
            $table->string("transaction_number", 255)->nullable();
            $table->tinyInteger("status")->default(0);
            $table->longText("payload")->nullable();
            $table->longText("response")->nullable();
            $table->longText("notification")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('stripe_logs');
    }
};
