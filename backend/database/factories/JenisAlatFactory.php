<?php

namespace Database\Factories;

use App\Models\JenisAlat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JenisAlat>
 */
class JenisAlatFactory extends Factory
{
    protected $model = JenisAlat::class;

    public function definition(): array
    {
        return [
            'kode' => 'JA'.fake()->unique()->numerify('#####'),
            'nama' => fake()->randomElement(['Excavator', 'Bulldozer', 'Crane', 'Loader', 'Dump Truck']),
            'keterangan' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
