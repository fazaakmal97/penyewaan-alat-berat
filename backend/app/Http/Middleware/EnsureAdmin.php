<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! ($user instanceof \App\Models\User)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Akun tidak aktif'], 403);
        }

        return $next($request);
    }
}
