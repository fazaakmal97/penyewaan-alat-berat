<?php

namespace App\Enums;

enum PembayaranStatus: int
{
    case Pending = 0;
    case Diverifikasi = 1;
    case Ditolak = 2;

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Menunggu Verifikasi',
            self::Diverifikasi => 'Diverifikasi',
            self::Ditolak => 'Ditolak',
        };
    }
}
