<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\Auth\CustomerLoginRequest;
use App\Http\Requests\Auth\CustomerRegisterRequest;
use App\Models\Customer;
use App\Services\CodeGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private readonly CodeGeneratorService $codeGenerator)
    {
    }

    public function register(CustomerRegisterRequest $request): JsonResponse
    {
        $customer = Customer::query()->create([
            'kode' => $this->codeGenerator->generate('CST', new Customer),
            'nama' => $request->nama,
            'email' => $request->email,
            'no_hp' => $request->no_hp,
            'alamat' => $request->alamat,
            'password' => $request->password,
            'pic' => $request->pic,
        ]);

        $token = $customer->createToken('customer-token', ['customer'])->plainTextToken;

        return $this->success([
            'token' => $token,
            'customer' => $customer,
        ], 'Registrasi berhasil', 201);
    }

    public function login(CustomerLoginRequest $request): JsonResponse
    {
        $customer = Customer::query()
            ->where('email', $request->email)
            ->where('is_active', true)
            ->first();

        if (! $customer || ! Hash::check($request->password, $customer->password)) {
            return $this->error('Email atau password salah', 401);
        }

        $token = $customer->createToken('customer-token', ['customer'])->plainTextToken;

        return $this->success([
            'token' => $token,
            'customer' => $customer,
        ], 'Login berhasil');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->success(null, 'Logout berhasil');
    }

    public function profile(Request $request): JsonResponse
    {
        return $this->success($request->user());
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => ['sometimes', 'string', 'max:255'],
            'no_hp' => ['sometimes', 'string', 'max:20'],
            'alamat' => ['sometimes', 'string'],
            'pic' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $customer = $request->user();
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $customer->update($data);

        return $this->success($customer->fresh(), 'Profil diperbarui');
    }
}
