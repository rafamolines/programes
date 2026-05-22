# Saltador

Un joc senzill per a mobil: el personatge salta obstacles, suma punts quan els supera i la partida acaba quan toca un obstacle.

## Que inclou

- Pantalla inicial.
- Boto de salt pensat per mobil.
- Obstacles i puntuacio.
- Dificultat progressiva.
- So de salt, punt i xoc.
- Menu de pausa.
- Millor marca guardada al navegador.
- Fitxers preparats per convertir-lo en app Android amb Capacitor.

## Com provar-lo a l'ordinador

Opcio facil:

1. Fes doble clic a `provar.bat`.
2. Obre `http://localhost:3001` al navegador.

Opcio directa:

1. Fes doble clic a `jugar-directe.bat`.

Opcio amb terminal:

```powershell
py -m http.server 3001
```

Despres obre `http://localhost:3001`.

## Com provar-lo al mobil Android

1. Assegura't que l'ordinador i el mobil son a la mateixa Wi-Fi.
2. A l'ordinador, executa:

```powershell
py -m http.server 3001 --bind 0.0.0.0
```

3. Busca la IP local de l'ordinador.
4. Al Chrome del mobil, obre:

```text
http://IP-DE-L-ORDINADOR:3001
```

Per exemple: `http://192.168.1.35:3001`.

## Controls

- Mobil: toca la pantalla o el boto `Salta`.
- Ordinador: prem espai, fletxa amunt o fes clic.
- Pausa: boto `Pausa` o tecla `P`.
- So: boto `So`.

## Preparar APK Android

Quan vulguis fer una APK, necessites Node.js i Android Studio instal·lats. Despres executa:

```powershell
npm run android:init
npm run android:open
```

Aixo obrira Android Studio. Des d'alla pots generar l'APK.

## Si Windows diu que no reconeix npm

1. Instal.la Node.js LTS des de `https://nodejs.org/`.
2. Durant la instal.lacio, deixa marcada l'opcio d'afegir Node.js al PATH.
3. Tanca totes les terminals obertes.
4. Obre una terminal nova dins la carpeta del joc.
5. Comprova-ho amb:

```powershell
npm --version
```

Tambe pots fer doble clic a `comprovar-android.bat` per veure si `node` i `npm` ja estan disponibles.
