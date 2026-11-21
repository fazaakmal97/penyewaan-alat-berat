<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Customer;
use App\Repositories\Eloquent\CustomerRepository;
use App\Services\CodeGeneratorService;

class CustomerController extends MasterCrudController
{
    public function __construct(CustomerRepository $repository, CodeGeneratorService $codeGenerator)
    {
        parent::__construct($repository, $codeGenerator, 'CST', 'kode');
    }

    protected function modelClass(): string
    {
        return Customer::class;
    }

    protected function validationRules(string $action): array
    {
        $emailRule = $action === 'store'
            ? 'unique:customers,email'
            : 'unique:customers,email,'.request()->route('customer');

        return [
            'kode' => $this->uniqueKodeRule('customers', 'customer', $action),
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', $emailRule],
            'no_hp' => ['required', 'string', 'max:20'],
            'alamat' => ['nullable', 'string'],
            'password' => [$action === 'store' ? 'required' : 'nullable', 'string', 'min:8'],
            'pic' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ];
    }
}
