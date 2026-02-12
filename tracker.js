const DATA_KEY = "HACK_TIME_DATA";
const WEEK_KEY = "HACK_WEEK_NUM";
let startTime = Date.now();
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Function to get Current Week Number
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function checkAndResetNewWeek() {
  const currentWeek = getWeekNumber(new Date());
  const savedWeek = localStorage.getItem(WEEK_KEY);

  if (savedWeek && savedWeek != currentWeek) {
    // Naya hafta shuru ho gaya! Reset data.
    localStorage.setItem(DATA_KEY, JSON.stringify(new Array(7).fill(0)));
    console.log("New week detected. Data reset!");
  }
  localStorage.setItem(WEEK_KEY, currentWeek);
}

function getDB() {
  checkAndResetNewWeek();
  return JSON.parse(localStorage.getItem(DATA_KEY)) || new Array(7).fill(0);
}

function format(mins) {
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return `${h} hr ${m} min`;
}

function refreshUI() {
  const data = getDB();
  const today = new Date().getDay();
  const sessionMins = (Date.now() - startTime) / 60000;
  const currentToday = data[today] + sessionMins;

  document.getElementById("todayDisplay").innerText = format(currentToday);
  const total = data.reduce((a, b) => a + b, 0) + sessionMins;
  document.getElementById("weekDisplay").innerText = format(total);
  document.getElementById("avgDisplay").innerText = format(total / 7);

  const chart = document.getElementById("chart");
  chart.innerHTML = "";
  const maxScale = Math.max(...data, currentToday, 60);

  data.forEach((val, i) => {
    const finalVal = i === today ? currentToday : val;
    const bar = document.createElement("div");
    bar.className = "bar" + (i === today ? " active" : "");
    bar.style.height = Math.max((finalVal / maxScale) * 120, 5) + "px";
    chart.appendChild(bar);
  });

  const body = document.getElementById("scheduleBody");
  body.innerHTML = "";
  data.forEach((val, i) => {
    const displayVal = i === today ? currentToday : val;
    body.innerHTML += `<tr><td>${dayNames[i]}</td><td>${format(displayVal)}</td></tr>`;
  });
}

function toggleSchedule() {
  const s = document.getElementById("scheduleSection");
  s.style.display = s.style.display === "block" ? "none" : "block";
}

function manualReset() {
  if (confirm("Are you sure you want to delete all data?")) {
    localStorage.clear();
    location.reload();
  }
}

// Auto-save data
setInterval(() => {
  const data = getDB();
  const today = new Date().getDay();
  data[today] += (Date.now() - startTime) / 60000;
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
  startTime = Date.now();
}, 10000);

setInterval(refreshUI, 1000);
refreshUI();
