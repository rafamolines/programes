# Exportació d'alumnes a Excel

Aquest projecte mostra com generar un fitxer Excel amb el llistat d'alumnes
emmagatzemats a una base de dades MySQL utilitzant PHP i la llibreria
[PhpSpreadsheet](https://phpspreadsheet.readthedocs.io/).

## Requisits

- PHP 8.1 o superior amb l'extensió `pdo_mysql` habilitada.
- Composer per instal·lar les dependències del projecte.
- Accés a una base de dades MySQL amb una taula `alumnes` que contingui, com a mínim,
  els camps `id`, `nom`, `cognoms`, `email` i `data_naixement` (en format `YYYY-MM-DD`).

## Instal·lació

```bash
composer install
```

## Configuració

Actualitza el fitxer `export_config.php` amb les credencials de la teva base de dades
i la ruta de sortida desitjada per al fitxer Excel.

```php
return [
    'db_host' => '127.0.0.1',
    'db_name' => 'institut',
    'db_user' => 'usuari',
    'db_password' => 'contrasenya',
    'output_path' => __DIR__ . '/alumnes.xlsx',
];
```

## Ús

```bash
php export.php
```

El fitxer Excel es generarà a la ruta especificada i contindrà una pestanya amb els
alumnes ordenats per cognoms i nom.
