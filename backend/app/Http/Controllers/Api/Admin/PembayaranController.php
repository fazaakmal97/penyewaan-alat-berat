<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\PembayaranStatus;
use App\Enums\SewaStatus;
use App\Http\Controllers\Api\Controller;
use App\Models\Pembayaran;
use App\Models\Sewa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Pembayaran::query()->with(['sewa.customer']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('sewa', function ($q) use ($search) {
                $q->where('kode', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($c) => $c->where('nama', 'like', "%{$search}%"));
            });
        }

        return $this->success($query->latest()->paginate((int) $request->get('per_page', 15)));
    }

    public function show(string $id): JsonResponse
    {
        $pembayaran = Pembayaran::query()
            ->with(['sewa.customer', 'sewa.detailSewas.alatBerat'])
            ->findOrFail($id);

        return $this->success($pembayaran);
    }

    public function verify(string $id): JsonResponse
    {
        $pembayaran = Pembayaran::query()->findOrFail($id);

        if ($pembayaran->status !== PembayaranStatus::Pending) {
            return $this->error('Pembayaran sudah diproses sebelumnya', 422);
        }

        $pembayaran->update(['status' => PembayaranStatus::Diverifikasi]);

        return $this->success($pembayaran->fresh(['sewa.customer']), 'Pembayaran diverifikasi');
    }

    public function reject(Request $request, string $id): JsonResponse
    {
        $pembayaran = Pembayaran::query()->findOrFail($id);

        if ($pembayaran->status !== PembayaranStatus::Pending) {
            return $this->error('Pembayaran sudah diproses sebelumnya', 422);
        }

        $pembayaran->update(['status' => PembayaranStatus::Ditolak]);

        $sewa = Sewa::query()->findOrFail($pembayaran->sewa_id);
        $sewa->update(['status' => SewaStatus::MenungguPembayaran]);

        return $this->success($pembayaran->fresh(['sewa.customer']), 'Pembayaran ditolak');
    }
}
