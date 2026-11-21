<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\AlatBerat;
use App\Repositories\Eloquent\AlatBeratRepository;
use App\Services\CodeGeneratorService;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlatBeratController extends MasterCrudController
{
    public function __construct(
        AlatBeratRepository $repository,
        CodeGeneratorService $codeGenerator,
        private readonly FileUploadService $fileUploadService,
    ) {
        parent::__construct($repository, $codeGenerator, 'AB', 'kode');
    }

    protected function modelClass(): string
    {
        return AlatBerat::class;
    }

    protected function validationRules(string $action): array
    {
        return [
            'model_id' => ['required', 'exists:models,id'],
            'kode' => $this->uniqueKodeRule('alat_berats', 'alat_berat', $action),
            'nama' => ['required', 'string'],
            'tahun' => ['required', 'integer', 'min:1990', 'max:'.(date('Y') + 1)],
            'harga_sewa_harian' => ['required', 'numeric', 'min:0'],
            'status' => ['integer'],
            'foto' => ['nullable', 'image', 'max:5120'],
            'is_active' => ['boolean'],
        ];
    }

    public function store(Request $request): JsonResponse
    {
        $this->normalizeBooleanFields($request);
        $data = $this->normalizeKode($this->validateRequest($request, 'store'));

        if ($request->hasFile('foto')) {
            $file = $this->fileUploadService->upload($request->file('foto'), 'alat-berat');
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
        $data = $this->normalizeKode($this->validateRequest($request, 'update'));

        if ($request->hasFile('foto')) {
            $file = $this->fileUploadService->upload($request->file('foto'), 'alat-berat');
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
