/**
 * Romantic Proposal Website — script.js
 * ======================================
 * Handles:
 *  - Loading screen
 *  - Custom cursor
 *  - Background floating hearts
 *  - Music toggle
 *  - "No" button evasion + message cycling
 *  - "Yes" celebration (confetti, burst hearts, music)
 *  - Web Audio click sound effects
 */

/* ============================================================
   1. ROMANTIC MESSAGES ARRAY
      Every time "No" is clicked, the next message is shown.
   ============================================================ */
const MESSAGES = [
  "I will buy you a BMW 🚗",
  "I will take you on long rides 🌃",
  "I will take you to movies 🎬",
  "I will buy you your favourite food 🍕",
  "I will take you shopping 🛍️",
  "I will give you all my attention ❤️",
  "Please say yes, you are my happiness 🥺",
  "I will travel the world with you ✈️",
  "I will make you laugh every single day 😄",
  "I will cook your favourite meal every week 🍳",
  "I will be your best friend forever 🤝",
  "I will hold your hand through every storm 🌧️",
  "I will write you love letters every morning 💌",
  "I will be your safe place, always 🏠",
  "My heart beats only for you 💓",
  "You are the only one I want 🌹",
  "PLEASE... I am literally begging you 🙏",
  "The button will NEVER stop until you say YES 😭",
];

// After this message appears, hide the NO button.
const LAST_MESSAGE_HIDE_NO_INDEX = MESSAGES.length - 1;

const SUB_HINTS = [
  "Think carefully... 😏",
  "Interesting offer, right? 😉",
  "Getting better and better 🎉",
  "You won't regret it 😌",
  "Say yes already! 🥰",
  "I meant every word 💖",
  "Still running? 😂",
  "Adventure awaits us! 🗺️",
  "I'm serious though 😇",
  "Best offer you'll ever get 💅",
  "Still no? Bold move 😅",
  "The button is getting tired 😤",
  "My heart is on the line here 💔➡️💖",
  "Just one little yes... 🥺",
  "Is this seat taken? (In your heart) 😏",
  "Last rational offer, I promise 😂",
  "OK I'm running out of ideas 😭",
  "Fine. We'll be here all night 🌙",
];

/* ============================================================
   2. STATE VARIABLES
   ============================================================ */
let noClickCount   = 0;   // how many times "No" was attempted
let musicPlaying   = false;
let audioCtx       = null; // Web Audio API context for click sounds
let noBtn, yesBtn, questionEl, subHintEl, counterHintEl;

/* ============================================================
   3. DOM READY
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Cache elements
  noBtn          = document.getElementById("no-btn");
  yesBtn         = document.getElementById("yes-btn");
  questionEl     = document.getElementById("question");
  subHintEl      = document.getElementById("sub-hint");
  counterHintEl  = document.getElementById("counter-hint");

  // Boot sequence
  spawnBackgroundHearts();
  initCursor();
  initLoadingScreen();
  initMusicButton();

  // Hover on No button also moves it (desktop trap)
  noBtn.addEventListener("mouseenter", () => {
    if (noClickCount > 0) moveNoButton(); // only dodge after first click
  });
  noBtn.addEventListener("touchstart", handleNo, { passive: false });
});

/* ============================================================
   4. LOADING SCREEN (hide after 2.2 s)
   ============================================================ */
function initLoadingScreen() {
  const loader = document.getElementById("loading-screen");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 2200);
}

/* ============================================================
   5. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const cursor = document.getElementById("cursor");
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX - 12 + "px";
    cursor.style.top  = e.clientY - 12 + "px";
  });
  document.addEventListener("mousedown", () => {
    cursor.style.transform = "scale(1.6)";
  });
  document.addEventListener("mouseup", () => {
    cursor.style.transform = "scale(1)";
  });
}

/* ============================================================
   6. BACKGROUND FLOATING HEARTS
   ============================================================ */
function spawnBackgroundHearts() {
  const container = document.getElementById("bg-hearts");
  const heartChars = ["❤️","💕","💗","💖","💓","💞","🌹","✨"];

  function makeHeart() {
    const el = document.createElement("span");
    el.classList.add("bg-heart");
    el.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
    el.style.left     = Math.random() * 100 + "vw";
    el.style.fontSize = (1 + Math.random() * 1.5) + "rem";
    const dur  = 7 + Math.random() * 10;
    const delay= Math.random() * 8;
    el.style.animationDuration = dur + "s";
    el.style.animationDelay    = delay + "s";
    container.appendChild(el);
    // Remove after animation to avoid DOM bloat
    setTimeout(() => el.remove(), (dur + delay) * 1000 + 200);
  }

  // Initial batch
  for (let i = 0; i < 18; i++) makeHeart();
  // Keep spawning
  setInterval(makeHeart, 900);
}

