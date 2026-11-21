<?php

namespace App\Enums;

enum AlatBeratStatus: int
{
    case Tersedia = 0;
    case Disewa = 1;
    case Maintenance = 2;

    public function label(): string
    {
        return match ($this) {
            self::Tersedia => 'Tersedia',
            self::Disewa => 'Disewa',
            self::Maintenance => 'Maintenance',
        };
    }
}
