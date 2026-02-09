<?php

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader
| for our application. We just need to utilize it!
|
*/

require __DIR__.'/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Clear Config Cache Before Tests
|--------------------------------------------------------------------------
|
| When config is cached, APP_ENV from the cache overrides phpunit.xml's
| APP_ENV=testing. This causes CSRF middleware to stay enabled, leading to
| 419 errors on POST requests. Clearing the config cache ensures tests run
| with APP_ENV=testing so CSRF is properly disabled.
|
*/

$configCache = __DIR__.'/../bootstrap/cache/config.php';
if (file_exists($configCache)) {
    unlink($configCache);
}
