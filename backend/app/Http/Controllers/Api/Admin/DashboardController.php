<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService)
    {
    }

    public function index(): JsonResponse
    {
        return $this->success([
            'stats' => $this->dashboardService->getStats(),
            'penyewaan_per_bulan' => $this->dashboardService->penyewaanPerBulan(),
            'pendapatan_per_bulan' => $this->dashboardService->pendapatanPerBulan(),
            'alat_populer' => $this->dashboardService->alatPalingSeringDisewa(),
        ]);
    }
}
