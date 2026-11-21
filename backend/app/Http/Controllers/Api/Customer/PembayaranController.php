<?php

namespace App\Http\Controllers\Api\Customer;

use App\Enums\PembayaranStatus;
use App\Enums\SewaStatus;
use App\Http\Controllers\Api\Controller;
use App\Models\Pembayaran;
use App\Models\Sewa;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PembayaranController extends Controller
{
    public function __construct(private readonly FileUploadService $fileUploadService)
    {
    }

    public function store(Request $request, string $sewaId): JsonResponse
    {
        $request->validate([
            'tgl_bayar' => ['required', 'date'],
            'jumlah_bayar' => ['required', 'numeric', 'min:1'],
            'bukti' => ['required', 'image', 'max:5120'],
        ]);

        $sewa = Sewa::query()->findOrFail($sewaId);

        if ($sewa->customer_id !== $request->user()->id) {
            return $this->error('Tidak diizinkan', 403);
        }

        if ($sewa->status !== SewaStatus::MenungguPembayaran) {
            return $this->error('Pesanan belum disetujui admin atau sudah dalam proses pembayaran', 422);
        }

        $file = $this->fileUploadService->upload($request->file('bukti'), 'pembayaran');

        $pembayaran = Pembayaran::query()->create([
            'id' => (string) Str::uuid(),
            'sewa_id' => $sewa->id,
            'tgl_bayar' => $request->tgl_bayar,
            'jumlah_bayar' => $request->jumlah_bayar,
            'bukti_name' => $file['name'],
            'bukti_url' => $file['url'],
            'status' => PembayaranStatus::Pending,
        ]);

        $sewa->update(['status' => SewaStatus::MenungguVerifikasi]);

        return $this->success($pembayaran, 'Bukti pembayaran diunggah', 201);
    }
}
