<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Habits\StoreHabitRequest;
use App\Http\Requests\Habits\UpdateHabitRequest;
use App\Http\Resources\HabitLogResource;
use App\Http\Resources\HabitResource;
use App\Models\Habit;
use App\Models\HabitLog;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class HabitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $habits = auth()->user()->habits;

        return HabitResource::collection($habits);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHabitRequest $request): HabitResource
    {
        $habit = auth()->user()->habits()->create($request->validated());

        return new HabitResource($habit);
    }

    /**
     * Display the specified resource.
     */
    public function show(Habit $habit): HabitResource
    {
        abort_if($habit->user_id !== auth()->id(), 404);

        return new HabitResource($habit);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHabitRequest $request, Habit $habit): HabitResource
    {
        abort_if($habit->user_id !== auth()->id(), 404);

        $habit->update($request->validated());

        return new HabitResource($habit);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Habit $habit): Response
    {
        abort_if($habit->user_id !== auth()->id(), 404);

        $habit->delete();

        return response()->noContent();
    }

    /**
     * Mark the habit as complete for today.
     */
    public function complete(Habit $habit): HabitLogResource
    {
        abort_if($habit->user_id !== auth()->id(), 404);

        $log = HabitLog::updateOrCreate(
            [
                'habit_id' => $habit->id,
                'date' => today(),
            ],
            [
                'completed' => true,
            ]
        );

        return new HabitLogResource($log);
    }
}
