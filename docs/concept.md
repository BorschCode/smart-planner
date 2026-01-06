Добре. Нижче — **детальний, покроковий розбір Smart Planner / Habit Tracker**, так як його реально роблять у продакшені, але **доступно для навчання**. Це не «іграшка», а правильний навчальний проєкт.

---

## 🎯 Що таке Smart Planner / Habit Tracker

Це застосунок, де користувач:

* створює **звички / задачі**
* відмічає виконання
* бачить прогрес
* користується **web + mobile** з одним бекендом

Ціль не дизайн, а **архітектура + логіка**.

---

## 🧠 Основна ідея

Один і той самий продукт:

* Web (React)
* Mobile (React Native)
* Backend (Laravel API)

Ти вчишся:

* думати компонентами
* працювати з API
* переносити логіку між платформами

---

## 🧩 ДОМЕННА МОДЕЛЬ (важливо)

### Сутності

**User**

* id
* name
* email

**Habit / Task**

* id
* title
* description
* type: `task | habit`
* frequency: `daily | weekly`
* is_completed
* created_at

**HabitLog**

* habit_id
* date
* completed

Це вже **реальна модель**, не навчальна.

---

## 🖥️ ЕТАП 1 — WEB (React)

### 📄 Сторінки

1. **Dashboard**

   * список звичок
   * кнопка “Add”
   * фільтр: all / active / completed

2. **Create Habit**

   * input title
   * select frequency
   * save

3. **Edit Habit**

   * редагування
   * delete

---

### ⚙️ React-логіка (що ти реально вивчиш)

#### Компоненти

* `App`
* `HabitList`
* `HabitItem`
* `HabitForm`

#### Hooks

* `useState` — стан
* `useEffect` — завантаження даних
* `useCallback` — оптимізація
* `useContext` — глобальний стан (пізніше)

#### Патерни

* lifting state up
* controlled inputs
* conditional rendering

---

### 🔁 Приклад стану

```js
habits = [
  {
    id: 1,
    title: "Drink water",
    frequency: "daily",
    completed: false
  }
]
```

---

## 🔌 ЕТАП 2 — BACKEND (Laravel API)

Тут ти перестаєш бути «тільки фронтендером».

### 📡 API маршрути

```
GET    /api/habits
POST   /api/habits
PUT    /api/habits/{id}
DELETE /api/habits/{id}
POST   /api/habits/{id}/complete
```

---

### 🧱 Laravel структура

* Controllers
* Form Requests
* API Resources
* Policies (пізніше)
* Sanctum auth

Ти вчишся:

* валідації
* REST
* відповідальності бекенду

---

### 🔄 React ↔ Laravel

У React:

* `fetch`
* `async / await`
* loading / error state

```js
useEffect(() => {
  fetch('/api/habits')
    .then(res => res.json())
    .then(setHabits)
}, [])
```

---

## 📱 ЕТАП 3 — MOBILE (React Native)

Це **той самий застосунок**, але:

* немає `<div>`
* є `<View>`
* немає CSS, є `StyleSheet`

---

### 📲 React Native UI

* `FlatList`
* `TouchableOpacity`
* `TextInput`
* Navigation (Stack)

---

### 🔁 Найважливіше відкриття

> **90% логіки React = 90% логіки React Native**

Ти переносиш:

* state
* hooks
* API
* бізнес-логіку

---

## 🧪 ЕТАП 4 — Розширення (опціонально)

Коли базове працює:

* статистика (streaks)
* календар
* push notifications
* offline mode
* dark mode

---

## 🏁 Кінцевий результат

Після цього проєкту ти:

* розумієш React, а не копіюєш
* можеш зробити SPA
* можеш зробити mobile app
* маєш **один сильний pet-проєкт**

---

## 🧠 Чому саме цей pet-проєкт правильний

* простий UI
* складна логіка
* реальний use case
* масштабований
* підходить для співбесіди
