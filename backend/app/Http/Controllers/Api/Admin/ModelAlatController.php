<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\ModelAlat;
use App\Repositories\Eloquent\ModelAlatRepository;
use App\Services\CodeGeneratorService;

class ModelAlatController extends MasterCrudController
{
    public function __construct(CodeGeneratorService $codeGenerator)
    {
        parent::__construct(new ModelAlatRepository(new ModelAlat), $codeGenerator, 'MD', 'kode');
    }

    protected function modelClass(): string
    {
        return ModelAlat::class;
    }

    protected function validationRules(string $action): array
    {
        return [
            'jenis_alat_id' => ['required', 'exists:jenis_alats,id'],
            'merek_id' => ['required', 'exists:mereks,id'],
            'kode' => $this->uniqueKodeRule('models', 'model', $action),
            'nama' => ['required', 'string'],
            'keterangan' => ['nullable', 'string'],
            'kapasitas' => ['nullable', 'string'],
            'daya_mesin' => ['nullable', 'string'],
            'berat_operasional' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