/* ============================================================
   7. MUSIC TOGGLE
   ============================================================ */
function initMusicButton() {
  const btn   = document.getElementById("music-btn");
  const audio = document.getElementById("bg-music");

  btn.addEventListener("click", () => {
    if (musicPlaying) {
      audio.pause();
      btn.textContent = "🎵";
      btn.classList.remove("playing");
    } else {
      audio.play().catch(() => {
        // Autoplay blocked — user must interact first (they just did)
      });
      btn.textContent = "🔇";
      btn.classList.add("playing");
    }
    musicPlaying = !musicPlaying;
  });
}

/* ============================================================
   8. WEB AUDIO — CLICK SOUND EFFECT
      Generates a tiny cute "ping" without needing an audio file.
   ============================================================ */
function playClickSound(type = "ping") {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "ping") {
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === "chime") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1047, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    }
  } catch (_) {}
}

/* ============================================================
   9. "NO" BUTTON HANDLER
      - Updates question text from MESSAGES array
      - Moves button to a random screen position
   ============================================================ */
function handleNo(e) {
  if (e) e.preventDefault();

  playClickSound("ping");

  // ---- Update the question text (cycle one-by-one) ----
  const currentIndex = noClickCount;
  const msgText = MESSAGES[Math.min(currentIndex, LAST_MESSAGE_HIDE_NO_INDEX)];
  updateQuestionText(msgText);

  // Update sub hint (also cycle one-by-one)
  const hintText = SUB_HINTS[currentIndex % SUB_HINTS.length];
  subHintEl.textContent = hintText;

  // Update counter hint
  counterHintEl.textContent =
    currentIndex === 0
      ? "Nice try... 😏"
      : `You've said no ${currentIndex + 1} times 😢`;

  noClickCount++;

  // Keep NO button fixed in one place (no movement)
  noBtn.classList.remove("is-moving");
  noBtn.style.left = "";
  noBtn.style.top  = "";

  // Hide NO button after the last message is shown
  if (currentIndex >= LAST_MESSAGE_HIDE_NO_INDEX) {
    noBtn.style.display = "none";
    // also disable it so no click happens
    noBtn.disabled = true;
  }

}

/* ============================================================
   Fix: Keep the "No" button inside the viewport on every click.

   Problem observed: after multiple clicks, the button sometimes ends
   up partially/off-screen.

   Solution: try a few candidate positions after measuring the button,
   and clamp final coordinates so it always stays within bounds.
   ============================================================ */
const MAX_ATTEMPTS = 8;

function moveNoButton() {
  const btn = noBtn;
  const margin = 16;

  // Ensure fixed positioning first so width/height are measurable.
  btn.classList.add("is-moving");

  // Re-measure after it becomes fixed.
  const btnW = btn.offsetWidth  || 130;
  const btnH = btn.offsetHeight ||  50;

  // viewport-safe bounds
  const minX = margin;
  const minY = margin;

  // Use window.innerWidth/innerHeight but clamp hard anyway.
  const maxX = Math.max(minX, window.innerWidth  - btnW - margin);
  const maxY = Math.max(minY, window.innerHeight - btnH - margin);

  // Choose inside bounds directly (no drift)
  const finalX = minX + Math.random() * (maxX - minX);
  const finalY = minY + Math.random() * (maxY - minY);

  btn.style.left = finalX + "px";
  btn.style.top  = finalY + "px";

  // Final guarantee: clamp whatever is set (in case of subpixel rounding)
  const clampedX = Math.max(minX, Math.min(finalX, maxX));
  const clampedY = Math.max(minY, Math.min(finalY, maxY));
  btn.style.left = clampedX + "px";
  btn.style.top  = clampedY + "px";

  // Little wiggle animation
  btn.style.animation = "shakeNo 0.4s ease";
  setTimeout(() => { btn.style.animation = ""; }, 400);
}

// Keep button within bounds even if the viewport size changes while moving
window.addEventListener("resize", () => {
  if (noBtn && noBtn.classList.contains("is-moving")) {
    const margin = 16;
    const btnW = noBtn.offsetWidth  || 130;
    const btnH = noBtn.offsetHeight ||  50;
    const left = Math.max(margin, Math.min(parseFloat(noBtn.style.left) || margin, window.innerWidth - btnW - margin));
    const top  = Math.max(margin, Math.min(parseFloat(noBtn.style.top)  || margin, window.innerHeight - btnH - margin));
    noBtn.style.left = left + "px";
    noBtn.style.top  = top  + "px";
  }
});

