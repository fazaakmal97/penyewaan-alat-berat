<?php

namespace App\Repositories\Eloquent;

use App\Models\Sewa;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SewaRepository extends BaseRepository
{
    public function __construct(Sewa $model)
    {
        parent::__construct($model);
    }

    /** @return list<string> */
    protected function defaultWith(): array
    {
        return [
            'customer',
            'detailSewas.alatBerat.model.merek',
            'detailSewas.alatBerat.model.jenisAlat',
            'pembayarans',
        ];
    }

    protected function query(array $filters = []): Builder
    {
        $query = parent::query($filters);

        if (! empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $query->with($this->defaultWith());

        return $query;
    }

    public function findOrFail(int|string $id): Model
    {
        return $this->model->newQuery()->with($this->defaultWith())->findOrFail($id);
    }

    protected function applySearch(Builder $query, string $search): void
    {
        $query->where(function (Builder $q) use ($search) {
            $q->where('kode', 'like', "%{$search}%")
                ->orWhere('nama_pic', 'like', "%{$search}%");
        });
    }
}
