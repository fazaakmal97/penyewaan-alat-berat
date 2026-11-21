<?php

namespace Database\Factories;

use App\Models\JenisAlat;
use App\Models\Merek;
use App\Models\ModelAlat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ModelAlat>
 */
class ModelAlatFactory extends Factory
{
    protected $model = ModelAlat::class;

    public function definition(): array
    {
        return [
            'jenis_alat_id' => JenisAlat::factory(),
            'merek_id' => Merek::factory(),
            'kode' => 'MD'.fake()->unique()->numerify('#####'),
            'nama' => fake()->bothify('Model-###'),
            'keterangan' => fake()->optional()->sentence(),
            'kapasitas' => fake()->randomElement(['1.0 m³', '2.5 m³', '3.5 m³']),
            'daya_mesin' => fake()->numberBetween(80, 200).' HP',
            'berat_operasional' => fake()->numberBetween(10, 30).' ton',
            'is_active' => true,
        ];
    }
}
