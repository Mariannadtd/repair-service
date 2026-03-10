# Repair Service App

Тестовое задание для позиции **Vibe Code Developer**.

Веб-приложение для управления заявками ремонтной службы.

Система позволяет:

* диспетчеру создавать и распределять заявки
* мастерам брать заявки в работу
* завершать ремонт

---

# Технологии

### Frontend

* Vue 3 (Composition API)
* Vite
* JavaScript

### Backend

* Node.js
* Express

### ORM

* Prisma

### База данных

* SQLite

### Контейнеризация

* Docker
* Docker Compose

---

# Архитектура приложения

```
Browser
   │
   │ http://localhost:5173
   ▼
Frontend (Vue + Vite)
   │
   │ HTTP API
   ▼
Backend (Node.js + Express)
   │
   │ Prisma ORM
   ▼
SQLite Database
```

---

# Docker архитектура

```
Docker Network
│
├── frontend container
│     └── Vue + Vite
│
└── backend container
      ├── Node.js
      ├── Express
      ├── Prisma
      └── SQLite
```

---

# Роли пользователей

В системе реализованы две роли.

### Диспетчер

Может:

* просматривать список заявок
* фильтровать заявки по статусу
* создавать новые заявки
* назначать мастеров
* отменять заявки

### Мастер

Может:

* видеть назначенные ему заявки
* брать заявку в работу
* завершать заявку

---

# Статусы заявок

```
new
assigned
in_progress
done
canceled
```

---

# API

| Метод | Endpoint               | Описание             |
| ----- | ---------------------- | -------------------- |
| GET   | /users                 | список пользователей |
| GET   | /requests              | список заявок        |
| POST  | /requests              | создать заявку       |
| PATCH | /requests/:id/assign   | назначить мастера    |
| PATCH | /requests/:id/take     | взять заявку         |
| PATCH | /requests/:id/complete | завершить заявку     |
| PATCH | /requests/:id/cancel   | отменить заявку      |

---

# Запуск проекта через Docker

### 1. Сборка контейнеров

```
docker compose build
```

### 2. Запуск приложения

```
docker compose up -d
```

### 3. Открыть приложение

Frontend:

```
http://localhost:5173
```

Backend API:

```
http://localhost:3001
```

---

# Тестовые пользователи

Создаются автоматически сидом базы данных.

| id | name       | role       |
| -- | ---------- | ---------- |
| 1  | dispatcher | dispatcher |
| 2  | master1    | master     |
| 3  | master2    | master     |

---

# Проверка race condition

Чтобы проверить защиту от параллельных запросов:

Откройте **два терминала** и выполните:

```
curl -X PATCH http://localhost:3001/requests/2/take -H "x-user-id: 2"
```

Ожидаемый результат:

```
один запрос → 200 OK
второй запрос → 409 Conflict
```

Это означает, что заявка **не может быть взята двумя мастерами одновременно**.

---

# Структура проекта

```
repair-service
│
├ backend
│  ├ prisma
│  ├ src
│  │  ├ routes
│  │  ├ lib
│  │  ├ app.js
│  │  └ server.js
│  └ Dockerfile
│
├ frontend
│  ├ src
│  │  ├ components
│  │  ├ views
│  │  └ api
│  └ Dockerfile
│
├ docker-compose.yml
├ README.md
├ DECISIONS.md
└ PROMPTS.md
```

---

# Race condition защита

Для защиты используется **атомарное обновление записи** в базе данных.

Пример логики:

```
updateMany
where:
  id = requestId
  status = assigned
```

Если запись уже изменена другим запросом — обновление не произойдёт.

Это гарантирует, что только **один мастер может перевести заявку из состояния**

```
assigned → in_progress
```

даже при параллельных запросах.

---

# Docker

Docker используется для:

* изоляции frontend и backend
* воспроизводимого запуска проекта
* упрощения локальной разработки
* запуска проекта одной командой

```
docker compose up
```

---

# Автор

Тестовое задание выполнено для компании **База Бизнеса**.

<img width="1876" height="964" alt="2026-03-10_21-44-36" src="https://github.com/user-attachments/assets/ab1dda9c-ec6a-4088-8d32-e34df77ec4eb" />
<img width="1828" height="940" alt="2026-03-10_21-44-09" src="https://github.com/user-attachments/assets/51749938-ad5f-4c29-a9ad-9fe45d3d51de" />
<img width="1824" height="944" alt="2026-03-10_21-43-20" src="https://github.com/user-attachments/assets/44acf604-15cc-40b6-bc87-8ede4743127c" />

