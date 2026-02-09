<?php

namespace App\Http\Controllers;

use App\Models\Bicycle;
use App\Models\Rental;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RentalController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->date('start');
        $end = $request->date('end');

        $now = Carbon::now();

        $bicycles = Bicycle::query()
            ->where('active', true)
            ->when($start && $end, function ($q) use ($start, $end) {
                $q->whereDoesntHave('rentals', function ($r) use ($start, $end) {
                    $r->where('starts_at', '<', $end)
                        ->where('ends_at', '>', $start);
                });
            }, function ($q) use ($now) {
                $q->whereDoesntHave('rentals', function ($r) use ($now) {
                    $r->where('starts_at', '<=', $now)
                        ->where('ends_at', '>=', $now);
                });
            })
            ->get();

        return Inertia::render('Welcome', [
            'bicycles' => $bicycles,
            'filters' => [
                'start' => optional($start)->toDateTimeString(),
                'end' => optional($end)->toDateTimeString(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'bicycle_id' => ['required', 'exists:bicycles,id'],
            'start' => ['required', 'date'],
            'end' => ['required', 'date', 'after:start'],
        ]);

        return DB::transaction(function () use ($data, $request) {

            $exists = Rental::where('bicycle_id', $data['bicycle_id'])
                ->where('starts_at', '<', $data['end'])
                ->where('ends_at', '>', $data['start'])
                ->lockForUpdate()
                ->exists();

            if ($exists) {
                return back()
                    ->withErrors(['reservation' => 'Velosipēds šajā periodā nav pieejams'])
                    ->withInput();
            }

            Rental::create([
                'bicycle_id' => $data['bicycle_id'],
                'user_id' => $request->user()->id,
                'starts_at' => $data['start'],
                'ends_at' => $data['end'],
            ]);

            return back();
        });
    }
}
