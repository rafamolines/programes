<?php

declare(strict_types=1);

namespace Programes;

use DateTimeImmutable;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StudentExcelExporter
{
    public function __construct(private StudentRepository $repository)
    {
    }

    /**
     * Genera el fitxer Excel amb la llista d'alumnes i el desa a la ruta indicada.
     *
     * @param string $destinationPath Ruta completa (incloent-hi el nom del fitxer) on desar el document.
     */
    public function export(string $destinationPath): void
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $this->buildHeader($sheet);
        $this->fillBody($sheet);
        $this->autosizeColumns($sheet);

        $writer = new Xlsx($spreadsheet);
        $writer->save($destinationPath);
    }

    private function buildHeader(Worksheet $sheet): void
    {
        $headers = ['ID', 'Nom', 'Cognoms', 'Correu electrònic', 'Data de naixement'];

        foreach ($headers as $columnIndex => $header) {
            $cell = chr(65 + $columnIndex) . '1';
            $sheet->setCellValue($cell, $header);
            $sheet->getStyle($cell)->getFont()->setBold(true);
        }
    }

    private function fillBody(Worksheet $sheet): void
    {
        $students = $this->repository->all();

        $row = 2;
        foreach ($students as $student) {
            $sheet->setCellValueExplicit('A' . $row, (string) $student['id']);
            $sheet->setCellValue('B' . $row, $student['nom']);
            $sheet->setCellValue('C' . $row, $student['cognoms']);
            $sheet->setCellValue('D' . $row, $student['email']);
            $sheet->setCellValue('E' . $row, $this->formatDate($student['data_naixement']));
            ++$row;
        }
    }

    private function autosizeColumns(Worksheet $sheet): void
    {
        foreach (range('A', 'E') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
    }

    private function formatDate(?string $date): string
    {
        if ($date === null || $date === '') {
            return '';
        }

        $parsed = DateTimeImmutable::createFromFormat('Y-m-d', $date);

        return $parsed ? $parsed->format('d/m/Y') : $date;
    }
}
