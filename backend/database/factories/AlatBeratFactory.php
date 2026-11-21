<?php

namespace Database\Factories;

use App\Enums\AlatBeratStatus;
use App\Models\AlatBerat;
use App\Models\ModelAlat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AlatBerat>
 */
class AlatBeratFactory extends Factory
{
    protected $model = AlatBerat::class;

    public function definition(): array
    {
        return [
            'model_id' => ModelAlat::factory(),
            'kode' => 'AB'.fake()->unique()->numerify('#####'),
            'nama' => fake()->words(3, true),
            'tahun' => fake()->numberBetween(2018, (int) date('Y')),
            'harga_sewa_harian' => fake()->numberBetween(1_500_000, 5_000_000),
            'status' => AlatBeratStatus::Tersedia,
            'foto_url' => 'https://placehold.co/600x400?text=Alat+Berat',
            'is_active' => true,
        ];
    }

    public function disewa(): static
    {
        return $this->state(fn () => ['status' => AlatBeratStatus::Disewa]);
    }
}
