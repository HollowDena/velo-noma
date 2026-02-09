# ----- Build stage (PHP + Composer + Node) -----
FROM php:8.3-cli-bookworm AS build

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip curl ca-certificates \
    libzip-dev libonig-dev libicu-dev \
 && docker-php-ext-install mbstring zip intl pdo pdo_mysql \
 && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Node (20.x)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get update && apt-get install -y --no-install-recommends nodejs \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html
COPY public .

# PHP deps (needed so artisan can run)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Node deps
RUN npm ci

# Provide an env file for artisan (Wayfinder can require app bootstrap)
RUN if [ ! -f .env ]; then cp .env.example .env; fi \
 && php artisan key:generate --force || true

# Generate Wayfinder outputs (kept inside the image, not git)
RUN php artisan wayfinder:generate --with-form

# Now build Vite assets (imports will resolve because files exist)
RUN npm run build


# ----- Runtime stage -----
FROM php:8.3-cli-bookworm-slim AS runtime
WORKDIR /var/www/html
COPY --from=build /var/www/html /var/www/html

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-10000} -t public"]
