<?php

namespace App\Repositories\Eloquent;

use App\Models\JenisAlat;
use Illuminate\Database\Eloquent\Builder;

class JenisAlatRepository extends BaseRepository
{
    public function __construct(JenisAlat $model)
    {
        parent::__construct($model);
    }

    protected function applySearch(Builder $query, string $search): void
    {
        $query->where(function (Builder $q) use ($search) {
            $q->where('kode', 'like', "%{$search}%")
                ->orWhere('nama', 'like', "%{$search}%");
        });
    }
}
