# XML Generator

Веб-приложение для создания, проверки и экспорта XML-файлов по XSD-схемам.

IFC-направление исключено из текущего объема работ. Проект развивается как XML-only инструмент: шаблоны, генерация, загрузка существующих XML, валидация, экспорт, история и авторизация.

## Текущий фокус

1. Генерация XML без строковой склейки.
2. XSD-валидация перед экспортом.
3. Понятные ошибки валидации в интерфейсе.
4. Загрузка и редактирование существующих XML.
5. Автосохранение черновика в текущей сессии.
6. Авторизация и хранение пользовательских файлов.
7. Автотесты для генерации, валидации и основных пользовательских сценариев.
8. CI/CD и деплой после стабилизации базового XML-сценария.

## Локальный запуск

Backend:

```bash
cd backend
dotnet run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

По умолчанию frontend обращается к backend по адресу `http://localhost:5287`.
Для другого адреса API можно задать `VITE_API_URL`.

## Docker

Для контейнерного запуска используется `docker-compose.yml`.

Скопируйте пример переменных окружения и при необходимости поменяйте пароль БД:

```bash
cp .env.example .env
```

Сборка образов:

```bash
docker compose build
```

Запуск стека:

```bash
docker compose up -d
```

После запуска:

- frontend: `http://localhost:8083`;
- backend API: `http://localhost:5287`;
- PostgreSQL: `localhost:5432`.

Frontend-контейнер отдает статическую сборку через nginx и проксирует `/api` на backend внутри compose-сети.
Backend и PostgreSQL по умолчанию привязаны к `127.0.0.1`, наружу открыт только frontend-порт.

## CD

Деплой на сервер настроен через GitHub Actions workflow `.github/workflows/deploy.yml`.
Он запускается на каждый `push` в `main` и вручную через `workflow_dispatch`.

Workflow:

1. Берет код из репозитория.
2. Копирует проект на сервер по SSH/SCP.
3. На сервере выполняет:

```bash
docker compose config
docker compose build
docker compose up -d --remove-orphans
docker compose ps
```

Для работы деплоя нужно добавить GitHub Secrets:

```text
DEPLOY_HOST=148.253.210.27
DEPLOY_USER=root
DEPLOY_PASSWORD=<пароль сервера>
DEPLOY_PORT=22
DEPLOY_PATH=/opt/xml-ifc-generator
POSTGRES_PASSWORD=<пароль PostgreSQL для приложения>
```

На сервере в `${DEPLOY_PATH}/.env` можно переопределить порты и пароль БД.
Для текущего сервера выбран свободный frontend-порт `8083`.

## Проверки

Backend tests:

```bash
cd backend
dotnet test XML-IFC-generator.sln
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## CI

В репозитории настроен GitHub Actions workflow `.github/workflows/ci.yml`.
Он запускается на `push` в `main`/`master` и на pull request.

Проверки CI:

- backend restore, build, tests;
- frontend `npm ci`, lint, build.

## Первый реализованный сценарий

Страница `/create-xml` отправляет данные формы на backend endpoint:

```http
POST /api/xml/generate
```

Backend:

- формирует XML через `XmlWriter`;
- проверяет результат по встроенной XSD-схеме;
- возвращает XML, статус валидности и список ошибок;
- не позволяет frontend экспортировать невалидный XML.

Страница `/upload` читает XML-файл в браузере и отправляет содержимое на endpoint:

```http
POST /api/xml/validate
```

Backend проверяет файл по той же XSD-схеме и возвращает результат валидации. Последний валидный загруженный XML сохраняется в `sessionStorage` как черновик.

Для валидного XML дополнительно вызывается endpoint:

```http
POST /api/xml/parse
```

Он преобразует XML обратно в структуру формы. После этого файл можно открыть на странице `/create-xml` уже с заполненными полями.

XSD-схема проекта хранится отдельно от C#-кода:

```text
backend/Schemas/construction-project.xsd
```

## Ближайшие задачи

1. Добавить более точное сопоставление ошибок валидации с полями формы.
2. Добавить frontend-тесты для upload/create XML сценариев.
3. Развить хранение нескольких XSD-шаблонов.
4. Добавить миграции/инициализацию БД при контейнерном запуске.
