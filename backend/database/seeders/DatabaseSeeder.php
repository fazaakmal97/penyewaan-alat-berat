<?php

namespace Database\Seeders;

use App\Enums\AlatBeratStatus;
use App\Models\AlatBerat;
use App\Models\Bank;
use App\Models\Customer;
use App\Models\JenisAlat;
use App\Models\Merek;
use App\Models\ModelAlat;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->create([
            'nama' => 'Administrator',
            'username' => 'admin',
            'password' => 'password',
            'is_active' => true,
        ]);

        $customer = Customer::query()->create([
            'kode' => 'CST00001',
            'nama' => 'Customer Demo',
            'email' => 'customer@demo.com',
            'no_hp' => '081234567890',
            'alamat' => 'Jl. Demo No. 1, Jakarta',
            'password' => 'password',
            'is_active' => true,
        ]);

        Bank::query()->create([
            'nama' => 'BCA',
            'no_rek' => '1234567890',
            'atas_nama' => 'PT Alat Berat Indonesia',
            'is_active' => true,
        ]);

        $excavator = JenisAlat::query()->create([
            'kode' => 'JA00001',
            'nama' => 'Excavator',
            'keterangan' => 'Alat gali berat',
            'is_active' => true,
        ]);

        $bulldozer = JenisAlat::query()->create([
            'kode' => 'JA00002',
            'nama' => 'Bulldozer',
            'keterangan' => 'Alat dorong tanah',
            'is_active' => true,
        ]);

        $komatsu = Merek::query()->create([
            'kode' => 'MR00001',
            'nama' => 'Komatsu',
            'is_active' => true,
        ]);

        $cat = Merek::query()->create([
            'kode' => 'MR00002',
            'nama' => 'CAT',
            'is_active' => true,
        ]);

        $model1 = ModelAlat::query()->create([
            'jenis_alat_id' => $excavator->id,
            'merek_id' => $komatsu->id,
            'kode' => 'MD00001',
            'nama' => 'PC200-8',
            'kapasitas' => '1.0 m³',
            'daya_mesin' => '110 HP',
            'berat_operasional' => '20 ton',
            'is_active' => true,
        ]);

        $model2 = ModelAlat::query()->create([
            'jenis_alat_id' => $bulldozer->id,
            'merek_id' => $cat->id,
            'kode' => 'MD00002',
            'nama' => 'D6R2',
            'kapasitas' => '3.5 m³',
            'daya_mesin' => '165 HP',
            'berat_operasional' => '18 ton',
            'is_active' => true,
        ]);

        AlatBerat::query()->create([
            'model_id' => $model1->id,
            'kode' => 'AB00001',
            'nama' => 'Excavator Komatsu PC200-8 #1',
            'tahun' => 2022,
            'harga_sewa_harian' => 3500000,
            'status' => AlatBeratStatus::Tersedia,
            'foto_url' => 'https://placehold.co/600x400?text=Excavator',
            'is_active' => true,
        ]);

        AlatBerat::query()->create([
            'model_id' => $model2->id,
            'kode' => 'AB00002',
            'nama' => 'Bulldozer CAT D6R2 #1',
            'tahun' => 2021,
            'harga_sewa_harian' => 4200000,
            'status' => AlatBeratStatus::Tersedia,
            'foto_url' => 'https://placehold.co/600x400?text=Bulldozer',
            'is_active' => true,
        ]);
    }
}
