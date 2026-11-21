<?php

namespace App\Http\Middleware;

use App\Models\Customer;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCustomer
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! ($user instanceof Customer)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Akun tidak aktif'], 403);
        }

        return $next($request);
    }
}
