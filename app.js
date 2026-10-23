(() => {
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "hydroflow-v1-data";
  let selectedAmount = 250;
  let toastTimer;
  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const defaultState = () => ({ date: todayKey(), consumed: 0, goal: 2000, customAmount: 250, entries: [] });
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== "object") return defaultState();
      const state = { ...defaultState(), ...saved, entries: Array.isArray(saved.entries) ? saved.entries : [] };
      if (state.date !== todayKey()) return { ...state, date: todayKey(), consumed: 0, entries: [] };
      return state;
    } catch { return defaultState(); }
  }
  let state = loadState();
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }
  function format(n) { return Math.round(n).toLocaleString("hu-HU"); }
  function showToast(message) {
    $("toast").textContent = message;
    $("toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2300);
  }
  function render() {
    const percent = Math.min(100, Math.round(state.consumed / Math.max(1,state.goal) * 100));
    $("consumed").textContent = format(state.consumed);
    $("progressFill").style.width = percent + "%";
    $("progressText").textContent = percent + "% teljesítve";
    $("goalText").textContent = "Cél: " + format(state.goal) + " ml";
    $("remaining").textContent = format(Math.max(0, state.goal - state.consumed));
    $("glassCount").textContent = state.entries.length;
    $("waterLevel").style.height = (25 + percent * .55) + "%";
    $("historyList").replaceChildren();
    if (!state.entries.length) {
      const li = document.createElement("li");
      li.className = "empty-state";
      li.textContent = "Még nincs bejegyzés. Kezdj egy korttyal! 💧";
      $("historyList").append(li);
    } else {
      [...state.entries].reverse().slice(0,12).forEach(entry => {
        const li = document.createElement("li");
        const left = document.createElement("span"); left.className = "entry-left";
        const drop = document.createElement("span"); drop.className = "entry-drop"; drop.textContent = "💧";
        const desc = document.createElement("span"); desc.textContent = "Víz hozzáadva";
        const time = document.createElement("small"); time.className = "entry-time"; time.textContent = entry.time;
        desc.append(time); left.append(drop, desc);
        const amount = document.createElement("span"); amount.className = "entry-amount"; amount.textContent = "+" + format(entry.amount) + " ml";
        li.append(left, amount); $("historyList").append(li);
      });
    }
    $("todayLabel").textContent = new Date().toLocaleDateString("hu-HU",{weekday:"long",month:"long",day:"numeric"}).toUpperCase();
    $("streakLabel").textContent = percent >= 100 ? "Szép munka — elérted a beállított célt!" : "Minden korty számít";
    $("goalInput").value = state.goal;
    $("customAmount").value = state.customAmount;
  }
  function addWater(amount) {
    if (!Number.isFinite(amount) || amount < 1) return;
    state.consumed += amount;
    state.entries.push({ amount, time: new Date().toLocaleTimeString("hu-HU",{hour:"2-digit",minute:"2-digit"}) });
    save(); render();
    showToast("+" + format(amount) + " ml hozzáadva. Szép munka! 💧");
  }
  document.querySelectorAll(".amount-button").forEach(btn => btn.addEventListener("click", () => {
    selectedAmount = Number(btn.dataset.amount);
    document.querySelectorAll(".amount-button").forEach(b => b.classList.toggle("selected", b === btn));
  }));
  $("addWater").addEventListener("click", () => addWater(selectedAmount));
  $("settingsToggle").addEventListener("click", openSettings);
  $("closeSettings").addEventListener("click", closeSettings);
  $("settingsPanel").addEventListener("click", e => { if (e.target === $("settingsPanel")) closeSettings(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSettings(); });
  function openSettings() { $("settingsPanel").classList.add("open"); $("settingsPanel").setAttribute("aria-hidden","false"); $("goalInput").focus(); }
  function closeSettings() { $("settingsPanel").classList.remove("open"); $("settingsPanel").setAttribute("aria-hidden","true"); }
  $("saveSettings").addEventListener("click", () => {
    const goal = Number($("goalInput").value);
    const custom = Number($("customAmount").value);
    if (!Number.isFinite(goal) || goal < 250 || goal > 10000 || !Number.isFinite(custom) || custom < 25 || custom > 2000) {
      showToast("Ellenőrizd az értékeket!"); return;
    }
    state.goal = Math.round(goal); state.customAmount = Math.round(custom); selectedAmount = state.customAmount;
    document.querySelectorAll(".amount-button").forEach(b => b.classList.remove("selected"));
    save(); render(); closeSettings(); showToast("Beállítások elmentve 🍃");
  });
  $("resetDay").addEventListener("click", () => {
    if (!confirm("Biztosan törlöd a mai napló bejegyzéseit?")) return;
    state.consumed = 0; state.entries = []; save(); render(); showToast("A mai napló törölve.");
  });
  $("clearAll").addEventListener("click", () => {
    if (!confirm("Biztosan törlöd az összes Hydroflow-adatot erről az eszközről?")) return;
    state = defaultState(); save(); render(); closeSettings(); showToast("Az adatok törölve.");
  });
  $("exportData").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "hydroflow-data.json"; a.click(); URL.revokeObjectURL(url);
    showToast("Az exportálás elindult.");
  });
  $("year").textContent = new Date().getFullYear();
  render();
})();