<?php

namespace Database\Seeders;

use App\Enums\PembayaranStatus;
use App\Enums\SewaStatus;
use App\Models\AlatBerat;
use App\Models\Customer;
use App\Models\DetailSewa;
use App\Models\Pembayaran;
use App\Models\Sewa;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TestDataSeeder extends Seeder
{
    /**
     * Data tambahan untuk testing / demo menggunakan Factory.
     */
    public function run(): void
    {
        $customer = Customer::query()->first() ?? Customer::factory()->create();

        $alat = AlatBerat::query()->first();
        if (! $alat) {
            return;
        }

        $sewa = Sewa::factory()->create([
            'customer_id' => $customer->id,
            'status' => SewaStatus::MenungguVerifikasi,
            'total_harga' => 10_500_000,
        ]);

        DetailSewa::factory()->create([
            'sewa_id' => $sewa->id,
            'alat_berat_id' => $alat->id,
            'harga_harian' => 3_500_000,
            'tgl_mulai' => now()->addDays(3)->toDateString(),
            'tgl_selesai' => now()->addDays(6)->toDateString(),
            'jumlah_hari' => 4,
            'subtotal' => 14_000_000,
        ]);

        Pembayaran::factory()->create([
            'id' => (string) Str::uuid(),
            'sewa_id' => $sewa->id,
            'jumlah_bayar' => 10_500_000,
            'status' => PembayaranStatus::Pending,
            'bukti_url' => 'https://placehold.co/400x600?text=Bukti+Transfer+Test',
        ]);
    }
}
