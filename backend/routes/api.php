<?php

use App\Http\Controllers\Api\Admin\AlatBeratController;
use App\Http\Controllers\Api\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Api\Admin\BankController;
use App\Http\Controllers\Api\Admin\CustomerController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\JenisAlatController;
use App\Http\Controllers\Api\Admin\MerekController;
use App\Http\Controllers\Api\Admin\ModelAlatController;
use App\Http\Controllers\Api\Admin\PembayaranController as AdminPembayaranController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\SewaController as AdminSewaController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Customer\AuthController as CustomerAuthController;
use App\Http\Controllers\Api\Customer\PembayaranController as CustomerPembayaranController;
use App\Http\Controllers\Api\Customer\SewaController as CustomerSewaController;
use App\Http\Controllers\Api\Public\CatalogController;
use App\Models\Bank;
use Illuminate\Support\Facades\Route;

Route::prefix('public')->group(function () {
    Route::get('jenis-alat', [CatalogController::class, 'jenisAlat']);
    Route::get('alat-berat', [CatalogController::class, 'index']);
    Route::get('alat-berat/terbaru', [CatalogController::class, 'terbaru']);
    Route::get('alat-berat/populer', [CatalogController::class, 'populer']);
    Route::get('alat-berat/{id}', [CatalogController::class, 'show']);
    Route::get('banks', fn () => response()->json([
        'success' => true,
        'data' => Bank::query()->where('is_active', true)->get(),
    ]));
});

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout']);
        Route::get('profile', [AdminAuthController::class, 'profile']);
        Route::get('dashboard', [DashboardController::class, 'index']);

        Route::get('laporan/penyewaan', [ReportController::class, 'penyewaan']);

        Route::apiResource('customers', CustomerController::class);
        Route::post('customers/{customer}/restore', [CustomerController::class, 'restore']);

        Route::apiResource('jenis-alat', JenisAlatController::class);
        Route::post('jenis-alat/{jenis_alat}/restore', [JenisAlatController::class, 'restore']);

        Route::apiResource('merek', MerekController::class);
        Route::post('merek/{merek}/restore', [MerekController::class, 'restore']);

        Route::apiResource('model', ModelAlatController::class);
        Route::post('model/{model}/restore', [ModelAlatController::class, 'restore']);

        Route::apiResource('alat-berat', AlatBeratController::class);
        Route::post('alat-berat/{alat_berat}/restore', [AlatBeratController::class, 'restore']);

        Route::apiResource('bank', BankController::class);
        Route::post('bank/{bank}/restore', [BankController::class, 'restore']);

        Route::apiResource('users', UserController::class);
        Route::post('users/{user}/restore', [UserController::class, 'restore']);

        Route::get('sewa', [AdminSewaController::class, 'index']);
        Route::get('sewa/{id}', [AdminSewaController::class, 'show']);
        Route::patch('sewa/{id}/status', [AdminSewaController::class, 'updateStatus']);
        Route::post('sewa/{id}/approve', [AdminSewaController::class, 'approve']);
        Route::post('sewa/{id}/reject', [AdminSewaController::class, 'reject']);
        Route::post('sewa/{id}/release-alat', [AdminSewaController::class, 'releaseAlat']);
        Route::post('sewa/{id}/release-all-expired', [AdminSewaController::class, 'releaseAllExpiredAlat']);

        Route::get('pembayaran', [AdminPembayaranController::class, 'index']);
        Route::get('pembayaran/{id}', [AdminPembayaranController::class, 'show']);
        Route::post('pembayaran/{id}/verify', [AdminPembayaranController::class, 'verify']);
        Route::post('pembayaran/{id}/reject', [AdminPembayaranController::class, 'reject']);
    });
});

Route::prefix('customer')->group(function () {
    Route::post('register', [CustomerAuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('login', [CustomerAuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', 'customer'])->group(function () {
        Route::post('logout', [CustomerAuthController::class, 'logout']);
        Route::get('profile', [CustomerAuthController::class, 'profile']);
        Route::put('profile', [CustomerAuthController::class, 'updateProfile']);

        Route::get('sewa', [CustomerSewaController::class, 'index']);
        Route::post('sewa', [CustomerSewaController::class, 'store']);
        Route::get('sewa/{id}', [CustomerSewaController::class, 'show']);
        Route::post('sewa/{sewaId}/pembayaran', [CustomerPembayaranController::class, 'store']);
    });
});
