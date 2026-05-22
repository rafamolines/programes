const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreText = document.querySelector("#score");
const jumpButton = document.querySelector("#jumpButton");
const restartButton = document.querySelector("#restartButton");
const pauseButton = document.querySelector("#pauseButton");
const soundButton = document.querySelector("#soundButton");
const startButton = document.querySelector("#startButton");
const menu = document.querySelector("#menu");

const world = {
  width: 360,
  height: 640,
  groundY: 540,
  baseSpeed: 4.2,
  gravity: 0.82,
};

const player = {
  x: 58,
  y: 0,
  width: 42,
  height: 54,
  velocityY: 0,
  jumping: false,
};

let obstacles = [];
let score = 0;
let bestScore = Number(localStorage.getItem("saltador-best") || 0);
let frame = 0;
let state = "menu";
let lastTime = 0;
let soundEnabled = localStorage.getItem("saltador-sound") !== "off";
let audioContext;

function updateButtons() {
  pauseButton.textContent = state === "paused" ? "Continua" : "Pausa";
  soundButton.textContent = soundEnabled ? "So: on" : "So: off";
}

function showMenu(title, text, buttonText) {
  menu.hidden = false;
  menu.querySelector("h1").textContent = title;
  menu.querySelector("p").textContent = text;
  startButton.textContent = buttonText;
}

function hideMenu() {
  menu.hidden = true;
}

function ensureAudio() {
  if (!soundEnabled) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(frequency, duration, type = "sine", volume = 0.08) {
  const audio = ensureAudio();
  if (!audio) {
    return;
  }

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
  gain.gain.setValueAtTime(volume, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + duration);
}

function playJumpSound() {
  playTone(520, 0.12, "triangle", 0.07);
}

function playPointSound() {
  playTone(760, 0.1, "sine", 0.06);
}

function playHitSound() {
  playTone(110, 0.28, "sawtooth", 0.06);
}

function resetGame(nextState = "playing") {
  player.y = world.groundY - player.height;
  player.velocityY = 0;
  player.jumping = false;
  obstacles = [];
  score = 0;
  frame = 0;
  state = nextState;
  scoreText.textContent = "0";
  if (state === "playing") {
    hideMenu();
  }
  updateButtons();
}

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * pixelRatio);
  canvas.height = Math.floor(rect.height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  world.width = rect.width;
  world.height = rect.height;
  world.groundY = rect.height - 78;
  if (!player.jumping) {
    player.y = world.groundY - player.height;
  }
}

function startGame() {
  resetGame("playing");
}

function togglePause() {
  if (state === "menu" || state === "gameover") {
    return;
  }

  if (state === "paused") {
    state = "playing";
    hideMenu();
  } else {
    state = "paused";
    showMenu("Pausa", `Punts: ${score}. Millor marca: ${bestScore}.`, "Continua");
  }
  updateButtons();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("saltador-sound", soundEnabled ? "on" : "off");
  updateButtons();
  if (soundEnabled) {
    playTone(660, 0.08, "sine", 0.04);
  }
}

function jump() {
  if (state === "menu" || state === "gameover") {
    startGame();
    return;
  }

  if (state === "paused") {
    togglePause();
    return;
  }

  if (!player.jumping) {
    player.velocityY = -15.5;
    player.jumping = true;
    playJumpSound();
  }
}

function spawnObstacle() {
  const height = 38 + Math.random() * 46;
  const width = 24 + Math.random() * 20;
  obstacles.push({
    x: world.width + 18,
    y: world.groundY - height,
    width,
    height,
    scored: false,
  });
}

function updatePlayer() {
  player.velocityY += world.gravity;
  player.y += player.velocityY;

  const floor = world.groundY - player.height;
  if (player.y >= floor) {
    player.y = floor;
    player.velocityY = 0;
    player.jumping = false;
  }
}

