<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Controller;
use App\Repositories\Eloquent\BaseRepository;
use App\Services\CodeGeneratorService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

abstract class MasterCrudController extends Controller
{
    public function __construct(
        protected BaseRepository $repository,
        protected ?CodeGeneratorService $codeGenerator = null,
        protected ?string $codePrefix = null,
        protected ?string $codeColumn = 'kode',
    ) {
    }

    protected function modelClass(): string
    {
        return Model::class;
    }

    protected function validationRules(string $action): array
    {
        return [];
    }

    /** @return array<int, mixed> */
    protected function uniqueKodeRule(string $table, string $routeParameter, string $action): array
    {
        $unique = Rule::unique($table, 'kode')->whereNull('deleted_at');

        if ($action === 'update') {
            $id = request()->route($routeParameter);
            if ($id !== null) {
                $unique->ignore($id);
            }
        }

        return ['required', 'string', 'max:50', $unique];
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->repository->paginate($request->all(), (int) $request->get('per_page', 15));

        return $this->success($data);
    }

    protected function normalizeKode(array $data): array
    {
        if (array_key_exists('kode', $data) && is_string($data['kode'])) {
            $data['kode'] = trim($data['kode']);
        }

        return $data;
    }

    protected function masterValidationMessages(): array
    {
        return [
            'kode.required' => 'Kode wajib diisi.',
            'kode.unique' => 'Kode sudah digunakan.',
            'kode.max' => 'Kode maksimal 50 karakter.',
        ];
    }

    protected function validateRequest(Request $request, string $action): array
    {
        return $request->validate($this->validationRules($action), $this->masterValidationMessages());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->normalizeKode($this->validateRequest($request, 'store'));

        $record = $this->repository->create($data);

        return $this->success($record, 'Data berhasil ditambahkan', 201);
    }

    public function show(string|int $id): JsonResponse
    {
        return $this->success($this->repository->findOrFail($id));
    }

    public function update(Request $request, string|int $id): JsonResponse
    {
        $data = $this->normalizeKode($this->validateRequest($request, 'update'));
        $record = $this->repository->update($id, $data);

        return $this->success($record, 'Data berhasil diperbarui');
    }

    public function destroy(string|int $id): JsonResponse
    {
        $this->repository->delete($id);

        return $this->success(null, 'Data berhasil dihapus');
    }

    public function restore(string|int $id): JsonResponse
    {
        $record = $this->repository->restore($id);

        return $this->success($record, 'Data berhasil dipulihkan');
    }
}
