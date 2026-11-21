<?php

namespace Tests\Feature;

use App\Enums\PembayaranStatus;
use App\Enums\SewaStatus;
use App\Models\AlatBerat;
use App\Models\Bank;
use App\Models\Customer;
use App\Models\DetailSewa;
use App\Models\JenisAlat;
use App\Models\Merek;
use App\Models\ModelAlat;
use App\Models\Pembayaran;
use App\Models\Sewa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FactoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_factory_creates_valid_record(): void
    {
        $user = User::factory()->create();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'username' => $user->username,
        ]);
    }

    public function test_master_data_factories_create_related_records(): void
    {
        $jenis = JenisAlat::factory()->create();
        $merek = Merek::factory()->create();
        $model = ModelAlat::factory()->create([
            'jenis_alat_id' => $jenis->id,
            'merek_id' => $merek->id,
        ]);
        $alat = AlatBerat::factory()->create(['model_id' => $model->id]);
        $bank = Bank::factory()->create();

        $this->assertModelExists($jenis);
        $this->assertModelExists($merek);
        $this->assertModelExists($model);
        $this->assertModelExists($alat);
        $this->assertModelExists($bank);
    }

    public function test_sewa_flow_factories(): void
    {
        $customer = Customer::factory()->create();
        $alat = AlatBerat::factory()->create();

        $sewa = Sewa::factory()->menungguVerifikasi()->create([
            'customer_id' => $customer->id,
            'total_harga' => 7_000_000,
        ]);

        DetailSewa::factory()->create([
            'sewa_id' => $sewa->id,
            'alat_berat_id' => $alat->id,
            'subtotal' => 7_000_000,
            'jumlah_hari' => 2,
        ]);

        $pembayaran = Pembayaran::factory()->create([
            'sewa_id' => $sewa->id,
            'jumlah_bayar' => 7_000_000,
            'status' => PembayaranStatus::Pending,
        ]);

        $this->assertEquals(SewaStatus::MenungguVerifikasi, $sewa->status);
        $this->assertEquals(PembayaranStatus::Pending, $pembayaran->status);
        $this->assertCount(1, $sewa->fresh()->detailSewas);
    }
}
