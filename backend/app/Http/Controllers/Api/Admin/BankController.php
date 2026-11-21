<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Bank;
use App\Repositories\Eloquent\BankRepository;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BankController extends MasterCrudController
{
    public function __construct(
        BankRepository $repository,
        private readonly FileUploadService $fileUploadService,
    ) {
        parent::__construct($repository);
    }

    protected function modelClass(): string
    {
        return Bank::class;
    }

    protected function validationRules(string $action): array
    {
        return [
            'nama' => ['required', 'string'],
            'no_rek' => ['required', 'string'],
            'atas_nama' => ['required', 'string'],
            'foto' => ['nullable', 'image', 'max:5120'],
            'is_active' => ['boolean'],
        ];
    }

    public function store(Request $request): JsonResponse
    {
        $this->normalizeBooleanFields($request);
        $data = $request->validate($this->validationRules('store'));

        if ($request->hasFile('foto')) {
            $file = $this->fileUploadService->upload($request->file('foto'), 'banks');
            $data['foto_name'] = $file['name'];
            $data['foto_url'] = $file['url'];
        }

        unset($data['foto']);

        $record = $this->repository->create($data);

        return $this->success($record, 'Data berhasil ditambahkan', 201);
    }

    public function update(Request $request, string|int $id): JsonResponse
    {
        $this->normalizeBooleanFields($request);
        $data = $request->validate($this->validationRules('update'));

        if ($request->hasFile('foto')) {
            $file = $this->fileUploadService->upload($request->file('foto'), 'banks');
            $data['foto_name'] = $file['name'];
            $data['foto_url'] = $file['url'];
        }

        unset($data['foto']);

        $record = $this->repository->update($id, $data);

        return $this->success($record, 'Data berhasil diperbarui');
    }

    private function normalizeBooleanFields(Request $request): void
    {
        if ($request->has('is_active')) {
            $request->merge([
                'is_active' => filter_var(
                    $request->input('is_active'),
                    FILTER_VALIDATE_BOOLEAN,
                    FILTER_NULL_ON_FAILURE
                ) ?? false,
            ]);
        }
    }
}
