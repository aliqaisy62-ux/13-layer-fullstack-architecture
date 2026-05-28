const STORAGE_KEYS = {
  theme: "lms-theme",
  activeChallenge: "lms-active-challenge",
  completed: "lms-completed",
  selectedDecision: "lms-selected-decision",
  codePrefix: "lms-code-"
};

const state = {
  theme: localStorage.getItem(STORAGE_KEYS.theme) || "dark",
  activeChallengeId: localStorage.getItem(STORAGE_KEYS.activeChallenge) || codingChallenges[0]?.id,
  completed: loadJSON(STORAGE_KEYS.completed, []),
  selectedDecision: loadJSON(STORAGE_KEYS.selectedDecision, {})
};

const refs = {};
let consoleHistory = [];
let syncScrollLock = false;

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getChallengeById(id) {
  return codingChallenges.find((challenge) => challenge.id === id) || codingChallenges[0];
}

function getLayerById(id) {
  return LAYERS.find((layer) => layer.id === id) || LAYERS[0];
}

function challengeForLayer(layerId) {
  return codingChallenges.find((challenge) => challenge.linkedLayer === layerId) || codingChallenges[0];
}

function normalizeText(value) {
  return String(value).trim();
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeStringify(value) {
  try {
    if (typeof value === "string") return value;
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => deepEqual(item, b[index]));
  }
  if (a && b && typeof a === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    return aKeys.length === bKeys.length && aKeys.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
}

function formatResult(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value) || (value && typeof value === "object")) return safeStringify(value);
  return String(value);
}

function pushConsole(message, tone = "info") {
  consoleHistory.push({ message, tone });
  if (consoleHistory.length > 80) consoleHistory.shift();
  renderConsole();
}

function renderConsole() {
  refs.consoleOutput.innerHTML = consoleHistory
    .map(({ message, tone }) => `<div class="console-line ${tone}">${escapeHtml(message)}</div>`)
    .join("");
  refs.consoleOutput.scrollTop = refs.consoleOutput.scrollHeight;
}

