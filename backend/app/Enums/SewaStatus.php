<?php

namespace App\Enums;

enum SewaStatus: int
{
    case Draft = 0;
    case MenungguPembayaran = 1;
    case MenungguVerifikasi = 2;
    case Disetujui = 3;
    case SedangBerjalan = 4;
    case Selesai = 5;
    case Ditolak = 6;
    case Dibatalkan = 7;

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::MenungguPembayaran => 'Menunggu Pembayaran',
            self::MenungguVerifikasi => 'Menunggu Verifikasi',
            self::Disetujui => 'Disetujui',
            self::SedangBerjalan => 'Sedang Berjalan',
            self::Selesai => 'Selesai',
            self::Ditolak => 'Ditolak',
            self::Dibatalkan => 'Dibatalkan',
        };
    }
}
