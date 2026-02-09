FROM node:22-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM php:8.5-cli-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev libicu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) pdo_mysql mbstring zip exif pcntl bcmath intl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .
COPY --from=frontend /app/public/build ./public/build

RUN composer install --no-dev --no-interaction --optimize-autoloader \
    && php artisan storage:link 2>/dev/null || true

EXPOSE 10000

CMD ["sh", "-c", "php artisan config:cache 2>/dev/null || true && php artisan route:cache 2>/dev/null || true && php artisan view:cache 2>/dev/null || true && exec php -S 0.0.0.0:${PORT:-10000} -t public"]