function clearConsole() {
  consoleHistory = [];
  renderConsole();
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function toggleTheme() {
  setTheme(state.theme === "dark" ? "light" : "dark");
}

function getCodeForChallenge(id) {
  return localStorage.getItem(`${STORAGE_KEYS.codePrefix}${id}`) || getChallengeById(id).starterCode;
}

function setCodeForChallenge(id, code) {
  localStorage.setItem(`${STORAGE_KEYS.codePrefix}${id}`, code);
}

function isCompleted(id) {
  return state.completed.includes(id);
}

function markCompleted(id) {
  if (!state.completed.includes(id)) {
    state.completed.push(id);
    saveJSON(STORAGE_KEYS.completed, state.completed);
  }
}

function setSelectedDecision(challengeId, value) {
  state.selectedDecision[challengeId] = value;
  saveJSON(STORAGE_KEYS.selectedDecision, state.selectedDecision);
}

function getSelectedDecision(challengeId) {
  return state.selectedDecision[challengeId] || "";
}

function renderLayerList() {
  refs.layerList.innerHTML = LAYERS.map((layer) => {
    const challenge = challengeForLayer(layer.id);
    const done = isCompleted(challenge.id);
    const active = layer.id === getChallengeById(state.activeChallengeId).linkedLayer;
    return `
      <button class="layer-item ${active ? "active" : ""} ${done ? "done" : ""}" data-layer="${layer.id}">
        <span class="layer-index">0${layer.id}</span>
        <span class="layer-info">
          <strong>${escapeHtml(layer.title)}</strong>
          <small>${escapeHtml(layer.badge)}</small>
        </span>
        <span class="layer-status">${done ? "Completed" : "Open"}</span>
      </button>
    `;
  }).join("");

  refs.layerList.querySelectorAll("[data-layer]").forEach((button) => {
    button.addEventListener("click", () => selectLayer(Number(button.dataset.layer)));
  });
}

function renderCheckpointGrid() {
  refs.checkpointGrid.innerHTML = LAYERS.map((layer) => {
    const challenge = challengeForLayer(layer.id);
    const done = isCompleted(challenge.id);
    return `
      <div class="checkpoint ${done ? "done" : ""}">
        <span>Layer ${layer.id}</span>
        <strong>${escapeHtml(layer.title)}</strong>
        <small>${done ? "Completed" : "In progress"}</small>
      </div>
    `;
  }).join("");
}

function updateProgress() {
  const doneLayers = new Set(state.completed.map((challengeId) => getChallengeById(challengeId).linkedLayer));
  const percent = Math.round((doneLayers.size / LAYERS.length) * 100);
  refs.completedCount.textContent = `${doneLayers.size} / ${LAYERS.length}`;
  refs.progressText.textContent = `${percent}% complete`;
  refs.progressFill.style.width = `${percent}%`;
}

function renderLayerDetails(layerId) {
  const layer = getLayerById(layerId);
  const challenge = challengeForLayer(layerId);
  refs.layerTitle.textContent = `Layer ${layer.id}`;
  refs.layerBadge.textContent = layer.title;
  refs.layerSummary.textContent = layer.summary;
  refs.layerOutcome.textContent = layer.outcome;
  refs.layerNote.textContent = layer.note;
  refs.layerFocus.innerHTML = layer.focus.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  refs.currentLayerLabel.textContent = `Layer ${layer.id}`;
  refs.challengeTitle.textContent = challenge.title;
  refs.problemStatement.textContent = challenge.problemStatement;
  refs.difficultyPill.textContent = challenge.difficulty;
  refs.typePill.textContent = challenge.challengeType === "decision" ? "Decision" : challenge.challengeType === "debug" ? "Debug" : "Algorithm";
  refs.hintBox.textContent = challenge.hint ? `Hint: ${challenge.hint}` : "Hint: Review the Arabic brief carefully.";
  refs.decisionArea.classList.toggle("hidden", challenge.challengeType !== "decision");
  renderDecisionOptions(challenge);
  loadChallengeCode(challenge);
  setActiveLayerCard(layerId);
  state.activeChallengeId = challenge.id;
  localStorage.setItem(STORAGE_KEYS.activeChallenge, challenge.id);
}

function setActiveLayerCard(layerId) {
  refs.layerList.querySelectorAll(".layer-item").forEach((item) => {
    item.classList.toggle("active", Number(item.dataset.layer) === layerId);
  });
}

function renderDecisionOptions(challenge) {
  if (challenge.challengeType !== "decision") {
    refs.decisionOptions.innerHTML = "";
    return;
  }
  const savedChoice = getSelectedDecision(challenge.id);
  refs.decisionOptions.innerHTML = challenge.options.map((option) => {
    const selected = savedChoice === option ? "selected" : "";
    return `<button class="choice-btn ${selected}" data-choice="${escapeHtml(option)}" type="button">${escapeHtml(option)}</button>`;
  }).join("");
  refs.decisionOptions.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      refs.decisionOptions.querySelectorAll(".choice-btn").forEach((choice) => choice.classList.remove("selected"));
      button.classList.add("selected");
      setSelectedDecision(challenge.id, button.dataset.choice);
    });
  });
}

function loadChallengeCode(challenge) {
  const code = getCodeForChallenge(challenge.id);
  refs.codeEditor.value = code;
  updateSyntaxHighlight();
}

function loadCurrentChallengeCode() {
  const challenge = getChallengeById(state.activeChallengeId);
  loadChallengeCode(challenge);
}

function renderHighlightedCode(code) {
  const escaped = escapeHtml(code);
  return escaped
    .replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, '<span class="token string">$1</span>')
    .replace(/(\/\/.*?$)/gm, '<span class="token comment">$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|switch|case|break|new|class|async|await|try|catch|throw|typeof|typeof|true|false|null|undefined)\b/g, '<span class="token keyword">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="token number">$1</span>');
}

function updateSyntaxHighlight() {
  refs.syntaxLayer.innerHTML = renderHighlightedCode(refs.codeEditor.value || "");
  refs.syntaxLayer.scrollTop = refs.codeEditor.scrollTop;
  refs.syntaxLayer.scrollLeft = refs.codeEditor.scrollLeft;
}

function logReport(title, lines, tone = "info") {
  pushConsole(title, tone);
  lines.forEach((line) => pushConsole(line, tone));
}

