<?php

namespace App\Http\Controllers\Api;

use App\Enums\HabitFrequency;
use App\Enums\HabitType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Habits\IndexHabitRequest;
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
    public function index(IndexHabitRequest $request): AnonymousResourceCollection
    {
        $filters = $request->filters();

        $habits = auth()->user()
            ->habits()
            ->when(isset($filters['active']), fn ($q) => $q->active($filters['active'])
            )
            ->ofType($filters['type'] ?? null)
            ->ofFrequency($filters['frequency'] ?? null)
            ->latest()
            ->get();

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
        abort_if($habit->user_id !== auth()->id(), Response::HTTP_NOT_FOUND);

        $habit->load('habitLogs');

        return new HabitResource($habit);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHabitRequest $request, Habit $habit): HabitResource
    {
        abort_if($habit->user_id !== auth()->id(), Response::HTTP_NOT_FOUND);

        $habit->update($request->validated());

        return new HabitResource($habit);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Habit $habit): Response
    {
        abort_if($habit->user_id !== auth()->id(), Response::HTTP_NOT_FOUND);

        $habit->delete();

        return response()->noContent();
    }

    /**
     * Mark the habit as complete for today.
     */
    public function complete(Habit $habit): HabitLogResource
    {
        abort_if($habit->user_id !== auth()->id(), Response::HTTP_NOT_FOUND);

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

    public function types()
    {
        return response()->json(
            collect(HabitType::cases())->map(fn ($c) => [
                'value' => $c->value,
                'label' => ucfirst($c->value),
            ])
        );
    }

    public function frequencies()
    {
        return response()->json(
            collect(HabitFrequency::cases())->map(fn ($c) => [
                'value' => $c->value,
                'label' => ucfirst($c->value),
            ])
        );
    }

    public function today()
    {
        $user = auth()->user();

        $habits = $user->habits()
            ->where('is_active', true)
            ->with(['habitLogs' => function ($q) {
                $q->where('date', today());
            }])
            ->get();

        $tasks = $habits->map(function (Habit $habit) {
            return [
                'id' => $habit->id,
                'title' => $habit->title,
                'type' => $habit->type->value,
                'frequency' => $habit->frequency->value,
                'completed' => $habit->habitLogs->isNotEmpty(),
            ];
        });

        return response()->json($tasks);
    }

    public function chart()
    {
        $user = auth()->user();
        $userId = $user->id;

        // 1. Отримуємо кількість активних звичок
        $activeHabitsCount = $user->habits()->active()->count();

        // 2. Статистика за сьогодні
        $completedToday = HabitLog::whereIn('habit_id', $user->habits()->pluck('id'))
            ->whereDate('date', today())
            ->count();

        // 3. Статистика за тиждень (останні 7 днів)
        $startOfWeek = today()->subDays(6);
        $completedThisWeek = HabitLog::whereIn('habit_id', $user->habits()->pluck('id'))
            ->whereBetween('date', [$startOfWeek, today()])
            ->count();

        // Загальна кількість "можливих" виконань за тиждень
        // (кількість активних звичок помножена на 7 днів)
        $totalPossibleThisWeek = $activeHabitsCount * 7;

        // 4. Розрахунок стріка (кількість днів поспіль, коли була виконана хоча б одна звичка)
        $streak = 0;
        $completedDates = HabitLog::whereIn('habit_id', $user->habits()->pluck('id'))
            ->selectRaw('date')
            ->whereDate('date', '<=', today())
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->pluck('date')
            ->map(fn ($date) => \Carbon\Carbon::parse($date)->format('Y-m-d'));

        $currentDate = today();

        // Якщо сьогодні ще нічого не зроблено, перевіряємо від вчора
        if (! $completedDates->contains($currentDate->format('Y-m-d'))) {
            $currentDate->subDay();
        }

        foreach ($completedDates as $date) {
            if ($date === $currentDate->format('Y-m-d')) {
                $streak++;
                $currentDate->subDay();
            } else {
                break;
            }
        }

        return response()->json([
            'today' => [
                'completed' => $completedToday,
                'total' => $activeHabitsCount,
            ],
            'week' => [
                'completed' => $completedThisWeek,
                'total' => $totalPossibleThisWeek,
            ],
            'streak' => $streak,
        ]);
    }
}
