(() => {
  const MIN = 0;
  const MAX = 100;
  const TOTAL_STATES = MAX - MIN + 1;
  const OPTIMAL_STEPS = Math.ceil(Math.log2(TOTAL_STATES));

  const grid = document.getElementById("number-grid");

  const modeMachineButton = document.getElementById("mode-machine");
  const modeHumanButton = document.getElementById("mode-human");
  const machinePanel = document.getElementById("panel-machine");
  const humanPanel = document.getElementById("panel-human");

  const machineGuessText = document.getElementById("machine-guess");
  const entropyValue = document.getElementById("entropy-value");
  const machineStatus = document.getElementById("machine-status");

  const machineLowButton = document.getElementById("machine-low");
  const machineCorrectButton = document.getElementById("machine-correct");
  const machineHighButton = document.getElementById("machine-high");
  const machineResetButton = document.getElementById("machine-reset");

  const humanForm = document.getElementById("human-form");
  const humanInput = document.getElementById("human-input");
  const humanFeedback = document.getElementById("human-feedback");
  const humanAnalysis = document.getElementById("human-analysis");
  const humanResetButton = document.getElementById("human-reset");

  const gridCells = [];
  let activeMode = "machine";

  const machineState = {
    low: MIN,
    high: MAX,
    guess: null,
    steps: 0,
    done: false
  };

  const humanState = {
    target: MIN,
    low: MIN,
    high: MAX,
    steps: 0,
    done: false,
    lastGuess: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomTarget() {
    return Math.floor(Math.random() * TOTAL_STATES) + MIN;
  }

  function buildGrid() {
    const fragment = document.createDocumentFragment();

    for (let n = MIN; n <= MAX; n += 1) {
      const cell = document.createElement("div");
      cell.className = "grid-number";
      cell.textContent = String(n);
      gridCells.push(cell);
      fragment.appendChild(cell);
    }

    grid.appendChild(fragment);
  }

  function resetGridClasses() {
    gridCells.forEach((cell) => {
      cell.className = "grid-number";
    });
  }

  function midpoint(low, high) {
    return Math.floor((low + high) / 2);
  }

  function computeEntropyPercent(state) {
    if (state.done) {
      return 0;
    }

    const remaining = Math.max(0, state.high - state.low + 1);
    return (remaining / TOTAL_STATES) * 100;
  }

  function updateMachineTelemetry() {
    const entropy = computeEntropyPercent(machineState);
    entropyValue.textContent = `${entropy.toFixed(1)}%`;
  }

  function setMachineControlsDisabled(disabled) {
    machineLowButton.disabled = disabled;
    machineCorrectButton.disabled = disabled;
    machineHighButton.disabled = disabled;
  }

  function renderMachineGrid() {
    resetGridClasses();

    for (let n = MIN; n <= MAX; n += 1) {
      const cell = gridCells[n - MIN];

      if (n < machineState.low) {
        cell.classList.add("collapsed-low");
      } else if (n > machineState.high) {
        cell.classList.add("collapsed-high");
      }
    }

    if (machineState.guess !== null && !machineState.done) {
      gridCells[machineState.guess - MIN].classList.add("current");
    }

    if (machineState.done && machineState.guess !== null) {
      gridCells[machineState.guess - MIN].classList.add("resolved");
    }
  }

  function setNextMachineGuess() {
    if (machineState.low > machineState.high) {
      machineState.done = true;
      machineState.guess = null;
      machineGuessText.textContent = "?";
      machineStatus.textContent = "Inconsistent signals detected. Reset required.";
      setMachineControlsDisabled(true);
      updateMachineTelemetry();
      renderMachineGrid();
      return;
    }

    machineState.guess = midpoint(machineState.low, machineState.high);
    machineGuessText.textContent = String(machineState.guess);
    updateMachineTelemetry();
    renderMachineGrid();
  }

  function resetMachineState() {
    machineState.low = MIN;
    machineState.high = MAX;
    machineState.steps = 0;
    machineState.done = false;
    machineStatus.textContent = "System initialized.";
    setMachineControlsDisabled(false);
    setNextMachineGuess();
  }

  function respondMachine(direction) {
    if (machineState.done || machineState.guess === null) {
      return;
    }

    machineState.steps += 1;

    if (direction === "low") {
      machineState.low = clamp(machineState.guess + 1, MIN, MAX + 1);
      machineStatus.textContent = `Iteration ${machineState.steps}: proposal too low.`;
      setNextMachineGuess();
      return;
    }

    if (direction === "high") {
      machineState.high = clamp(machineState.guess - 1, MIN - 1, MAX);
      machineStatus.textContent = `Iteration ${machineState.steps}: proposal too high.`;
      setNextMachineGuess();
      return;
    }

    machineState.done = true;
    machineStatus.textContent = `State collapsed in ${machineState.steps} iterations.`;
    setMachineControlsDisabled(true);
    updateMachineTelemetry();
    renderMachineGrid();
  }

  function renderHumanGrid() {
    resetGridClasses();

    for (let n = MIN; n <= MAX; n += 1) {
      const cell = gridCells[n - MIN];

      if (n < humanState.low) {
        cell.classList.add("collapsed-low");
      } else if (n > humanState.high) {
        cell.classList.add("collapsed-high");
      }
    }

    if (humanState.lastGuess !== null) {
      const guessCell = gridCells[humanState.lastGuess - MIN];

      if (humanState.done) {
        guessCell.classList.add("resolved");
      } else {
        guessCell.classList.add("current");
      }
    }
  }

  function resetHumanState() {
    humanState.target = randomTarget();
    humanState.low = MIN;
    humanState.high = MAX;
    humanState.steps = 0;
    humanState.done = false;
    humanState.lastGuess = null;

    humanFeedback.textContent = "Awaiting input.";
    humanAnalysis.textContent = "";
    humanInput.value = "";

    renderHumanGrid();
  }

  function showHumanAnalysis() {
    const efficiency = Math.min(100, (OPTIMAL_STEPS / humanState.steps) * 100);

    humanAnalysis.textContent =
      `Target acquired in ${humanState.steps} steps. ` +
      `Optimal algorithm capability: ${OPTIMAL_STEPS} steps. ` +
      `Search efficiency: ${efficiency.toFixed(1)}%.`;
  }

  function submitHumanGuess(event) {
    event.preventDefault();

    if (humanState.done) {
      return;
    }

    const value = humanInput.value.trim();

    if (value === "") {
      humanFeedback.textContent = "Input required.";
      return;
    }

    const guess = Number(value);

    if (!Number.isInteger(guess) || guess < MIN || guess > MAX) {
      humanFeedback.textContent = "Input must be an integer in [0, 100].";
      return;
    }

    humanState.steps += 1;
    humanState.lastGuess = guess;

    if (guess < humanState.target) {
      humanState.low = Math.max(humanState.low, guess + 1);
      humanFeedback.textContent = "INPUT < TARGET (Your guess is too low)";
      renderHumanGrid();
      humanInput.select();
      return;
    }

    if (guess > humanState.target) {
      humanState.high = Math.min(humanState.high, guess - 1);
      humanFeedback.textContent = "INPUT > TARGET (Your guess is too high)";
      renderHumanGrid();
      humanInput.select();
      return;
    }

    humanState.done = true;
    humanFeedback.textContent = "INPUT = TARGET";
    showHumanAnalysis();
    renderHumanGrid();
  }

  function switchMode(mode) {
    activeMode = mode;

    const machineActive = mode === "machine";

    modeMachineButton.classList.toggle("active", machineActive);
    modeHumanButton.classList.toggle("active", !machineActive);

    machinePanel.classList.toggle("hidden", !machineActive);
    humanPanel.classList.toggle("hidden", machineActive);

    if (machineActive) {
      renderMachineGrid();
    } else {
      renderHumanGrid();
      humanInput.focus();
    }
  }

  modeMachineButton.addEventListener("click", () => switchMode("machine"));
  modeHumanButton.addEventListener("click", () => switchMode("human"));

  machineLowButton.addEventListener("click", () => respondMachine("low"));
  machineCorrectButton.addEventListener("click", () => respondMachine("correct"));
  machineHighButton.addEventListener("click", () => respondMachine("high"));
  machineResetButton.addEventListener("click", resetMachineState);

  humanForm.addEventListener("submit", submitHumanGuess);
  humanResetButton.addEventListener("click", resetHumanState);

  buildGrid();
  resetMachineState();
  resetHumanState();
  switchMode(activeMode);
})();

