<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Programes\Database;
use Programes\StudentExcelExporter;
use Programes\StudentRepository;

$config = require __DIR__ . '/export_config.php';

$database = new Database(
    $config['db_host'],
    $config['db_name'],
    $config['db_user'],
    $config['db_password'],
    $config['db_charset'] ?? 'utf8mb4'
);

$repository = new StudentRepository($database->getConnection());
$exporter = new StudentExcelExporter($repository);

$destinationPath = $config['output_path'] ?? (__DIR__ . '/alumnes.xlsx');

$exporter->export($destinationPath);

echo sprintf("Fitxer generat correctament a: %s\n", $destinationPath);
