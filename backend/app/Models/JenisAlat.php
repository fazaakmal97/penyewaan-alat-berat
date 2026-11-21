<?php

namespace App\Models;

use App\Traits\HasAuditFields;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class JenisAlat extends BaseModel
{
    use HasAuditFields, HasFactory, SoftDeletes;

    protected $table = 'jenis_alats';

    protected $fillable = [
        'kode',
        'nama',
        'keterangan',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function models(): HasMany
    {
        return $this->hasMany(ModelAlat::class, 'jenis_alat_id');
    }
}
