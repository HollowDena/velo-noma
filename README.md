# Velo Noma

Velosipēdu nomas sistēma — tīmekļa lietotne velosipēdu apskatīšanai, rezervēšanai un administrēšanai.

## Kas ir projektā

- **Sākumlapa** — velosipēdu katalogs ar filtrēšanu pēc datuma perioda un meklēšanu pēc markas/modela
- **Rezervācijas** — autentificēti lietotāji var rezervēt velosipēdus
- **Administrācijas panelis** — administratori var skatīt un dzēst rezervācijas
- **Autentifikācija** — Laravel Fortify (reģistrācija, pieteikšanās, paroles maiņa, 2FA)
- **Iestatījumi** — profils, parole, izskats, divu faktoru autentifikācija

## Tehnoloģiju staks

| Sānu | Tehnoloģijas |
|------|--------------|
| Backend | Laravel 12, PHP 8.5 |
| Frontend | React 19, Inertia.js v2, TypeScript |
| Stils | Tailwind CSS v4 |
| Autentifikācija | Laravel Fortify |
| Maršrutēšana (frontend) | Laravel Wayfinder |
| UI komponentes | Radix UI, shadcn/ui |

## Prerekvizīti

- Docker un Docker Compose (projektam izmantots Laravel Sail)
- VAI: PHP 8.2+, Composer, Node.js 20+, npm

## Instalācija ar Laravel Sail (ieteicams)

1. Klonē repozitoriju un ej projekta direktorijā:
   ```bash
   cd velo-noma
   ```

2. Instalē Composer atkarības:
   ```bash
   composer install
   ```

3. Kopē `.env` no piemēra un ģenerē atslēgu:
   ```bash
   cp .env.example .env
   vendor/bin/sail artisan key:generate
   ```

4. Palaid Sail un migrācijas:
   ```bash
   vendor/bin/sail up -d
   vendor/bin/sail artisan migrate
   ```

5. Konfigurē `.env` ar MySQL parametriem (DB_CONNECTION=mysql, DB_DATABASE, DB_USERNAME, DB_PASSWORD utt.).

6. Pievieno sēklu datus (testa lietotāji un velosipēdi):
   ```bash
   vendor/bin/sail artisan db:seed
   ```

7. Instalē un būvē frontend:
   ```bash
   vendor/bin/sail npm install
   vendor/bin/sail npm run build
   ```

8. Atver lietotni pārlūkā:
   ```bash
   vendor/bin/sail open
   ```

## Instalācija bez Sail

```bash
composer install
cp .env.example .env
php artisan key:generate
# Konfigurē .env (DB_CONNECTION=mysql, DB_DATABASE, DB_USERNAME, DB_PASSWORD)
php artisan migrate 
php artisan db:seed
npm install
npm run build
php artisan serve
# Atsevišķā terminālī: npm run dev (ja vēlies hot reload)
```

## Izstrādes režīms

Lai palaistu pilnu izstrādes vidē (PHP serveris, Vite, rindas, logi):

```bash
vendor/bin/sail composer run dev
```

Vai bez Sail:
```bash
composer run dev
```

## Testa konti

Pēc `db:seed` ir pieejami:

| E-pasts | Parole | Loma |
|---------|--------|------|
| test@example.com | password | Lietotājs |
| admin@example.com | password | Administratoris |

## Datu bāze

Projekts izmanto MySQL. Sail sastāvā ir MySQL konteineris — `.env` jākonfigurē ar `DB_CONNECTION=mysql` un MySQL datu bāzes parametriem.

## Testi

Pirms testu palaišanas ieteicams iztīrīt konfigurācijas kešu (`config:clear`), lai izvairītos no 419 kļūdām. Ērtākais veids — izmantot Composer test skriptu:

```bash
vendor/bin/sail composer run test
```

Vai tieši:
```bash
vendor/bin/sail artisan config:clear
vendor/bin/sail artisan test --compact
```

Vai konkrēts fails:
```bash
vendor/bin/sail artisan test --compact tests/Feature/ExampleTest.php
```

## Kodu formātēšana

- PHP: `vendor/bin/sail bin pint --dirty --format agent`
- JS/TS: `vendor/bin/sail npm run format`

## Struktūra

```
app/
├── Http/Controllers/
│   ├── Admin/           # Administrācijas kontrolieri
│   ├── BicycleController.php
│   ├── RentalController.php
│   └── ...
├── Models/
│   ├── Bicycle.php
│   ├── Rental.php
│   └── User.php
resources/js/
├── components/          # React komponentes
├── pages/               # Inertia lapas
└── layouts/             # Izkārtojumi
routes/
├── web.php              # Galvenie maršruti
├── settings.php         # Iestatījumu maršruti
```

## Licence

MIT
