<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\Sewa\CheckoutRequest;
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
        $filters = array_merge($request->all(), [
            'customer_id' => $request->user()->id,
        ]);

        return $this->success($this->sewaRepository->paginate($filters));
    }

    public function store(CheckoutRequest $request): JsonResponse
    {
        $sewa = $this->sewaService->createFromCheckout($request->user(), $request->validated());

        return $this->success($sewa, 'Pesanan berhasil dibuat', 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $sewa = $this->sewaRepository->findOrFail($id);
        $sewa->load(['customer', 'detailSewas.alatBerat.model.merek', 'pembayarans']);

        if ($sewa->customer_id !== $request->user()->id) {
            return $this->error('Tidak diizinkan', 403);
        }

        return $this->success($sewa);
    }
}
