<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Smart Planner') }} — Панель Управління</title>

    <!-- Шрифт: Inter або Instrument Sans -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,600,700" rel="stylesheet" />

    <!-- Стилі / Скрипти (Vite) -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col items-center justify-center p-6">

<!-- Верхня навігація (Admin/Auth links) -->
<header class="w-full max-w-4xl mb-8">
    @if (Route::has('login'))
        <nav class="flex items-center justify-end space-x-4">
            @auth
                <a
                    href="{{ url('/dashboard') }}"
                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150"
                >
                    Перейти до Панелі
                </a>
            @else
                <a
                    href="{{ route('login') }}"
                    class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-transparent rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-150"
                >
                    Вхід
                </a>

                @if (Route::has('register'))
                    <a
                        href="{{ route('register') }}"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150"
                    >
                        Реєстрація
                    </a>
                @endif
            @endauth
        </nav>
    @endif
</header>

<!-- Головна картка опису проекту -->
<main class="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">

    <div class="text-center">
        <h1 class="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
            Smart Planner
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Система управління особистим розвитком та відстеження звичок
        </p>
    </div>

    <section class="space-y-8">
        <h2 class="text-3xl font-bold border-b pb-3 border-indigo-200 dark:border-indigo-700 text-gray-900 dark:text-gray-50">
            Про Проект
        </h2>

        <div class="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <p>
                Smart Planner — це сучасна, повнофункціональна система, призначена для <strong>управління особистим розвитком та планування</strong>. Наша мета — надати користувачам інтуїтивно зрозумілий інструмент для ефективного відстеження та формування корисних звичок.
            </p>
            <p>
                Проект розроблений як високопродуктивний <strong>Single Page Application (SPA)</strong>. Це забезпечує швидкий, динамічний користувацький досвід без необхідності перезавантажувати сторінку, спираючись на чисту API-орієнтовану архітектуру.
            </p>
        </div>

        <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            Технологічний Стек
        </h3>
        <ul class="list-disc list-inside space-y-2 pl-4 text-gray-700 dark:text-gray-400">
            <li><span class="font-semibold">Бекенд (API):</span> Laravel (PHP) — слугує потужним, API-орієнтованим ядром для всієї бізнес-логіки.</li>
            <li><span class="font-semibold">Фронтенд (UI):</span> React — забезпечує динамічний та адаптивний інтерфейс користувача.</li>
            <li><span class="font-semibold">Черги:</span> Redis — використовується для асинхронної обробки завдань та відкладених дій.</li>
        </ul>

        <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            Основні Можливості
        </h3>
        <ul class="list-disc list-inside space-y-2 pl-4 text-gray-700 dark:text-gray-400">
            <li><span class="font-semibold">Відстеження Звичок (Habit Tracker):</span> Повний CRUD функціонал для створення, оновлення та відмітки звичок як виконаних.</li>
            <li><span class="font-semibold">Автентифікація:</span> Надійна система входу, реєстрації та керування сесіями через Laravel Fortify.</li>
            <li><span class="font-semibold">API-орієнтована Архітектура:</span> Чіткий поділ на бекенд (Laravel API) та фронтенд (React).</li>
        </ul>

        <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
            Призначення цієї Сторінки
        </h3>
        <div class="p-4 bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 rounded-lg">
            <p class="text-yellow-800 dark:text-yellow-300 font-medium">
                Ця сторінка є <strong>статичною заглушкою</strong> (landing page) і слугує <strong>входом до адміністративної частини</strong> (Management/Admin Panel).
            </p>
            <p class="text-yellow-700 dark:text-yellow-400 mt-1 text-sm">
                Весь основний функціонал для кінцевих користувачів реалізовано у клієнтському React-додатку. Для доступу до адмін-функцій скористайтеся посиланням "Перейти до Панелі" після входу.
            </p>
        </div>

    </section>

</main>

<!-- Футер -->
<footer class="mt-8 text-sm text-gray-500 dark:text-gray-600">
    <p>&copy; {{ date('Y') }} {{ config('app.name', 'Smart Planner') }}. Усі права захищені.</p>
</footer>

</body>
</html>