/* ============================================================
   11. UPDATE QUESTION TEXT WITH POP ANIMATION
   ============================================================ */
function updateQuestionText(newText) {
  const el = document.getElementById("question") || questionEl;
  if (!el) return;

  el.classList.remove("pop");
  // Force reflow so the class removal is registered
  void el.offsetWidth;
  el.textContent = newText;
  el.classList.add("pop");
}

/* ============================================================
   12. "YES" BUTTON HANDLER
   ============================================================ */
function handleYes() {
  playClickSound("chime");

  // Notify Flask backend (optional — logs the Yes on server)
  fetch("/api/yes", { method: "POST" })
    .then(r => r.json())
    .then(data => console.log("Server says:", data.message))
    .catch(() => {});

  // Show celebration screen
  showCelebration();
}

/* ============================================================
   13. CELEBRATION SCREEN
   ============================================================ */
function showCelebration() {
  const screen = document.getElementById("success-screen");
  screen.classList.remove("hidden");

  // Start confetti
  startConfetti();

  // Burst hearts from card centre
  spawnBurstHearts();

  // Auto-play music on Yes
  const audio = document.getElementById("bg-music");
  if (!musicPlaying) {
    audio.play().catch(() => {});
    document.getElementById("music-btn").textContent = "🔇";
    document.getElementById("music-btn").classList.add("playing");
    musicPlaying = true;
  }
}

/* ============================================================
   14. RESET / START OVER
   ============================================================ */
function resetPage() {
  noClickCount = 0;

  // Reset question text
  questionEl.textContent = "Will You Love Me? ❤️";
  subHintEl.textContent  = "Think carefully... 😏";
  counterHintEl.textContent = "";

  // Reset No button position
  noBtn.classList.remove("is-moving");
  noBtn.style.left = "";
  noBtn.style.top  = "";

  // Hide success screen
  document.getElementById("success-screen").classList.add("hidden");

  // Stop confetti
  stopConfetti();
}

/* ============================================================
   15. CONFETTI ENGINE
   ============================================================ */
let confettiAnimId = null;
const CONFETTI_COLORS = ["#e8436a","#c02055","#ffd6e0","#d9a5c8","#7b2d5e","#ff9eb5","#fff"];

function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx    = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  for (let i = 0; i < 160; i++) {
    pieces.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height - canvas.height,
      r:    3 + Math.random() * 7,
      d:    1 + Math.random() * 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      tilt: Math.random() * 10 - 5,
      tiltDir: Math.random() < 0.5 ? 1 : -1,
      shape: Math.random() < 0.5 ? "circle" : "rect",
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.shape === "circle") {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      } else {
        ctx.rect(p.x, p.y, p.r * 2, p.r * 0.8);
      }
      ctx.fill();

      // Update position
      p.y   += p.d;
      p.x   += Math.sin(p.tilt) * 1.2;
      p.tilt += 0.05 * p.tiltDir;

      // Reset when off screen
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
    confettiAnimId = requestAnimationFrame(draw);
  }
  draw();

  // Resize
  window.addEventListener("resize", () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function stopConfetti() {
  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  const canvas = document.getElementById("confetti-canvas");
  const ctx    = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ============================================================
   16. BURST HEARTS (celebration card)
   ============================================================ */
function spawnBurstHearts() {
  const container = document.querySelector(".heart-burst");
  container.innerHTML = "";
  const chars = ["❤️","💕","💗","💖","✨","🌹","💞"];

  for (let i = 0; i < 22; i++) {
    const el = document.createElement("span");
    el.classList.add("burst-heart");
    el.textContent = chars[Math.floor(Math.random() * chars.length)];

    // Random angle burst
    const angle = Math.random() * 360;
    const dist  = 80 + Math.random() * 160;
    const tx    = Math.cos(angle * Math.PI / 180) * dist + "px";
    const ty    = Math.sin(angle * Math.PI / 180) * dist + "px";
    el.style.setProperty("--tx", tx);
    el.style.setProperty("--ty", ty);

    el.style.left = "50%";
    el.style.top  = "30%";
    el.style.animationDelay = (Math.random() * 0.4) + "s";
    el.style.fontSize = (0.8 + Math.random()) + "rem";

    container.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }
}