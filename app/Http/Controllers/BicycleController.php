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
        $search = $request->string('search')->trim();
        $hasPeriod = $start && $end;

        $query = Bicycle::query()->where('active', true);

        if ($search->isNotEmpty()) {
            $term = '%'.$search->toString().'%';
            $query->where(function ($q) use ($term) {
                $q->where('brand', 'like', $term)
                    ->orWhere('model', 'like', $term)
                    ->orWhere('color', 'like', $term)
                    ->orWhere('frame_size', 'like', $term);
            });
        }

        if ($hasPeriod) {
            $query->withCount(['rentals as overlapping_rentals_count' => function ($q) use ($start, $end) {
                $q->where('starts_at', '<', $end)->where('ends_at', '>', $start);
            }]);
        }

        $bicycles = $query->get()->map(function (Bicycle $bicycle) use ($hasPeriod) {
            $data = $bicycle->toArray();
            if ($hasPeriod) {
                $data['available'] = ($bicycle->overlapping_rentals_count ?? 0) === 0;
            } else {
                $data['available'] = null;
            }
            unset($data['overlapping_rentals_count']);

            return $data;
        });

        return Inertia::render('welcome', [
            'bicycles' => $bicycles,
            'filters' => [
                'start' => optional($start)->toDateTimeString(),
                'end' => optional($end)->toDateTimeString(),
                'search' => $search->toString() ?: null,
            ],
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
}
