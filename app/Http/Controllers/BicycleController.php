<?php

namespace App\Http\Controllers;

use App\Models\Bicycle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BicycleController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->date('start');
        $end = $request->date('end');

        $bicycles = Bicycle::query()
            ->where('active', true)
            ->when($start && $end, function ($q) use ($start, $end) {
                $q->whereDoesntHave('rentals', function ($r) use ($start, $end) {
                    $r->where('starts_at', '<', $end)
                        ->where('ends_at', '>', $start);
                });
            })
            ->get();

        return Inertia::render('welcome', [
            'bicycles' => $bicycles,
            'filters' => [
                'start' => optional($start)->toDateTimeString(),
                'end' => optional($end)->toDateTimeString(),
            ],
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
}
