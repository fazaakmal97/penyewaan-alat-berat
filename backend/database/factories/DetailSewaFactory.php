<?php

namespace Database\Factories;

use App\Models\AlatBerat;
use App\Models\DetailSewa;
use App\Models\Sewa;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<DetailSewa>
 */
class DetailSewaFactory extends Factory
{
    protected $model = DetailSewa::class;

    public function definition(): array
    {
        $mulai = fake()->dateTimeBetween('now', '+1 month');
        $selesai = (clone $mulai)->modify('+'.fake()->numberBetween(3, 14).' days');
        $harga = fake()->numberBetween(1_500_000, 4_000_000);
        $hari = max(1, $mulai->diff($selesai)->days + 1);

        return [
            'id' => (string) Str::uuid(),
            'sewa_id' => Sewa::factory(),
            'alat_berat_id' => AlatBerat::factory(),
            'harga_harian' => $harga,
            'tgl_mulai' => $mulai->format('Y-m-d'),
            'tgl_selesai' => $selesai->format('Y-m-d'),
            'jumlah_hari' => $hari,
            'subtotal' => $harga * $hari,
            'is_active' => true,
        ];
    }
}
