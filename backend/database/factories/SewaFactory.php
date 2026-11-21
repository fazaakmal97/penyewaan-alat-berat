<?php

namespace Database\Factories;

use App\Enums\SewaStatus;
use App\Models\Customer;
use App\Models\Sewa;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Sewa>
 */
class SewaFactory extends Factory
{
    protected $model = Sewa::class;

    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'customer_id' => Customer::factory(),
            'kode' => 'SW'.fake()->unique()->numerify('#####'),
            'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
            'total_harga' => 0,
            'status' => SewaStatus::MenungguVerifikasi,
            'nama_pic' => fake()->name(),
            'no_hp_pic' => fake()->numerify('08##########'),
            'alamat_pengiriman' => fake()->address(),
            'catatan' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }

    public function menungguVerifikasi(): static
    {
        return $this->state(fn () => ['status' => SewaStatus::MenungguVerifikasi]);
    }

    public function disetujui(): static
    {
        return $this->state(fn () => ['status' => SewaStatus::Disetujui]);
    }
}
