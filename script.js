const expressionEl = document.getElementById("expression");
const currentEl = document.getElementById("current");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

const OPERATOR_SYMBOLS = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

function updateDisplay() {
  currentEl.textContent = current;
  expressionEl.textContent =
    previous !== null && operator ? `${previous} ${OPERATOR_SYMBOLS[operator]}` : "";
}

function inputNumber(digit) {
  if (justEvaluated) {
    current = digit;
    justEvaluated = false;
    return;
  }
  if (current === "0") {
    current = digit;
  } else {
    current += digit;
  }
}

function inputDecimal() {
  if (justEvaluated) {
    current = "0.";
    justEvaluated = false;
    return;
  }
  if (!current.includes(".")) {
    current += ".";
  }
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
}

function negate() {
  if (current !== "0") {
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
  }
}

function percent() {
  current = String(parseFloat(current) / 100);
}

function compute(a, b, op) {
  switch (op) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

let previousPending = false;

function chooseOperator(nextOperator) {
  if (operator && previous !== null && !justEvaluated) {
    const result = compute(parseFloat(previous), parseFloat(current), operator);
    previous = formatResult(result);
    current = previous;
  } else {
    previous = current;
  }
  operator = nextOperator;
  justEvaluated = false;
  previousPending = true;
}

function formatResult(value) {
  if (Number.isNaN(value)) return "Error";
  return String(parseFloat(value.toFixed(10)));
}

function equals() {
  if (operator === null || previous === null) return;
  const result = compute(parseFloat(previous), parseFloat(current), operator);
  expressionEl.textContent = `${previous} ${OPERATOR_SYMBOLS[operator]} ${current} =`;
  current = formatResult(result);
  previous = null;
  operator = null;
  justEvaluated = true;
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const { number, action } = btn.dataset;

    if (number !== undefined) {
      if (previousPending) {
        current = "0";
        previousPending = false;
      }
      inputNumber(number);
    } else if (action) {
      switch (action) {
        case "clear":
          clearAll();
          break;
        case "negate":
          negate();
          break;
        case "percent":
          percent();
          break;
        case "decimal":
          if (previousPending) {
            current = "0";
            previousPending = false;
          }
          inputDecimal();
          break;
        case "add":
        case "subtract":
        case "multiply":
        case "divide":
          chooseOperator(action);
          return;
        case "equals":
          equals();
          break;
      }
    }
    updateDisplay();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    document.querySelector(`.btn[data-number="${e.key}"]`).click();
  } else if (e.key === ".") {
    document.querySelector('.btn[data-action="decimal"]').click();
  } else if (e.key === "+") {
    document.querySelector('.btn[data-action="add"]').click();
  } else if (e.key === "-") {
    document.querySelector('.btn[data-action="subtract"]').click();
  } else if (e.key === "*") {
    document.querySelector('.btn[data-action="multiply"]').click();
  } else if (e.key === "/") {
    e.preventDefault();
    document.querySelector('.btn[data-action="divide"]').click();
  } else if (e.key === "Enter" || e.key === "=") {
    document.querySelector('.btn[data-action="equals"]').click();
  } else if (e.key === "Escape") {
    document.querySelector('.btn[data-action="clear"]').click();
  } else if (e.key === "%") {
    document.querySelector('.btn[data-action="percent"]').click();
  }
});

updateDisplay();
