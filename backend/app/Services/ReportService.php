<?php

namespace App\Services;

use App\Enums\SewaStatus;
use App\Models\Sewa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReportService
{
    /**
     * @return array{period: string, label: string, from: string, to: string}
     */
    public function resolvePeriod(Request $request): array
    {
        $period = $request->input('period', 'daily');

        return match ($period) {
            'daily' => $this->resolveDaily(
                $request->input('date_from'),
                $request->input('date_to'),
            ),
            'monthly' => $this->resolveMonthly(
                (int) $request->input('year'),
                (int) $request->input('month_from'),
                (int) $request->input('month_to'),
            ),
            'yearly' => $this->resolveYearly(
                (int) $request->input('year_from'),
                (int) $request->input('year_to'),
            ),
            default => throw ValidationException::withMessages([
                'period' => ['Periode tidak valid.'],
            ]),
        };
    }

    public function laporanPenyewaan(Request $request): array
    {
        $period = $this->resolvePeriod($request);
        $from = Carbon::parse($period['from'])->startOfDay();
        $to = Carbon::parse($period['to'])->endOfDay();

        $rows = Sewa::query()
            ->with(['customer:id,nama,kode'])
            ->withCount('detailSewas')
            ->whereBetween('tanggal', [$from->toDateString(), $to->toDateString()])
            ->where('status', '!=', SewaStatus::Draft->value)
            ->orderBy('tanggal')
            ->orderBy('kode')
            ->get()
            ->map(fn (Sewa $s) => [
                'id' => $s->id,
                'kode' => $s->kode,
                'tanggal' => $s->tanggal?->format('Y-m-d'),
                'customer' => $s->customer?->nama ?? '-',
                'customer_kode' => $s->customer?->kode ?? '-',
                'total_harga' => (float) $s->total_harga,
                'status' => $s->status instanceof SewaStatus ? $s->status->value : (int) $s->status,
                'status_label' => $s->status instanceof SewaStatus
                    ? $s->status->label()
                    : SewaStatus::from((int) $s->status)->label(),
                'jumlah_alat' => (int) ($s->detail_sewas_count ?? 0),
            ])
            ->values()
            ->all();

        $totalNilai = array_sum(array_column($rows, 'total_harga'));

        return [
            'meta' => [
                ...$period,
                'report_type' => 'penyewaan',
                'total_rows' => count($rows),
                'total_nilai' => $totalNilai,
            ],
            'rows' => $rows,
        ];
    }

    private function resolveDaily(?string $dateFrom, ?string $dateTo): array
    {
        $from = Carbon::parse($dateFrom ?: Carbon::today()->toDateString())->locale('id');
        $to = Carbon::parse($dateTo ?: $from->toDateString())->locale('id');

        if ($from->gt($to)) {
            throw ValidationException::withMessages([
                'date_from' => ['Tanggal dari tidak boleh setelah tanggal sampai.'],
            ]);
        }

        $label = $from->isSameDay($to)
            ? $from->translatedFormat('d F Y')
            : $from->translatedFormat('d F Y').' — '.$to->translatedFormat('d F Y');

        return [
            'period' => 'daily',
            'label' => $label,
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
        ];
    }

    private function resolveMonthly(int $year, int $monthFrom, int $monthTo): array
    {
        if ($year < 2000 || $year > 2100) {
            throw ValidationException::withMessages(['year' => ['Tahun tidak valid.']]);
        }

        if ($monthFrom < 1 || $monthFrom > 12 || $monthTo < 1 || $monthTo > 12) {
            throw ValidationException::withMessages(['month_from' => ['Bulan tidak valid.']]);
        }

        if ($monthFrom > $monthTo) {
            throw ValidationException::withMessages([
                'month_from' => ['Bulan dari tidak boleh setelah bulan sampai.'],
            ]);
        }

        $from = Carbon::create($year, $monthFrom, 1)->locale('id')->startOfMonth();
        $to = Carbon::create($year, $monthTo, 1)->locale('id')->endOfMonth();

        $label = $monthFrom === $monthTo
            ? $from->translatedFormat('F Y')
            : $from->translatedFormat('F').' — '.$to->translatedFormat('F Y');

        return [
            'period' => 'monthly',
            'label' => $label,
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
        ];
    }

    private function resolveYearly(int $yearFrom, int $yearTo): array
    {
        if ($yearFrom < 2000 || $yearFrom > 2100 || $yearTo < 2000 || $yearTo > 2100) {
            throw ValidationException::withMessages(['year_from' => ['Tahun tidak valid.']]);
        }

        if ($yearFrom > $yearTo) {
            throw ValidationException::withMessages([
                'year_from' => ['Tahun dari tidak boleh setelah tahun sampai.'],
            ]);
        }

        $from = Carbon::create($yearFrom, 1, 1)->startOfYear();
        $to = Carbon::create($yearTo, 12, 31)->endOfYear();

        $label = $yearFrom === $yearTo
            ? "Tahun {$yearFrom}"
            : "Tahun {$yearFrom} — {$yearTo}";

        return [
            'period' => 'yearly',
            'label' => $label,
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
        ];
    }
}
