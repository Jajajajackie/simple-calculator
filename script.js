const display = document.querySelector('#display');
const buttons = document.querySelector('.buttons');
let expression = '';

function updateDisplay(value = expression || '0') {
  display.value = value;
}

function calculate() {
  if (!expression) return;

  try {
    // The expression is built only from calculator buttons and validated here.
    if (!/^[0-9+*/.()\- ]+$/.test(expression)) throw new Error('Invalid expression');
    const result = Function(`"use strict"; return (${expression})`)();
    if (!Number.isFinite(result)) throw new Error('Invalid result');
    expression = String(Number(result.toFixed(10)));
    updateDisplay();
  } catch {
    expression = '';
    updateDisplay('Error');
  }
}

buttons.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { action } = button.dataset;
  const value = button.dataset.value;

  if (action === 'clear') {
    expression = '';
    updateDisplay();
  } else if (action === 'delete') {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (action === 'calculate') {
    calculate();
  } else if (value) {
    expression += value;
    updateDisplay();
  }
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9+*/().-]$/.test(event.key)) {
    expression += event.key;
    updateDisplay();
  } else if (event.key === 'Enter' || event.key === '=') {
    calculate();
  } else if (event.key === 'Backspace') {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (event.key === 'Escape') {
    expression = '';
    updateDisplay();
  }
});
