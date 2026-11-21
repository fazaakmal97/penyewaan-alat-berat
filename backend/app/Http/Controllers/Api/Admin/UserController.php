<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Repositories\Eloquent\UserRepository;

class UserController extends MasterCrudController
{
    public function __construct()
    {
        parent::__construct(new UserRepository(new User));
    }

    protected function modelClass(): string
    {
        return User::class;
    }

    protected function validationRules(string $action): array
    {
        $usernameRule = $action === 'store'
            ? 'unique:users,username'
            : 'unique:users,username,'.request()->route('user');

        return [
            'nama' => ['required', 'string'],
            'username' => ['required', 'string', $usernameRule],
            'password' => [$action === 'store' ? 'required' : 'nullable', 'string', 'min:8'],
            'is_active' => ['boolean'],
        ];
    }
}
