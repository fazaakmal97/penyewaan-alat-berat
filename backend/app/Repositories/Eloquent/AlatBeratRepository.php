<?php

namespace App\Repositories\Eloquent;

use App\Models\AlatBerat;
use Illuminate\Database\Eloquent\Builder;

class AlatBeratRepository extends BaseRepository
{
    public function __construct(AlatBerat $model)
    {
        parent::__construct($model);
    }

    protected function query(array $filters = []): Builder
    {
        $query = parent::query($filters)->with(['model.merek', 'model.jenisAlat']);

        if (! empty($filters['jenis_alat_id'])) {
            $query->whereHas('model', fn (Builder $q) => $q->where('jenis_alat_id', $filters['jenis_alat_id']));
        }

        if (! empty($filters['merek_id'])) {
            $query->whereHas('model', fn (Builder $q) => $q->where('merek_id', $filters['merek_id']));
        }

        if (! empty($filters['tahun'])) {
            $query->where('tahun', $filters['tahun']);
        }

        if (! empty($filters['harga_min'])) {
            $query->where('harga_sewa_harian', '>=', $filters['harga_min']);
        }

        if (! empty($filters['harga_max'])) {
            $query->where('harga_sewa_harian', '<=', $filters['harga_max']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query;
    }

    protected function applySearch(Builder $query, string $search): void
    {
        $query->where(function (Builder $q) use ($search) {
            $q->where('kode', 'like', "%{$search}%")
                ->orWhere('nama', 'like', "%{$search}%");
        });
    }
}
