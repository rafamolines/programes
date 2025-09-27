<?php

declare(strict_types=1);

namespace Programes;

use PDO;

/**
 * Repositori encarregat de recuperar les dades dels alumnes.
 */
class StudentRepository
{
    public function __construct(private PDO $connection)
    {
    }

    /**
     * Retorna tots els alumnes ordenats per cognom i nom.
     *
     * @return array<int, array<string, scalar|null>>
     */
    public function all(): array
    {
        $statement = $this->connection->query(
            'SELECT id, nom, cognoms, email, data_naixement FROM alumnes ORDER BY cognoms, nom'
        );

        return $statement !== false ? $statement->fetchAll() : [];
    }
}
