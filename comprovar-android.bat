@echo off
echo Comprovant eines per preparar Android...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [FALTA] Node.js no esta instal.lat o no esta al PATH.
) else (
  echo [OK] Node.js:
  node --version
)

echo.
where npm >nul 2>nul
if errorlevel 1 (
  echo [FALTA] npm no esta instal.lat o no esta al PATH.
) else (
  echo [OK] npm:
  npm --version
)

echo.
echo Si falta npm, instal.la Node.js LTS des de https://nodejs.org/
echo Despres tanca i torna a obrir la terminal.
echo.
pause
