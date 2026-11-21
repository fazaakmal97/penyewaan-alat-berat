<?php

namespace App\Models;

use App\Enums\AlatBeratStatus;
use App\Traits\HasAuditFields;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AlatBerat extends BaseModel
{
    use HasAuditFields, HasFactory, SoftDeletes;

    protected $fillable = [
        'model_id',
        'kode',
        'nama',
        'tahun',
        'harga_sewa_harian',
        'status',
        'foto_name',
        'foto_url',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'harga_sewa_harian' => 'decimal:2',
            'status' => AlatBeratStatus::class,
            'is_active' => 'boolean',
            'tahun' => 'integer',
        ];
    }

    public function model(): BelongsTo
    {
        return $this->belongsTo(ModelAlat::class, 'model_id');
    }

    public function detailSewas(): HasMany
    {
        return $this->hasMany(DetailSewa::class);
    }
}
