<?php

namespace App\Repositories\Eloquent;

use App\Models\Bank;
use Illuminate\Database\Eloquent\Builder;

class BankRepository extends BaseRepository
{
    public function __construct(Bank $model)
    {
        parent::__construct($model);
    }

    protected function applySearch(Builder $query, string $search): void
    {
        $query->where(function (Builder $q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
                ->orWhere('no_rek', 'like', "%{$search}%")
                ->orWhere('atas_nama', 'like', "%{$search}%");
        });
    }
}