function createWorker() {
  const workerSource = `
    function serialize(value) {
      if (typeof value === 'string') return value;
      try { return JSON.stringify(value); } catch { return String(value); }
    }

    self.onmessage = async (event) => {
      const { code, input } = event.data;
      const logs = [];
      const consoleProxy = {
        log: (...args) => logs.push(args.map(serialize).join(' ')),
        error: (...args) => logs.push('[error] ' + args.map(serialize).join(' '))
      };

      const guardedPrelude = [
        'const fetch = undefined;',
        'const XMLHttpRequest = undefined;',
        'const WebSocket = undefined;',
        'const importScripts = undefined;',
        'const postMessage = undefined;',
        'const navigator = undefined;'
      ].join('\\n');

      try {
        const runner = new Function('input', 'console', guardedPrelude + '\\n' + code + '\\n' +
          'if (typeof solve === "function") return solve(input);\\n' +
          'if (typeof main === "function") return main(input);\\n' +
          'if (typeof run === "function") return run(input);\\n' +
          'return typeof answer !== "undefined" ? answer : undefined;');

        const result = runner(input, consoleProxy);
        const resolved = result && typeof result.then === 'function' ? await result : result;
        self.postMessage({ ok: true, result: resolved, logs });
      } catch (error) {
        self.postMessage({
          ok: false,
          error: error && error.message ? error.message : String(error),
          logs
        });
      }
    };
  `;

  const blob = new Blob([workerSource], { type: "text/javascript" });
  return new Worker(URL.createObjectURL(blob));
}

async function runAlgorithmChallenge(challenge) {
  clearConsole();
  pushConsole(`Running ${challenge.title}...`, "info");
  const code = refs.codeEditor.value;
  setCodeForChallenge(challenge.id, code);

  const worker = createWorker();

  try {
    for (let index = 0; index < challenge.testCases.length; index += 1) {
      const testCase = challenge.testCases[index];
      const outcome = await new Promise((resolve) => {
        worker.onmessage = (event) => resolve(event.data);
        worker.postMessage({ code, input: testCase.input });
      });

      if (!outcome.ok) {
        pushConsole(`Test ${index + 1}: FAIL`, "error");
        pushConsole(`Error: ${outcome.error}`, "error");
        if (outcome.logs?.length) {
          outcome.logs.forEach((line) => pushConsole(`console: ${line}`, "warn"));
        }
        worker.terminate();
        return false;
      }

      const passed = deepEqual(outcome.result, testCase.expected);
      pushConsole(`Test ${index + 1}: ${passed ? "PASS" : "FAIL"}`, passed ? "success" : "error");
      pushConsole(`Expected: ${formatResult(testCase.expected)}`, "info");
      pushConsole(`Received: ${formatResult(outcome.result)}`, passed ? "success" : "error");
      if (outcome.logs?.length) {
        outcome.logs.forEach((line) => pushConsole(`console: ${line}`, "warn"));
      }

      if (!passed) {
        worker.terminate();
        return false;
      }
    }

    worker.terminate();
    pushConsole("All tests passed. Challenge completed!", "success");
    markCompleted(challenge.id);
    updateProgress();
    renderLayerList();
    renderCheckpointGrid();
    return true;
  } catch (error) {
    worker.terminate();
    pushConsole(`Runner error: ${error.message || error}`, "error");
    return false;
  }
}

function runDecisionChallenge(challenge) {
  clearConsole();
  const selected = getSelectedDecision(challenge.id);
  if (!selected) {
    pushConsole("Choose an answer before submitting.", "warn");
    return false;
  }

  pushConsole(`Selected: ${selected}`, "info");
  pushConsole(`Correct: ${challenge.correctAnswer}`, "info");

  const passed = normalizeText(selected) === normalizeText(challenge.correctAnswer);
  pushConsole(passed ? "Answer accepted. Challenge completed!" : "Answer not correct yet.", passed ? "success" : "error");
  if (passed) {
    markCompleted(challenge.id);
    updateProgress();
    renderLayerList();
    renderCheckpointGrid();
  }
  return passed;
}

function selectLayer(layerId) {
  renderLayerDetails(layerId);
  renderLayerList();
}

function selectActiveChallenge(challengeId) {
  const challenge = getChallengeById(challengeId);
  selectLayer(challenge.linkedLayer);
  state.activeChallengeId = challengeId;
  localStorage.setItem(STORAGE_KEYS.activeChallenge, challengeId);
  renderLayerList();
}

