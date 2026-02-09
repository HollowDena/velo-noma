FROM php:8.3-cli-bookworm AS build

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip curl ca-certificates \
    libzip-dev libpng-dev libonig-dev libxml2-dev libicu-dev \
 && docker-php-ext-configure intl \
 && docker-php-ext-install -j$(nproc) pdo_mysql mbstring zip exif pcntl bcmath intl \
 && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get update && apt-get install -y --no-install-recommends nodejs \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN if [ ! -f .env ]; then cp .env.example .env; fi \
 && php artisan key:generate --force || true

RUN npm run build


FROM php:8.3-cli-bookworm-slim AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
    libzip4 libpng16-16 libicu72 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --from=build /var/www/html /var/www/html

EXPOSE 10000
CMD ["sh", "-c", "php artisan config:cache 2>/dev/null || true && php artisan route:cache 2>/dev/null || true && php artisan view:cache 2>/dev/null || true && exec php -S 0.0.0.0:${PORT:-10000} -t public"]