function updateObstacles() {
  const nextSpeed = world.baseSpeed + Math.min(score / 28, 4.1);
  obstacles.forEach((obstacle) => {
    obstacle.x -= nextSpeed;
    if (!obstacle.scored && obstacle.x + obstacle.width < player.x) {
      obstacle.scored = true;
      score += 1;
      scoreText.textContent = String(score);
      playPointSound();
    }
  });
  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > -20);

  const spacing = Math.max(66, 118 - score * 1.2);
  if (frame === 1 || frame % Math.round(spacing) === 0) {
    spawnObstacle();
  }
}

function hasCollision(a, b) {
  const padding = 8;
  return (
    a.x + padding < b.x + b.width &&
    a.x + a.width - padding > b.x &&
    a.y + padding < b.y + b.height &&
    a.y + a.height - padding > b.y
  );
}

function endGame() {
  state = "gameover";
  bestScore = Math.max(bestScore, score);
  localStorage.setItem("saltador-best", String(bestScore));
  playHitSound();
  showMenu("Fi de la partida", `Punts: ${score}. Millor marca: ${bestScore}.`, "Torna-hi");
  updateButtons();
}

function checkCollisions() {
  const hit = obstacles.some((obstacle) => hasCollision(player, obstacle));
  if (hit) {
    endGame();
  }
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, world.height);
  sky.addColorStop(0, "#7dd3fc");
  sky.addColorStop(0.58, "#bae6fd");
  sky.addColorStop(1, "#d9f99d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, world.width, world.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  ctx.beginPath();
  ctx.arc(world.width - 76, 74, 25, 0, Math.PI * 2);
  ctx.arc(world.width - 44, 78, 31, 0, Math.PI * 2);
  ctx.arc(world.width - 108, 82, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#65a30d";
  ctx.fillRect(0, world.groundY, world.width, world.height - world.groundY);
  ctx.fillStyle = "#3f6212";
  ctx.fillRect(0, world.groundY, world.width, 8);
}

function drawPlayer() {
  const bounce = player.jumping ? 0 : Math.sin(frame / 7) * 2;
  const x = player.x;
  const y = player.y + bounce;

  ctx.fillStyle = "rgba(15, 23, 42, 0.24)";
  ctx.beginPath();
  ctx.ellipse(x + 22, world.groundY + 6, 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.roundRect(x, y + 10, player.width, player.height - 10, 10);
  ctx.fill();

  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.arc(x + 22, y + 15, 17, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111827";
  ctx.fillRect(x + 27, y + 11, 6, 6);
  ctx.fillStyle = "#7c2d12";
  ctx.fillRect(x + 10, y + 4, 22, 7);

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 9, y + 44);
  ctx.lineTo(x - 1, y + 57);
  ctx.moveTo(x + 32, y + 44);
  ctx.lineTo(x + 43, y + 57);
  ctx.stroke();
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.roundRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 6);
    ctx.fill();
    ctx.fillStyle = "#991b1b";
    ctx.fillRect(obstacle.x, obstacle.y + 8, obstacle.width, 6);
  });
}

function drawHud() {
  ctx.fillStyle = "rgba(15, 23, 42, 0.32)";
  ctx.fillRect(12, 12, 118, 34);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "700 16px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Record: ${bestScore}`, 22, 35);
}

function draw() {
  drawBackground();
  drawPlayer();
  drawObstacles();
  drawHud();
}

function loop(time) {
  const elapsed = time - lastTime;
  lastTime = time;

  if (elapsed < 80 && state === "playing") {
    frame += 1;
    updatePlayer();
    updateObstacles();
    checkCollisions();
  }

  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    jump();
  }
  if (event.code === "KeyP") {
    togglePause();
  }
});
canvas.addEventListener("pointerdown", jump);
jumpButton.addEventListener("pointerdown", jump);
startButton.addEventListener("click", () => {
  if (state === "paused") {
    togglePause();
  } else {
    startGame();
  }
});
pauseButton.addEventListener("click", togglePause);
soundButton.addEventListener("click", toggleSound);
restartButton.addEventListener("click", () => resetGame("playing"));

resizeCanvas();
resetGame("menu");
showMenu("Saltador", "Salta obstacles, suma punts i aguanta cada vegada mes velocitat.", "Comenca");
updateButtons();
requestAnimationFrame(loop);
