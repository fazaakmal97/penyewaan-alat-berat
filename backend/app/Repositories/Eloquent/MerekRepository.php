<?php

namespace App\Repositories\Eloquent;

use App\Models\Merek;
use Illuminate\Database\Eloquent\Builder;

class MerekRepository extends BaseRepository
{
    public function __construct(Merek $model)
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
