<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RentalController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'bicycle_id' => ['required', 'exists:bicycles,id'],
            'start' => ['required', 'date'],
            'end' => ['required', 'date', 'after:start'],
        ]);

        DB::transaction(function () use ($data, $request) {

            $exists = Rental::where('bicycle_id', $data['bicycle_id'])
                ->where('starts_at', '<', $data['end'])
                ->where('ends_at', '>', $data['start'])
                ->lockForUpdate()
                ->exists();

            if ($exists) {
                abort(422, 'Velosipēds šajā periodā nav pieejams');
            }

            Rental::create([
                'bicycle_id' => $data['bicycle_id'],
                'user_id' => $request->user()->id,
                'starts_at' => $data['start'],
                'ends_at' => $data['end'],
            ]);
        });

        return redirect()->back();
    }
}
