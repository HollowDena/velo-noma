<?php

namespace App\Http\Controllers;

use App\Models\Bicycle;
use App\Models\Rental;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BicycleController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->date('start');
        $end = $request->date('end');
        $search = $request->string('search')->trim();
        $color = $request->string('color')->trim();
        $frameSize = $request->string('frame_size')->trim();
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

        if ($color->isNotEmpty()) {
            $query->where('color', $color->toString());
        }

        if ($frameSize->isNotEmpty()) {
            $query->where('frame_size', $frameSize->toString());
        }

        if ($hasPeriod) {
            $query->withCount(['rentals as overlapping_rentals_count' => function ($q) use ($start, $end) {
                $q->where('starts_at', '<', $end)->where('ends_at', '>', $start);
            }]);
        }

        $userRentalByBicycle = collect();
        if ($hasPeriod && $request->user()) {
            $userRentalByBicycle = Rental::query()
                ->where('user_id', $request->user()->id)
                ->where('starts_at', '<', $end)
                ->where('ends_at', '>', $start)
                ->get()
                ->keyBy('bicycle_id');
        }

        $bicycles = $query->get()->map(function (Bicycle $bicycle) use ($hasPeriod, $userRentalByBicycle) {
            $data = $bicycle->toArray();
            if ($hasPeriod) {
                $data['available'] = ($bicycle->overlapping_rentals_count ?? 0) === 0;
                $data['current_user_rental_id'] = $userRentalByBicycle->get($bicycle->id)?->id;
            } else {
                $data['available'] = null;
                $data['current_user_rental_id'] = null;
            }
            unset($data['overlapping_rentals_count']);

            return $data;
        });

        $filterOptions = [
            'colors' => Bicycle::query()->where('active', true)->distinct()->pluck('color')->sort()->values()->all(),
            'frame_sizes' => Bicycle::query()->where('active', true)->distinct()->pluck('frame_size')->filter()->sort()->values()->all(),
        ];

        return Inertia::render('welcome', [
            'bicycles' => $bicycles,
            'filters' => [
                'start' => optional($start)->toDateTimeString(),
                'end' => optional($end)->toDateTimeString(),
                'search' => $search->toString() ?: null,
                'color' => $color->toString() ?: null,
                'frame_size' => $frameSize->toString() ?: null,
            ],
            'filter_options' => $filterOptions,
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
}
