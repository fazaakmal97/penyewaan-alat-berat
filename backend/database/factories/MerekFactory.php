<?php

namespace Database\Factories;

use App\Models\Merek;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Merek>
 */
class MerekFactory extends Factory
{
    protected $model = Merek::class;

    public function definition(): array
    {
        return [
            'kode' => 'MR'.fake()->unique()->numerify('#####'),
            'nama' => fake()->randomElement(['Komatsu', 'CAT', 'Hitachi', 'Kobelco', 'Volvo']),
            'keterangan' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
