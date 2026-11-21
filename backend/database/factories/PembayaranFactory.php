<?php

namespace Database\Factories;

use App\Enums\PembayaranStatus;
use App\Models\Pembayaran;
use App\Models\Sewa;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Pembayaran>
 */
class PembayaranFactory extends Factory
{
    protected $model = Pembayaran::class;

    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'sewa_id' => Sewa::factory(),
            'tgl_bayar' => fake()->dateTimeBetween('-1 month', 'now'),
            'jumlah_bayar' => fake()->numberBetween(5_000_000, 20_000_000),
            'bukti_name' => 'bukti.jpg',
            'bukti_url' => 'https://placehold.co/400x600?text=Bukti+Transfer',
            'status' => PembayaranStatus::Pending,
            'is_active' => true,
        ];
    }

    public function diverifikasi(): static
    {
        return $this->state(fn () => ['status' => PembayaranStatus::Diverifikasi]);
    }

    public function ditolak(): static
    {
        return $this->state(fn () => ['status' => PembayaranStatus::Ditolak]);
    }
}
