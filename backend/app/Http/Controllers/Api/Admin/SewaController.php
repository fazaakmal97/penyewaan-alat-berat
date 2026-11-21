<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\SewaStatus;
use App\Http\Controllers\Api\Controller;
use App\Repositories\Eloquent\SewaRepository;
use App\Services\SewaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SewaController extends Controller
{
    public function __construct(
        private readonly SewaRepository $sewaRepository,
        private readonly SewaService $sewaService,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->success($this->sewaRepository->paginate($request->all()));
    }

    public function show(string $id): JsonResponse
    {
        return $this->success($this->sewaRepository->findOrFail($id));
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate(['status' => ['required', 'integer', 'between:0,7']]);
        $sewa = $this->sewaService->updateStatus($id, SewaStatus::from((int) $request->status));

        return $this->success($sewa, 'Status penyewaan diperbarui');
    }

    public function approve(string $id): JsonResponse
    {
        $sewa = $this->sewaService->approveOrder($id);

        return $this->success($sewa, 'Pesanan berhasil diverifikasi');
    }

    public function reject(string $id): JsonResponse
    {
        $sewa = $this->sewaService->updateStatus($id, SewaStatus::Ditolak);

        return $this->success($sewa, 'Pesanan ditolak');
    }

    public function releaseAlat(Request $request, string $id): JsonResponse
    {
        $request->validate(['alat_berat_id' => ['required', 'integer', 'exists:alat_berats,id']]);
        $sewa = $this->sewaService->releaseAlat($id, (int) $request->alat_berat_id);

        return $this->success($sewa, 'Alat berat dikembalikan ke status tersedia');
    }

    public function releaseAllExpiredAlat(string $id): JsonResponse
    {
        $sewa = $this->sewaService->releaseAllExpiredAlat($id);

        return $this->success($sewa, 'Semua alat berat yang masa sewanya habis telah dikembalikan');
    }
}
