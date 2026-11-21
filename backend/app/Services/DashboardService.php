<?php

namespace App\Services;

use App\Enums\SewaStatus;
use App\Models\AlatBerat;
use App\Models\Customer;
use App\Models\DetailSewa;
use App\Models\Pembayaran;
use App\Models\Sewa;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getStats(): array
    {
        $pendapatan = Pembayaran::query()
            ->where('status', 1)
            ->sum('jumlah_bayar');

        return [
            'total_customer' => Customer::query()->count(),
            'total_penyewaan' => Sewa::query()->count(),
            'total_alat_berat' => AlatBerat::query()->count(),
            'total_pendapatan' => (float) $pendapatan,
            'penyewaan_aktif' => Sewa::query()->whereIn('status', [
                SewaStatus::Disetujui->value,
                SewaStatus::SedangBerjalan->value,
            ])->count(),
            'penyewaan_selesai' => Sewa::query()->where('status', SewaStatus::Selesai->value)->count(),
        ];
    }

    public function penyewaanPerBulan(): array
    {
        return Sewa::query()
            ->selectRaw('MONTH(tanggal) as bulan, YEAR(tanggal) as tahun, COUNT(*) as total')
            ->whereYear('tanggal', now()->year)
            ->groupBy('tahun', 'bulan')
            ->orderBy('bulan')
            ->get()
            ->toArray();
    }

    public function pendapatanPerBulan(): array
    {
        return Pembayaran::query()
            ->selectRaw('MONTH(tgl_bayar) as bulan, YEAR(tgl_bayar) as tahun, SUM(jumlah_bayar) as total')
            ->where('status', 1)
            ->whereYear('tgl_bayar', now()->year)
            ->groupBy('tahun', 'bulan')
            ->orderBy('bulan')
            ->get()
            ->toArray();
    }

    public function alatPalingSeringDisewa(int $limit = 5): array
    {
        return DetailSewa::query()
            ->select('alat_berat_id', DB::raw('COUNT(*) as total'))
            ->groupBy('alat_berat_id')
            ->orderByDesc('total')
            ->limit($limit)
            ->with('alatBerat.model.merek')
            ->get()
            ->toArray();
    }
}
