<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Controller;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private readonly ReportService $reportService)
    {
    }

    public function penyewaan(Request $request): JsonResponse
    {
        $request->validate([
            'period' => ['required', 'in:daily,monthly,yearly'],
            'date_from' => ['nullable', 'date', 'required_if:period,daily'],
            'date_to' => ['nullable', 'date', 'required_if:period,daily'],
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100', 'required_if:period,monthly'],
            'month_from' => ['nullable', 'integer', 'min:1', 'max:12', 'required_if:period,monthly'],
            'month_to' => ['nullable', 'integer', 'min:1', 'max:12', 'required_if:period,monthly'],
            'year_from' => ['nullable', 'integer', 'min:2000', 'max:2100', 'required_if:period,yearly'],
            'year_to' => ['nullable', 'integer', 'min:2000', 'max:2100', 'required_if:period,yearly'],
        ]);

        return $this->success($this->reportService->laporanPenyewaan($request));
    }
}
