(() => {
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "hydroflow-v1-data";
  let selectedAmount = 250;
  let language = localStorage.getItem("hydroflow-language") || "hu";
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
  function format(n) { return Math.round(n).toLocaleString(language === "en" ? "en-US" : "hu-HU"); }
  const words = {
    hu: {title:"Maradj", flow:"folyásban.", subtitle:"Egy kis korty, egy kis lendület. Kövesd a vízivásodat egyszerűen.", daily:"MA EDDIG", completed:"% teljesítve", goal:"Cél: ", rhythm:"A TE RITMUSOD", log:"Mai napló", additions:"hozzáadás", remaining:"ml a célig", recent:"Legutóbbi kortyok", reset:"Mai nap törlése", empty:"Még nincs bejegyzés. Kezdj egy korttyal! 💧", tip:"Hydro tipp", tipText:"Legyen kéznél a kulacsod, és igyál, amikor megszomjazol.", custom:"Saját mennyiség", add:"Hozzáadás", selected:"Kiválasztott mennyiség hozzáadása", micro:"A saját mennyiségedet ml-ben vagy literben is megadhatod.", settings:"Beállítások", goalLabel:"Napi cél (ml)", customSetting:"Egyéni hozzáadás (ml)", note:"A cél csak egy személyre szabható emlékeztető, nem orvosi tanács. Az igények egyénenként és naponta változnak.", save:"Beállítások mentése", export:"Adatok exportálása (.json)", clear:"Összes adat törlése", foot:"Az adatok ezen az eszközön, a böngésződben tárolódnak.", toastAdded:"hozzáadva. Szép munka! 💧", saved:"Beállítások elmentve 🍃", invalid:"Ellenőrizd az értékeket!", deleted:"A mai napló törölve.", cleared:"Az adatok törölve.", water:"Víz hozzáadva", date:"MAI ÁLLAPOT", slogan:"Minden korty számít", reached:"Szép munka — elérted a beállított célt!"},
    en: {title:"Stay", flow:"in your flow.", subtitle:"A little sip, a little boost. Track your water intake with ease.", daily:"TODAY SO FAR", completed:"% complete", goal:"Goal: ", rhythm:"YOUR DAILY FLOW", log:"Today's log", additions:"entries", remaining:"ml to goal", recent:"Recent sips", reset:"Reset today", empty:"No entries yet. Start with a sip! 💧", tip:"Hydro tip", tipText:"Keep your water bottle nearby and drink whenever you're thirsty.", custom:"Custom amount", add:"Add water", selected:"Add selected amount", micro:"Enter your own amount in millilitres or litres.", settings:"Settings", goalLabel:"Daily goal (ml)", customSetting:"Default custom amount (ml)", note:"Your goal is a personal reminder, not medical advice. Needs vary from person to person and from day to day.", save:"Save settings", export:"Export data (.json)", clear:"Clear all data", foot:"Your data is stored in this browser on this device.", toastAdded:"added. Nice work! 💧", saved:"Settings saved 🍃", invalid:"Please check the values!", deleted:"Today's log was reset.", cleared:"All data cleared.", water:"Water added", date:"TODAY'S STATUS", slogan:"Every sip counts", reached:"Nice work — you've reached your goal!"},
  };
  function t(key) { return words[language][key]; }
  function applyLanguage() {
    document.documentElement.lang = language;
    $("languageSelect").value = language;
    $("quickCustomLabel").textContent = t("custom");
    $("addCustomLabel").textContent = t("add");
    $("addSelectedLabel").textContent = t("selected");
    $("microcopy").textContent = t("micro");
    $("settingsTitle").textContent = t("settings");
    document.querySelector('label[for="goalInput"]').textContent = t("goalLabel");
    document.querySelector('label[for="customAmount"]').textContent = t("customSetting");
    document.querySelector(".setting-note p").textContent = t("note");
    $("saveSettings").textContent = t("save");
    $("exportData").textContent = t("export");
    $("clearAll").textContent = t("clear");
    document.querySelector(".settings-foot").textContent = t("foot");
    document.querySelector(".water-card .card-heading .eyebrow").textContent = t("daily");
    document.querySelector(".side-heading .eyebrow").textContent = t("rhythm");
    document.querySelector(".side-heading h3").textContent = t("log");
    document.querySelectorAll(".stat small")[0].textContent = t("additions");
    document.querySelectorAll(".stat small")[1].textContent = t("remaining");
    document.querySelector(".history-title strong").textContent = t("recent");
    $("resetDay").textContent = t("reset");
    document.querySelector(".tip strong").textContent = t("tip");
    document.querySelector(".tip p").innerHTML = "<strong>" + t("tip") + "</strong><br>" + t("tipText");
    $("settingsToggle").title = t("settings");
    $("settingsToggle").setAttribute("aria-label", t("settings"));
    render();
  }
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
    $("progressText").textContent = percent + t("completed");
    $("goalText").textContent = t("goal") + format(state.goal) + " ml";
    $("remaining").textContent = format(Math.max(0, state.goal - state.consumed));
    $("glassCount").textContent = state.entries.length;
    $("waterLevel").style.height = (25 + percent * .55) + "%";
    $("historyList").replaceChildren();
    if (!state.entries.length) {
      const li = document.createElement("li");
      li.className = "empty-state";
      li.textContent = t("empty");
      $("historyList").append(li);
    } else {
      [...state.entries].reverse().slice(0,12).forEach(entry => {
        const li = document.createElement("li");
        const left = document.createElement("span"); left.className = "entry-left";
        const drop = document.createElement("span"); drop.className = "entry-drop"; drop.textContent = "💧";
        const desc = document.createElement("span"); desc.textContent = t("water");
        const time = document.createElement("small"); time.className = "entry-time"; time.textContent = entry.time;
        desc.append(time); left.append(drop, desc);
        const amount = document.createElement("span"); amount.className = "entry-amount"; amount.textContent = "+" + format(entry.amount) + " ml";
        li.append(left, amount); $("historyList").append(li);
      });
    }
    $("todayLabel").textContent = new Date().toLocaleDateString(language === "en" ? "en-US" : "hu-HU",{weekday:"long",month:"long",day:"numeric"}).toUpperCase();
    $("streakLabel").textContent = percent >= 100 ? t("reached") : t("slogan");
    $("goalInput").value = state.goal;
    $("customAmount").value = state.customAmount;
  }
  function addWater(amount) {
    if (!Number.isFinite(amount) || amount < 1) return;
    state.consumed += amount;
    state.entries.push({ amount, time: new Date().toLocaleTimeString("hu-HU",{hour:"2-digit",minute:"2-digit"}) });
    save(); render();
    showToast("+" + format(amount) + " ml " + t("toastAdded"));
  }
  document.querySelectorAll(".amount-button").forEach(btn => btn.addEventListener("click", () => {
    selectedAmount = Number(btn.dataset.amount);
    document.querySelectorAll(".amount-button").forEach(b => b.classList.toggle("selected", b === btn));
  }));
  $("addWater").addEventListener("click", () => addWater(selectedAmount));
  $("addCustomWater").addEventListener("click", () => {
    const value = Number($("quickCustomAmount").value);
    const unit = $("quickCustomUnit").value;
    if (!Number.isFinite(value) || value <= 0 || value > 10000) { showToast(t("invalid")); return; }
    addWater(Math.round(value * (unit === "l" ? 1000 : 1)));
  });
  $("languageSelect").addEventListener("change", () => {
    language = $("languageSelect").value;
    try { localStorage.setItem("hydroflow-language", language); } catch {}
    applyLanguage();
  });
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
      showToast(t("invalid")); return;
    }
    state.goal = Math.round(goal); state.customAmount = Math.round(custom); selectedAmount = state.customAmount;
    document.querySelectorAll(".amount-button").forEach(b => b.classList.remove("selected"));
    save(); render(); closeSettings(); showToast(t("saved"));
  });
  $("resetDay").addEventListener("click", () => {
    if (!confirm("Biztosan törlöd a mai napló bejegyzéseit?")) return;
    state.consumed = 0; state.entries = []; save(); render(); showToast(t("deleted"));
  });
  $("clearAll").addEventListener("click", () => {
    if (!confirm("Biztosan törlöd az összes Hydroflow-adatot erről az eszközről?")) return;
    state = defaultState(); save(); render(); closeSettings(); showToast(t("cleared"));
  });
  $("exportData").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "hydroflow-data.json"; a.click(); URL.revokeObjectURL(url);
    showToast("Az exportálás elindult.");
  });
  $("year").textContent = new Date().getFullYear();
  applyLanguage();
})();