<?php

/*
| Front controller for the Laravel API when the SPA and the API share one document root (Hostinger).
| The Laravel application lives outside the web root, next to public_html:
|   ~/domains/<site>/laravel        ← backend/ (app, vendor, .env — never web accessible)
|   ~/domains/<site>/public_html    ← SPA build + this file at /api/index.php
| Set LARAVEL_PATH in the environment to point somewhere else.
*/

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$app = getenv('LARAVEL_PATH') ?: dirname(__DIR__, 2).'/laravel';

if (! is_file($app.'/vendor/autoload.php')) {
    http_response_code(503);
    header('Content-Type: application/json');
    exit('{"message":"API belum terpasang."}');
}

// Routes are registered as /api/...; present this script as the site root so that prefix is kept.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

if (is_file($maintenance = $app.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $app.'/vendor/autoload.php';

/** @var Application $laravel */
$laravel = require_once $app.'/bootstrap/app.php';

$laravel->handleRequest(Request::capture());
