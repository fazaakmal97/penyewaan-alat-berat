<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $user = User::query()
            ->where('username', $request->username)
            ->where('is_active', true)
            ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->error('Username atau password salah', 401);
        }

        $token = $user->createToken('admin-token', ['admin'])->plainTextToken;

        return $this->success([
            'token' => $token,
            'user' => $user,
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
}
