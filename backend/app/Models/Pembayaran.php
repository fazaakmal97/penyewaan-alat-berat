<?php

namespace App\Models;

use App\Enums\PembayaranStatus;
use App\Traits\HasAuditFields;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pembayaran extends BaseModel
{
    use HasAuditFields, HasFactory, HasUuids, SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'sewa_id',
        'tgl_bayar',
        'jumlah_bayar',
        'bukti_name',
        'bukti_url',
        'status',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'tgl_bayar' => 'date',
            'jumlah_bayar' => 'decimal:2',
            'status' => PembayaranStatus::class,
            'is_active' => 'boolean',
        ];
    }

    public function sewa(): BelongsTo
    {
        return $this->belongsTo(Sewa::class);
    }
}
