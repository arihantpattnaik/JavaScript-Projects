// ================= STATE =================
const AppState = {
    nextDecisionId: 1,
    decisions: [],
    log: []
  };
  
  // ================= STORAGE =================
  function saveState() {
    localStorage.setItem("DecisionFreeze", JSON.stringify(AppState));
  }
  
  function loadState() {
    const data = localStorage.getItem("DecisionFreeze");
    if (!data) return;
  
    const parsed = JSON.parse(data);
    AppState.nextDecisionId = parsed.nextDecisionId;
    AppState.decisions = parsed.decisions;
    AppState.log = parsed.log;
  }
  
  // ================= DOM =================
  const decisionInput = document.getElementById("decision-title");
  const createDecisionBtn = document.getElementById("create-decision-btn");
  const decisionSelect = document.getElementById("decision-select");
  const optionInput = document.getElementById("option-input");
  const addOptionBtn = document.getElementById("add-option-btn");
  const decisionList = document.getElementById("decision-list");
  const decisionLog = document.getElementById("decision-log");
  
  // ================= LOGIC =================
  function addDecision() {
    const title = decisionInput.value.trim();
    if (!title) return;
  
    AppState.decisions.push({
      id: AppState.nextDecisionId++,
      title,
      options: [],
      locked: false
    });
  
    decisionInput.value = "";
    saveState();
    render();
  }
  
  function addOption() 
  {
    const decisionId = Number(decisionSelect.value);
    const text = optionInput.value.trim();
    if (!decisionId || !text) return;
  
    const decision = AppState.decisions.find(d => d.id === decisionId);
    if (!decision || decision.locked) return;
  
    decision.options.push({ text, score: 0 });
    optionInput.value = "";
    saveState();
    render();
  }
  
  function evaluateOption(decisionId, index, delta) {
    const decision = AppState.decisions.find(d => d.id === decisionId);
    if (!decision || decision.locked) return;
  
    decision.options[index].score += delta;
    saveState();
    render();
  }
  
  function lockDecision(decisionId) {
    const decision = AppState.decisions.find(d => d.id === decisionId);
    if (!decision || decision.locked) return;
  
    decision.locked = true;
  
    const best = decision.options.reduce((a, b) =>
      b.score > a.score ? b : a
    );
  
    AppState.log.push({
      decision: decision.title,
      chosen: best.text,
      score: best.score,
      time: new Date().toLocaleString()
    });
  
    saveState();
    render();
  }
  
  // ================= RENDER =================
  function render() {
    renderSelect();
    renderDecisions();
    renderLog();
  }
  
  function renderSelect() {
    decisionSelect.innerHTML = `<option value="">Select decision</option>`;
    AppState.decisions.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.title;
      decisionSelect.appendChild(opt);
    });
  }
  
  function renderDecisions() {
    decisionList.innerHTML = "";
  
    AppState.decisions.forEach(d => {
      const card = document.createElement("div");
      card.className = "decision-card" + (d.locked ? " locked" : "");
  
      const title = document.createElement("h4");
      title.textContent = d.title;
      card.appendChild(title);
  
      d.options.forEach((o, idx) => {
        const row = document.createElement("div");
        row.className = "option";
  
        row.innerHTML = `
          <span>${o.text} (${o.score})</span>
          <div>
            <button class="small">+</button>
            <button class="small">-</button>
          </div>
        `;
  
        const [plus, minus] = row.querySelectorAll("button");
        plus.onclick = () => evaluateOption(d.id, idx, 1);
        minus.onclick = () => evaluateOption(d.id, idx, -1);
  
        card.appendChild(row);
      });
  
      if (!d.locked) {
        const lockBtn = document.createElement("button");
        lockBtn.textContent = "Lock Decision";
        lockBtn.onclick = () => lockDecision(d.id);
        card.appendChild(lockBtn);
      }
  
      decisionList.appendChild(card);
    });
  }
  
  function renderLog() {
    decisionLog.innerHTML = "";
    AppState.log.forEach(l => {
      const li = document.createElement("li");
      li.textContent = `${l.decision} → ${l.chosen} (${l.score})`;
      decisionLog.appendChild(li);
    });
  }
  
  // ================= EVENTS =================
  createDecisionBtn.addEventListener("click", addDecision);
  addOptionBtn.addEventListener("click", addOption);
  
  // ================= INIT =================
  loadState();
  render();
  