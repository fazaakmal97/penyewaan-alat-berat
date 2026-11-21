<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements BaseRepositoryInterface
{
    public function __construct(protected Model $model)
    {
    }

    protected function query(array $filters = []): Builder
    {
        $query = $this->model->newQuery();

        if (! empty($filters['with_trashed'])) {
            $query->withTrashed();
        }

        if (! empty($filters['only_trashed'])) {
            $query->onlyTrashed();
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        if (! empty($filters['search'])) {
            $this->applySearch($query, $filters['search']);
        }

        if (! empty($filters['sort_by'])) {
            $direction = $filters['sort_dir'] ?? 'asc';
            $query->orderBy($filters['sort_by'], $direction);
        } else {
            $query->latest();
        }

        return $query;
    }

    protected function applySearch(Builder $query, string $search): void
    {
        //
    }

    public function all(array $filters = []): Collection
    {
        return $this->query($filters)->get();
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->query($filters)->paginate($perPage);
    }

    public function find(int|string $id): ?Model
    {
        return $this->model->newQuery()->find($id);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int|string $id, array $data): Model
    {
        $record = $this->findOrFail($id);
        $record->update($data);

        return $record->fresh();
    }

    public function delete(int|string $id): bool
    {
        return (bool) $this->findOrFail($id)->delete();
    }

    public function restore(int|string $id): Model
    {
        $record = $this->model->newQuery()->withTrashed()->findOrFail($id);
        $record->restore();

        return $record->fresh();
    }

    public function forceDelete(int|string $id): bool
    {
        return (bool) $this->model->newQuery()->withTrashed()->findOrFail($id)->forceDelete();
    }

    public function findOrFail(int|string $id): Model
    {
        return $this->model->newQuery()->findOrFail($id);
    }
}