function loadStarterCode() {
  const challenge = getChallengeById(state.activeChallengeId);
  refs.codeEditor.value = challenge.starterCode;
  updateSyntaxHighlight();
  setCodeForChallenge(challenge.id, challenge.starterCode);
}

function resetCurrentCode() {
  loadStarterCode();
  pushConsole("Code reset to starter template.", "warn");
}

function initializeRefs() {
  refs.completedCount = document.getElementById("completed-count");
  refs.currentLayerLabel = document.getElementById("current-layer-label");
  refs.progressText = document.getElementById("progress-text");
  refs.progressFill = document.getElementById("progress-fill");
  refs.layerList = document.getElementById("layer-list");
  refs.layerTitle = document.getElementById("layer-title");
  refs.layerBadge = document.getElementById("layer-badge");
  refs.layerSummary = document.getElementById("layer-summary");
  refs.layerOutcome = document.getElementById("layer-outcome");
  refs.layerNote = document.getElementById("layer-note");
  refs.layerFocus = document.getElementById("layer-focus");
  refs.checkpointGrid = document.getElementById("checkpoint-grid");
  refs.challengeTitle = document.getElementById("challenge-title");
  refs.problemStatement = document.getElementById("problem-statement");
  refs.difficultyPill = document.getElementById("difficulty-pill");
  refs.typePill = document.getElementById("type-pill");
  refs.hintBox = document.getElementById("hint-box");
  refs.decisionArea = document.getElementById("decision-area");
  refs.decisionOptions = document.getElementById("decision-options");
  refs.codeEditor = document.getElementById("code-editor");
  refs.syntaxLayer = document.getElementById("syntax-layer");
  refs.consoleOutput = document.getElementById("console-output");
  refs.themeToggle = document.getElementById("theme-toggle");
}

function bindEvents() {
  refs.themeToggle.addEventListener("click", toggleTheme);
  document.getElementById("run-code").addEventListener("click", async () => {
    const challenge = getChallengeById(state.activeChallengeId);
    if (challenge.challengeType === "decision") {
      runDecisionChallenge(challenge);
    } else {
      await runAlgorithmChallenge(challenge);
    }
  });
  document.getElementById("clear-console").addEventListener("click", clearConsole);
  document.getElementById("load-starter").addEventListener("click", loadStarterCode);
  document.getElementById("reset-code").addEventListener("click", resetCurrentCode);
  document.getElementById("submit-decision").addEventListener("click", () => {
    const challenge = getChallengeById(state.activeChallengeId);
    runDecisionChallenge(challenge);
  });

  refs.codeEditor.addEventListener("input", () => {
    const challenge = getChallengeById(state.activeChallengeId);
    setCodeForChallenge(challenge.id, refs.codeEditor.value);
    updateSyntaxHighlight();
  });

  refs.codeEditor.addEventListener("scroll", () => {
    if (syncScrollLock) return;
    syncScrollLock = true;
    refs.syntaxLayer.scrollTop = refs.codeEditor.scrollTop;
    refs.syntaxLayer.scrollLeft = refs.codeEditor.scrollLeft;
    syncScrollLock = false;
  });

  refs.decisionOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-choice]");
    if (!button) return;
    const choice = button.dataset.choice;
    const challenge = getChallengeById(state.activeChallengeId);
    setSelectedDecision(challenge.id, choice);
    refs.decisionOptions.querySelectorAll(".choice-btn").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
  });
}

function boot() {
  initializeRefs();
  document.documentElement.dataset.theme = state.theme;
  renderLayerList();
  renderCheckpointGrid();
  updateProgress();
  const challenge = getChallengeById(state.activeChallengeId);
  selectLayer(challenge.linkedLayer);
  if (isCompleted(challenge.id)) {
    pushConsole("This challenge is already marked as completed. You can rerun it anytime.", "success");
  } else {
    pushConsole("Welcome to the LMS. Pick a layer, read the Arabic brief, then run the matching challenge.", "info");
  }
  bindEvents();
  setTheme(state.theme);
  loadCurrentChallengeCode();
  renderConsole();
}

window.addEventListener("DOMContentLoaded", boot);
