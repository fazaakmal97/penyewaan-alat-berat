<?php

namespace App\Models;

use App\Traits\HasAuditFields;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DetailSewa extends BaseModel
{
    use HasAuditFields, HasFactory, HasUuids, SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'sewa_id',
        'alat_berat_id',
        'harga_harian',
        'tgl_mulai',
        'tgl_selesai',
        'jumlah_hari',
        'subtotal',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'harga_harian' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'tgl_mulai' => 'date',
            'tgl_selesai' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function sewa(): BelongsTo
    {
        return $this->belongsTo(Sewa::class);
    }

    public function alatBerat(): BelongsTo
    {
        return $this->belongsTo(AlatBerat::class);
    }
}
