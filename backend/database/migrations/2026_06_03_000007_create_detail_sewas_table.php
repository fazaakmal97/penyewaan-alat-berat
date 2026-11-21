<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_sewas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('sewa_id');
            $table->foreignId('alat_berat_id')->constrained('alat_berats')->cascadeOnDelete();
            $table->decimal('harga_harian', 15, 2);
            $table->date('tgl_mulai');
            $table->date('tgl_selesai');
            $table->unsignedInteger('jumlah_hari');
            $table->decimal('subtotal', 15, 2);
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
        Schema::dropIfExists('detail_sewas');
    }
};
