<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('sewa_id');
            $table->date('tgl_bayar');
            $table->decimal('jumlah_bayar', 15, 2);
            $table->string('bukti_name')->nullable();
            $table->string('bukti_url')->nullable();
            $table->unsignedTinyInteger('status')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('sewa_id')->references('id')->on('sewas')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
