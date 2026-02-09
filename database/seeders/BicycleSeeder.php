<?php

namespace Database\Seeders;

use App\Models\Bicycle;
use Illuminate\Database\Seeder;

class BicycleSeeder extends Seeder
{
    public function run(): void
    {
        $bikes = [
            ['brand' => 'Trek',   'model' => 'FX 2',     'color' => 'Black',  'frame_size' => 'M'],
            ['brand' => 'Giant',  'model' => 'Escape 3', 'color' => 'Blue',   'frame_size' => 'L'],
            ['brand' => 'Merida', 'model' => 'Crossway', 'color' => 'Green',  'frame_size' => 'M'],
            ['brand' => 'Cube',   'model' => 'Nature',   'color' => 'Grey',   'frame_size' => 'L'],
            ['brand' => 'Scott',  'model' => 'Sub Cross', 'color' => 'Red',    'frame_size' => 'M'],
            ['brand' => 'Kona',   'model' => 'Dew',      'color' => 'Yellow', 'frame_size' => 'M'],
            ['brand' => 'Specialized', 'model' => 'Sirrus', 'color' => 'White',  'frame_size' => 'L'],
            ['brand' => 'Cannondale', 'model' => 'Quick',   'color' => 'Orange', 'frame_size' => 'M'],
            ['brand' => 'Bianchi', 'model' => 'C-Sport',  'color' => 'Celeste', 'frame_size' => 'M'],
            ['brand' => 'Orbea',  'model' => 'Carpe',    'color' => 'Navy',   'frame_size' => 'L'],
        ];

        foreach ($bikes as $b) {
            Bicycle::create($b);
        }
    }
}
