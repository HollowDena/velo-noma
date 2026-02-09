<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RentalController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();

        $query = Rental::query()->with(['bicycle', 'user']);

        if ($search->isNotEmpty()) {
            $term = '%'.$search->toString().'%';
            $query->where(function ($q) use ($term) {
                $q->whereHas('user', function ($uq) use ($term) {
                    $uq->where('name', 'like', $term)->orWhere('email', 'like', $term);
                })->orWhereHas('bicycle', function ($bq) use ($term) {
                    $bq->where('brand', 'like', $term)->orWhere('model', 'like', $term);
                });
            });
        }

        $rentals = $query->orderBy('starts_at', 'desc')
            ->get()
            ->map(fn (Rental $r) => [
                'id' => $r->id,
                'bicycle' => [
                    'id' => $r->bicycle->id,
                    'brand' => $r->bicycle->brand,
                    'model' => $r->bicycle->model,
                ],
                'user' => [
                    'id' => $r->user->id,
                    'name' => $r->user->name,
                    'email' => $r->user->email,
                ],
                'starts_at' => $r->starts_at->toIso8601String(),
                'ends_at' => $r->ends_at->toIso8601String(),
            ]);

        return Inertia::render('admin/rentals/index', [
            'rentals' => $rentals,
            'filters' => [
                'search' => $search->toString() ?: null,
            ],
        ]);
    }

    public function destroy(Rental $rental): \Illuminate\Http\RedirectResponse
    {
        $rental->delete();

        return back();
    }
}
