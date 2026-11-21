<?php

namespace App\Repositories\Eloquent;

use App\Models\ModelAlat;
use Illuminate\Database\Eloquent\Builder;

class ModelAlatRepository extends BaseRepository
{
    public function __construct(ModelAlat $model)
    {
        parent::__construct($model);
    }

    protected function query(array $filters = []): Builder
    {
        return parent::query($filters)->with(['jenisAlat', 'merek']);
    }

    protected function applySearch(Builder $query, string $search): void
    {
        $query->where(function (Builder $q) use ($search) {
            $q->where('kode', 'like', "%{$search}%")
                ->orWhere('nama', 'like', "%{$search}%");
        });
    }
}
