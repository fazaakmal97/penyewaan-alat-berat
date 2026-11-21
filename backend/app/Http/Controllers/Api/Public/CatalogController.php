<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\Controller;
use App\Models\AlatBerat;
use App\Models\DetailSewa;
use App\Models\JenisAlat;
use App\Repositories\Eloquent\AlatBeratRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function __construct(private readonly AlatBeratRepository $alatBeratRepository)
    {
    }

    public function jenisAlat(): JsonResponse
    {
        return $this->success(JenisAlat::query()->where('is_active', true)->get());
    }

    public function index(Request $request): JsonResponse
    {
        $filters = array_merge($request->all(), ['is_active' => true]);

        return $this->success($this->alatBeratRepository->paginate($filters, (int) $request->get('per_page', 12)));
    }

    public function show(int $id): JsonResponse
    {
        $alat = AlatBerat::query()
            ->with(['model.merek', 'model.jenisAlat'])
            ->where('is_active', true)
            ->findOrFail($id);

        return $this->success($alat);
    }

    public function terbaru(): JsonResponse
    {
        $data = AlatBerat::query()
            ->with(['model.merek', 'model.jenisAlat'])
            ->where('is_active', true)
            ->latest()
            ->limit(8)
            ->get();

        return $this->success($data);
    }

    public function populer(): JsonResponse
    {
        $ids = DetailSewa::query()
            ->selectRaw('alat_berat_id, COUNT(*) as total')
            ->groupBy('alat_berat_id')
            ->orderByDesc('total')
            ->limit(8)
            ->pluck('alat_berat_id');

        $data = AlatBerat::query()
            ->with(['model.merek', 'model.jenisAlat'])
            ->whereIn('id', $ids)
            ->where('is_active', true)
            ->get();

        return $this->success($data);
    }
}
