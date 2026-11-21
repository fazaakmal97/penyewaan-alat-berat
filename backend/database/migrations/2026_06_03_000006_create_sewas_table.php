<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sewas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->string('kode')->unique();
            $table->date('tanggal');
            $table->decimal('total_harga', 15, 2)->default(0);
            $table->unsignedTinyInteger('status')->default(1);
            $table->string('nama_pic');
            $table->string('no_hp_pic', 20);
            $table->text('alamat_pengiriman');
            $table->text('catatan')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sewas');
    }
};
