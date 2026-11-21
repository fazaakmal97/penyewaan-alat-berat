<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;

class CodeGeneratorService
{
    public function generate(string $prefix, Model $model, string $column = 'kode'): string
    {
        $latest = $model->newQuery()
            ->withTrashed()
            ->where($column, 'like', "{$prefix}%")
            ->orderByDesc($column)
            ->value($column);

        $number = 1;
        if ($latest && preg_match('/(\d+)$/', $latest, $matches)) {
            $number = (int) $matches[1] + 1;
        }

        return $prefix.str_pad((string) $number, 5, '0', STR_PAD_LEFT);
    }
}
