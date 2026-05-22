@echo off
cd /d "%~dp0"
echo Obrint servidor local per provar Saltador...
echo.
echo Obre aquest enllac al navegador:
echo http://localhost:3001
echo.
echo Per aturar-lo, tanca aquesta finestra.
py -m http.server 3001
if errorlevel 1 (
  echo.
  echo No s'ha pogut iniciar amb "py". Provant amb "python"...
  python -m http.server 3001
)
pause
