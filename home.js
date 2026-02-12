/* ==========================================================
   HOME.JS - FINAL CLEAN WORKING VERSION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================
     1️⃣ USER DATA SYNC
  ========================================================== */

  const syncUserData = () => {
    const savedAvatar = localStorage.getItem("userAvatar");
    const savedName = localStorage.getItem("userName");

    const homeImg = document.getElementById("homeAvatar");
    const nameEl = document.getElementById("homeUserName");

    if (savedAvatar && homeImg) homeImg.src = savedAvatar;
    if (savedName && nameEl) nameEl.innerText = savedName;
  };

  syncUserData();

  /* ==========================================================
     2️⃣ SIDEBAR ACTIVE LINK
  ========================================================== */

  const links = document.querySelectorAll(".nav-links a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  /* ==========================================================
     3️⃣ TODO LIST
  ========================================================== */

  const input = document.getElementById("task-input");
  const btn = document.getElementById("add-btn");
  const list = document.getElementById("task-list");

  const addTask = () => {
    const val = input.value.trim();
    if (!val) return alert("Please enter a task!");

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${val}</span>
      <div class="actions">
        <button class="done-btn">
          <i class="fa-solid fa-circle-check"></i>
        </button>
        <button class="remove-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    list.appendChild(li);
    input.value = "";
  };

  if (btn) btn.onclick = addTask;

  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTask();
    });
  }

  list.addEventListener("click", (e) => {
    const clicked = e.target.closest("button");
    if (!clicked) return;

    const li = clicked.closest("li");

    if (clicked.classList.contains("done-btn")) {
      li.classList.toggle("done");
    }

    if (clicked.classList.contains("remove-btn")) {
      li.style.opacity = "0";
      setTimeout(() => li.remove(), 200);
    }
  });

  /* ==========================================================
     4️⃣ FOCUS TIMER
  ========================================================== */

  const focusInput = document.getElementById("focusInput");
  const shortInput = document.getElementById("shortInput");
  const longInput = document.getElementById("longInput");
  const minuteInput = document.getElementById("minuteInput");
  const applyBtn = document.getElementById("applyTime");

  const timeEl = document.getElementById("time");
  const circle = document.getElementById("progressCircle");
  const sessionEl = document.getElementById("session");
  const playBtn = document.getElementById("playBtn");
  const tabs = document.querySelectorAll(".tab");

  const alarm = new Audio(
    "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav",
  );

  let currentMode = "focus";
  let sessionCount = 1;
  let timer = null;
  let running = false;

  let totalTime = focusInput.value * 60;
  let timeLeft = totalTime;

  /* ---------- UPDATE DISPLAY ---------- */

  function updateDisplay() {
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;

    timeEl.textContent = `${min}:${sec.toString().padStart(2, "0")}`;

    let progress = ((totalTime - timeLeft) / totalTime) * 360;

    if (currentMode === "focus") {
      circle.style.background = `conic-gradient(#ff7626 ${progress}deg, #fcefe8 0deg)`;
    } else {
      circle.style.background = `conic-gradient(#22c55e ${progress}deg, #e6f9ef 0deg)`;
    }
  }

  /* ---------- ACTIVATE TAB UI ---------- */

  function activateTab(mode) {
    tabs.forEach((t) => t.classList.remove("active"));
    document.querySelector(`.tab[data-type="${mode}"]`).classList.add("active");
  }

  /* ---------- AUTO SWITCH AFTER END ---------- */

  function autoSwitchMode() {
    if (currentMode === "focus") {
      currentMode = "short";
      totalTime = shortInput.value * 60;
      sessionEl.innerText = "Short Break ☕";
    } else {
      currentMode = "focus";
      totalTime = focusInput.value * 60;
      sessionCount++;
      sessionEl.innerText = "Session " + sessionCount;
    }

    timeLeft = totalTime;
    activateTab(currentMode);
    updateDisplay();
    startTimer(); // Auto start next mode
  }

  /* ---------- START TIMER ---------- */

  function startTimer() {
    running = true;
    playBtn.innerText = "⏸ Pause";

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        alarm.play();
        autoSwitchMode();
      }
    }, 1000);
  }

  /* ---------- TOGGLE PLAY ---------- */

  window.toggleTimer = function () {
    if (!running) {
      startTimer();
    } else {
      clearInterval(timer);
      running = false;
      playBtn.innerText = "▶ Resume";
    }
  };

  /* ---------- RESET ---------- */

  window.resetTimer = function () {
    clearInterval(timer);
    running = false;

    currentMode = "focus";
    totalTime = focusInput.value * 60;
    timeLeft = totalTime;

    sessionEl.innerText = "Session " + sessionCount;
    activateTab("focus");
    playBtn.innerText = "▶ Start";

    updateDisplay();
  };

  /* ---------- TAB CLICK ---------- */

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      clearInterval(timer);
      running = false;
      playBtn.innerText = "▶ Start";

      currentMode = tab.dataset.type;

      if (currentMode === "focus") {
        totalTime = focusInput.value * 60;
        sessionEl.innerText = "Session " + sessionCount;
      }

      if (currentMode === "short") {
        totalTime = shortInput.value * 60;
        sessionEl.innerText = "Short Break ☕";
      }

      if (currentMode === "long") {
        totalTime = longInput.value * 60;
        sessionEl.innerText = "Long Break 🌿";
      }

      timeLeft = totalTime;
      activateTab(currentMode);
      updateDisplay();
    });
  });

  /* ---------- CUSTOM MINUTES ---------- */

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const custom = minuteInput.value;
      if (!custom || custom <= 0) return;

      totalTime = custom * 60;
      timeLeft = totalTime;
      updateDisplay();
    });
  }

  /* ---------- INIT ---------- */

  activateTab("focus");
  updateDisplay();
});
