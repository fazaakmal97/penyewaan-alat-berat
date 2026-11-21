<?php

namespace App\Models;

use App\Traits\HasAuditFields;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ModelAlat extends BaseModel
{
    use HasAuditFields, HasFactory, SoftDeletes;

    protected $table = 'models';

    protected $fillable = [
        'jenis_alat_id',
        'merek_id',
        'kode',
        'nama',
        'keterangan',
        'kapasitas',
        'daya_mesin',
        'berat_operasional',
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

    public function jenisAlat(): BelongsTo
    {
        return $this->belongsTo(JenisAlat::class, 'jenis_alat_id');
    }

    public function merek(): BelongsTo
    {
        return $this->belongsTo(Merek::class, 'merek_id');
    }

    public function alatBerats(): HasMany
    {
        return $this->hasMany(AlatBerat::class, 'model_id');
    }
}
