<?php

namespace App\Http\Requests\Sewa;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_pic' => ['required', 'string', 'max:255'],
            'no_hp_pic' => ['required', 'string', 'max:20'],
            'alamat_pengiriman' => ['required', 'string'],
            'catatan' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.alat_berat_id' => ['required', 'exists:alat_berats,id'],
            'items.*.tgl_mulai' => ['required', 'date', 'after_or_equal:today'],
            'items.*.tgl_selesai' => ['required', 'date', 'after_or_equal:items.*.tgl_mulai'],
        ];
    }
}
