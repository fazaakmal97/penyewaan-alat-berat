<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'kode' => 'CST'.fake()->unique()->numerify('#####'),
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'no_hp' => fake()->numerify('08##########'),
            'alamat' => fake()->address(),
            'password' => Hash::make('password'),
            'pic' => fake()->name(),
            'is_active' => true,
        ];
    }
}
