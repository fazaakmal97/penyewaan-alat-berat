<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\JenisAlat;
use App\Repositories\Eloquent\JenisAlatRepository;
use App\Services\CodeGeneratorService;

class JenisAlatController extends MasterCrudController
{
    public function __construct(CodeGeneratorService $codeGenerator)
    {
        parent::__construct(new JenisAlatRepository(new JenisAlat), $codeGenerator, 'JA', 'kode');
    }

    protected function modelClass(): string
    {
        return JenisAlat::class;
    }

    protected function validationRules(string $action): array
    {
        return [
            'kode' => $this->uniqueKodeRule('jenis_alats', 'jenis_alat', $action),
            'nama' => ['required', 'string'],
            'keterangan' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
