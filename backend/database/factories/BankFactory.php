<?php

namespace Database\Factories;

use App\Models\Bank;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bank>
 */
class BankFactory extends Factory
{
    protected $model = Bank::class;

    public function definition(): array
    {
        return [
            'nama' => fake()->randomElement(['BCA', 'Mandiri', 'BNI', 'BRI']),
            'no_rek' => fake()->numerify('################'),
            'atas_nama' => fake()->company(),
            'is_active' => true,
        ];
    }
}
