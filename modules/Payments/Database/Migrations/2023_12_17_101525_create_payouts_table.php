<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->integer('payment_transaction_id');
            $table->integer('payment_transaction_items_id');
            $table->string('reference_number', 255);
            $table->string('transaction_number', 255)->nullable();
            $table->string('transferred_email', 255)->nullable();
            $table->tinyInteger('payment_method');
            $table->decimal('total_price', 10, 2);
            $table->integer('user_id');
            $table->tinyInteger('status')->default(0);
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('payouts');
    }
};
