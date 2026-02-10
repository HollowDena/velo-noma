<?php

namespace Tests\Feature;

use App\Models\Bicycle;
use App\Models\Rental;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RentalCancelTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_cancel_rental(): void
    {
        $bicycle = Bicycle::create([
            'brand' => 'Test',
            'model' => 'Bike',
            'color' => 'red',
            'frame_size' => 'M',
            'active' => true,
        ]);
        $user = User::factory()->create();
        $rental = Rental::create([
            'bicycle_id' => $bicycle->id,
            'user_id' => $user->id,
            'starts_at' => Carbon::now()->addDay(),
            'ends_at' => Carbon::now()->addDays(2),
        ]);

        $response = $this->delete(route('rentals.destroy', $rental));

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('rentals', ['id' => $rental->id]);
    }

    public function test_user_can_cancel_own_rental(): void
    {
        $bicycle = Bicycle::create([
            'brand' => 'Test',
            'model' => 'Bike',
            'color' => 'red',
            'frame_size' => 'M',
            'active' => true,
        ]);
        $user = User::factory()->create();
        $this->actingAs($user);
        $rental = Rental::create([
            'bicycle_id' => $bicycle->id,
            'user_id' => $user->id,
            'starts_at' => Carbon::now()->addDay(),
            'ends_at' => Carbon::now()->addDays(2),
        ]);

        $response = $this->delete(route('rentals.destroy', $rental));

        $response->assertRedirect();
        $this->assertDatabaseMissing('rentals', ['id' => $rental->id]);
    }

    public function test_user_cannot_cancel_another_users_rental(): void
    {
        $bicycle = Bicycle::create([
            'brand' => 'Test',
            'model' => 'Bike',
            'color' => 'red',
            'frame_size' => 'M',
            'active' => true,
        ]);
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $rental = Rental::create([
            'bicycle_id' => $bicycle->id,
            'user_id' => $owner->id,
            'starts_at' => Carbon::now()->addDay(),
            'ends_at' => Carbon::now()->addDays(2),
        ]);

        $this->actingAs($otherUser);
        $response = $this->delete(route('rentals.destroy', $rental));

        $response->assertForbidden();
        $this->assertDatabaseHas('rentals', ['id' => $rental->id]);
    }
}
