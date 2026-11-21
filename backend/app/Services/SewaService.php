<?php

namespace App\Services;

use App\Enums\AlatBeratStatus;
use App\Enums\PembayaranStatus;
use App\Enums\SewaStatus;
use App\Models\AlatBerat;
use App\Models\Customer;
use App\Models\Sewa;
use App\Repositories\Eloquent\SewaRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SewaService
{
    public function __construct(
        private readonly SewaRepository $sewaRepository,
        private readonly CodeGeneratorService $codeGenerator,
    ) {
    }

    public function createFromCheckout(Customer $customer, array $payload): Sewa
    {
        return DB::transaction(function () use ($customer, $payload) {
            $totalHarga = 0;
            $details = [];

            foreach ($payload['items'] as $item) {
                $alat = AlatBerat::query()->lockForUpdate()->findOrFail($item['alat_berat_id']);

                if ($alat->status !== AlatBeratStatus::Tersedia) {
                    throw ValidationException::withMessages([
                        'items' => ["Alat {$alat->nama} tidak tersedia ({$alat->status->label()})."],
                    ]);
                }

                $jumlahHari = $this->hitungHari($item['tgl_mulai'], $item['tgl_selesai']);
                $subtotal = $jumlahHari * (float) $alat->harga_sewa_harian;
                $totalHarga += $subtotal;

                $details[] = [
                    'alat_berat_id' => $alat->id,
                    'harga_harian' => $alat->harga_sewa_harian,
                    'tgl_mulai' => $item['tgl_mulai'],
                    'tgl_selesai' => $item['tgl_selesai'],
                    'jumlah_hari' => $jumlahHari,
                    'subtotal' => $subtotal,
                ];
            }

            $sewa = Sewa::query()->create([
                'id' => (string) Str::uuid(),
                'customer_id' => $customer->id,
                'kode' => $this->codeGenerator->generate('SW', new Sewa),
                'tanggal' => now()->toDateString(),
                'total_harga' => $totalHarga,
                'status' => SewaStatus::MenungguVerifikasi,
                'nama_pic' => $payload['nama_pic'],
                'no_hp_pic' => $payload['no_hp_pic'],
                'alamat_pengiriman' => $payload['alamat_pengiriman'],
                'catatan' => $payload['catatan'] ?? null,
            ]);

            foreach ($details as $detail) {
                $sewa->detailSewas()->create([
                    'id' => (string) Str::uuid(),
                    ...$detail,
                ]);
            }

            return $sewa->load(['detailSewas.alatBerat.model.merek', 'customer']);
        });
    }

    public function updateStatus(string $id, SewaStatus $status): Sewa
    {
        return DB::transaction(function () use ($id, $status) {
            $sewa = $this->sewaRepository->findOrFail($id);
            $sewa->update(['status' => $status]);

            if ($status === SewaStatus::Disetujui || $status === SewaStatus::SedangBerjalan) {
                foreach ($sewa->detailSewas as $detail) {
                    $detail->alatBerat?->update(['status' => AlatBeratStatus::Disewa]);
                }
            }

            if ($status === SewaStatus::Selesai || $status === SewaStatus::Dibatalkan || $status === SewaStatus::Ditolak) {
                foreach ($sewa->detailSewas as $detail) {
                    $detail->alatBerat?->update(['status' => AlatBeratStatus::Tersedia]);
                }
            }

            return $sewa->fresh(['detailSewas.alatBerat.model.merek', 'detailSewas.alatBerat.model.jenisAlat', 'customer', 'pembayarans']);
        });
    }

    public function releaseAlat(string $sewaId, int $alatBeratId): Sewa
    {
        return DB::transaction(function () use ($sewaId, $alatBeratId) {
            $sewa = $this->sewaRepository->findOrFail($sewaId);
            $detail = $sewa->detailSewas()->where('alat_berat_id', $alatBeratId)->firstOrFail();

            if (Carbon::parse($detail->tgl_selesai)->startOfDay()->gte(now()->startOfDay())) {
                throw ValidationException::withMessages([
                    'alat_berat_id' => ['Masa sewa alat belum berakhir.'],
                ]);
            }

            $alat = AlatBerat::query()->lockForUpdate()->findOrFail($alatBeratId);

            if ($alat->status !== AlatBeratStatus::Disewa) {
                throw ValidationException::withMessages([
                    'alat_berat_id' => ['Alat berat sudah tidak dalam status disewa.'],
                ]);
            }

            $alat->update(['status' => AlatBeratStatus::Tersedia]);
            $this->maybeCompleteSewa($sewa->fresh(['detailSewas.alatBerat']));

            return $sewa->fresh(['detailSewas.alatBerat.model.merek', 'detailSewas.alatBerat.model.jenisAlat', 'customer', 'pembayarans']);
        });
    }

    public function releaseAllExpiredAlat(string $sewaId): Sewa
    {
        return DB::transaction(function () use ($sewaId) {
            $sewa = $this->sewaRepository->findOrFail($sewaId);
            $today = now()->startOfDay();
            $released = 0;

            foreach ($sewa->detailSewas as $detail) {
                if (Carbon::parse($detail->tgl_selesai)->startOfDay()->gte($today)) {
                    continue;
                }

                $alat = $detail->alatBerat;
                if (! $alat || $alat->status !== AlatBeratStatus::Disewa) {
                    continue;
                }

                $alat->update(['status' => AlatBeratStatus::Tersedia]);
                $released++;
            }

            if ($released === 0) {
                throw ValidationException::withMessages([
                    'items' => ['Tidak ada alat berat yang perlu dikembalikan.'],
                ]);
            }

            $this->maybeCompleteSewa($sewa->fresh(['detailSewas.alatBerat']));

            return $sewa->fresh(['detailSewas.alatBerat.model.merek', 'detailSewas.alatBerat.model.jenisAlat', 'customer', 'pembayarans']);
        });
    }

    private function maybeCompleteSewa(Sewa $sewa): void
    {
        if (! in_array($sewa->status, [SewaStatus::Disetujui, SewaStatus::SedangBerjalan], true)) {
            return;
        }

        $today = now()->startOfDay();
        $allExpired = $sewa->detailSewas->every(
            fn ($detail) => Carbon::parse($detail->tgl_selesai)->startOfDay()->lt($today)
        );
        $allAvailable = $sewa->detailSewas->every(
            fn ($detail) => $detail->alatBerat?->status === AlatBeratStatus::Tersedia
        );

        if ($allExpired && $allAvailable) {
            $sewa->update(['status' => SewaStatus::Selesai]);
        }
    }

    public function approveOrder(string $id): Sewa
    {
        return DB::transaction(function () use ($id) {
            $sewa = $this->sewaRepository->findOrFail($id);
            $sewa->load('pembayarans');

            if ($sewa->status !== SewaStatus::MenungguVerifikasi) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'status' => ['Pesanan tidak dalam status menunggu verifikasi.'],
                ]);
            }

            $hasPayment = $sewa->pembayarans->isNotEmpty();
            $hasVerifiedPayment = $sewa->pembayarans->contains(
                fn ($p) => $p->status === PembayaranStatus::Diverifikasi
            );
            $hasPendingPayment = $sewa->pembayarans->contains(
                fn ($p) => $p->status === PembayaranStatus::Pending
            );

            if (! $hasPayment) {
                return $this->updateStatus($id, SewaStatus::MenungguPembayaran);
            }

            if ($hasPendingPayment) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'pembayaran' => ['Verifikasi bukti pembayaran terlebih dahulu di menu Pembayaran.'],
                ]);
            }

            if ($hasVerifiedPayment) {
                return $this->updateStatus($id, SewaStatus::Disetujui);
            }

            throw \Illuminate\Validation\ValidationException::withMessages([
                'status' => ['Tidak dapat menyetujui pesanan pada kondisi ini.'],
            ]);
        });
    }

    public function hitungHari(string $mulai, string $selesai): int
    {
        $start = Carbon::parse($mulai)->startOfDay();
        $end = Carbon::parse($selesai)->startOfDay();

        return max(1, $start->diffInDays($end) + 1);
    }

    public function hitungSubtotal(float $hargaHarian, int $jumlahHari): float
    {
        return $hargaHarian * $jumlahHari;
    }
}
