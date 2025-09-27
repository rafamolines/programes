<?php

declare(strict_types=1);

namespace Programes;

use PDO;
use PDOException;

/**
 * Classe encarregada de crear i gestionar la connexió a la base de dades.
 */
class Database
{
    private PDO $connection;

    /**
     * @param string $host Host o IP del servidor MySQL.
     * @param string $database Nom de la base de dades.
     * @param string $username Nom d'usuari de MySQL.
     * @param string $password Contrasenya de MySQL.
     * @param string $charset Joc de caràcters utilitzat a la connexió.
     */
    public function __construct(
        string $host,
        string $database,
        string $username,
        string $password,
        string $charset = 'utf8mb4'
    ) {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $host, $database, $charset);

        try {
            $this->connection = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $exception) {
            throw new PDOException('No s\'ha pogut establir la connexió amb MySQL: ' . $exception->getMessage(), (int) $exception->getCode(), $exception);
        }
    }

    public function getConnection(): PDO
    {
        return $this->connection;
    }
}
