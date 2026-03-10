Веб-сервис «Заявки в ремонтную службу»

Тестовое задание для компании База Бизнеса.

Приложение предназначено для приёма и обработки заявок в ремонтную службу. Система позволяет диспетчеру создавать и распределять заявки между мастерами, а мастерам — брать заявки в работу и завершать их.

Технологии

Frontend
Vue 3 (Composition API)
Vite
JavaScript
Backend
Node.js
Express
ORM
Prisma
База данных
SQLite
Контейнеризация
Docker
Docker Compose

Роли пользователей

В системе реализованы две роли.

Диспетчер

Может:
просматривать список заявок
фильтровать заявки по статусу
назначать мастеров
отменять заявки
создавать новые заявки

Мастер

Может:
видеть только назначенные ему заявки
брать заявку в работу
завершать заявку

Статусы заявок
Статус Описание
new новая заявка
assigned заявка назначена мастеру
in_progress заявка в работе
done заявка выполнена
canceled заявка отменена
Запуск проекта через Docker (рекомендуется)
Требования

Необходимо установить:

Docker Desktop

Docker Compose

Запуск

В корне проекта выполнить:

docker compose up --build -d

После запуска приложение будет доступно:

Frontend:

http://localhost:5173

Backend API:

http://localhost:3001
Остановка проекта
docker compose down
Запуск проекта без Docker

1. Установка зависимостей
   В корне проекта:
   npm install

Далее backend:
cd backend
npm install

2. Создание базы данных
   cd backend
   npx prisma migrate dev
   npx prisma generate
   npm run prisma:seed

3. Запуск backend
   cd backend
   node src/server.js
   Backend будет доступен:
   http://localhost:3000

4. Запуск frontend
   Из папки frontend:
   npm install
   npm run dev
   Frontend будет доступен:
   http://localhost:5173
   Тестовые пользователи

Создаются автоматически сидом базы данных.

id имя роль
1 dispatcher dispatcher
2 master1 master
3 master2 master
Проверка race condition

Чтобы проверить защиту от параллельных запросов, нужно одновременно выполнить два запроса.

При запуске через Docker

В двух терминалах:

curl -X PATCH http://localhost:3001/requests/2/take -H "x-user-id: 2"

Ожидаемый результат:

один запрос получает 200 OK

второй запрос получает 409 Conflict

Это означает, что заявка не может быть взята двумя мастерами одновременно.

Структура проекта
repair-service
│
├── backend
│ ├── prisma
│ │ └── schema.prisma
│ │
│ ├── src
│ │ ├── routes
│ │ ├── lib
│ │ ├── app.js
│ │ └── server.js
│ │
│ ├── Dockerfile
│ └── dev.db
│
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── views
│ │ └── api
│ │
│ └── Dockerfile
│
├── docker-compose.yml
├── README.md
├── DECISIONS.md
└── PROMPTS.md
Архитектура приложения
Browser
│
│ http://localhost:5173
▼
Frontend (Vue + Vite)
│
│ HTTP API
▼
Backend (Node + Express)
│
│ Prisma ORM
▼
SQLite Database

Docker используется для запуска frontend и backend в изолированных контейнерах и упрощения локального запуска проекта.

Примечание

Для защиты от race condition используется атомарное обновление записи через условный updateMany в базе данных.

Это гарантирует, что только один мастер может перевести заявку из состояния:

assigned → in_progress

даже при одновременных запросах.
