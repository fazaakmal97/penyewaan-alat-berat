<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Merek;
use App\Repositories\Eloquent\MerekRepository;
use App\Services\CodeGeneratorService;

class MerekController extends MasterCrudController
{
    public function __construct(CodeGeneratorService $codeGenerator)
    {
        parent::__construct(new MerekRepository(new Merek), $codeGenerator, 'MR', 'kode');
    }

    protected function modelClass(): string
    {
        return Merek::class;
    }

    protected function validationRules(string $action): array
    {
        return [
            'kode' => $this->uniqueKodeRule('mereks', 'merek', $action),
            'nama' => ['required', 'string'],
            'keterangan' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
