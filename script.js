const display = document.querySelector('#display');
const modeBtn = document.getElementById('modeBtn');
const graphBtn = document.getElementById('graphBtn');
const standardButtons = document.getElementById('standardButtons');
const scientificButtons = document.getElementById('scientificButtons');
const graphPanel = document.getElementById('graphPanel');
const graphInput = document.getElementById('graphInput');
const plotBtn = document.getElementById('plotBtn');
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

let expression = '';
let isScientific = false;

function setScientificMode(enabled) {
  isScientific = enabled;
  standardButtons.style.display = enabled ? 'none' : 'grid';
  scientificButtons.style.display = enabled ? 'grid' : 'none';
  modeBtn.textContent = enabled ? 'Scientific' : 'Standard';
}

modeBtn.addEventListener('click', () => {
  setScientificMode(!isScientific);
});

graphBtn.addEventListener('click', () => {
  graphPanel.classList.toggle('hidden');
  if (!graphPanel.classList.contains('hidden')) {
    plotGraph();
  }
});

plotBtn.addEventListener('click', () => {
  plotGraph();
});

function updateDisplay(value = expression || '0') {
  display.value = value;
}

function normalizeExpression(input) {
  return input
    .replace(/π/g, 'Math.PI')
    .replace(/e/g, 'Math.E')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/asin\(/g, 'Math.asin(')
    .replace(/acos\(/g, 'Math.acos(')
    .replace(/atan\(/g, 'Math.atan(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/pow\(/g, 'Math.pow(')
    .replace(/\^/g, '**')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '');
}

function evaluateExpression(input, xValue = 0) {
  const sanitized = normalizeExpression(input);
  const result = Function('Math', 'x', `"use strict"; return (${sanitized});`)(Math, xValue);

  if (!Number.isFinite(result)) {
    throw new Error('Invalid result');
  }

  return result;
}

function calculate() {
  if (!expression) return;

  try {
    const result = evaluateExpression(expression, 0);
    expression = String(Number(result.toFixed(10)));
    updateDisplay();
  } catch {
    expression = '';
    updateDisplay('Error');
  }
}

function addButtonListener(buttons) {
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
    } else if (action === 'sin') {
      expression += 'sin('; 
      updateDisplay();
    } else if (action === 'cos') {
      expression += 'cos('; 
      updateDisplay();
    } else if (action === 'tan') {
      expression += 'tan('; 
      updateDisplay();
    } else if (action === 'sqrt') {
      expression += 'sqrt('; 
      updateDisplay();
    } else if (action === 'power') {
      expression += '**2';
      updateDisplay();
    } else if (action === 'power3') {
      expression += '**3';
      updateDisplay();
    } else if (action === 'ln') {
      expression += 'ln('; 
      updateDisplay();
    } else if (action === 'log') {
      expression += 'log('; 
      updateDisplay();
    } else if (action === 'factorial') {
      expression += '!';
      updateDisplay();
    } else if (action === 'pi') {
      expression += 'π';
      updateDisplay();
    } else if (action === 'e') {
      expression += 'e';
      updateDisplay();
    } else if (action === 'openParen') {
      expression += '(';
      updateDisplay();
    } else if (action === 'closeParen') {
      expression += ')';
      updateDisplay();
    } else if (action === 'inverse') {
      expression += '1/(';
      updateDisplay();
    } else if (value) {
      expression += value;
      updateDisplay();
    }
  });
}

addButtonListener(standardButtons);
addButtonListener(scientificButtons);

document.addEventListener('keydown', (event) => {
  if (/^[0-9+*/().-]$/.test(event.key)) {
    expression += event.key;
    updateDisplay();
  } else if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculate();
  } else if (event.key === 'Backspace') {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (event.key === 'Escape') {
    expression = '';
    updateDisplay();
  }
});

function drawGraphGrid(width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  const xCenter = width / 2;
  const yCenter = height / 2;
  const step = 20;

  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, yCenter);
  ctx.lineTo(width, yCenter);
  ctx.moveTo(xCenter, 0);
  ctx.lineTo(xCenter, height);
  ctx.stroke();
}

function plotGraph() {
  const inputText = graphInput.value.trim() || 'sin(x)';
  const width = canvas.width;
  const height = canvas.height;
  const minX = -10;
  const maxX = 10;
  const minY = -10;
  const maxY = 10;

  drawGraphGrid(width, height);

  try {
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();

    let started = false;

    for (let px = 0; px <= width; px++) {
      const x = minX + ((px / width) * (maxX - minX));
      const yValue = evaluateExpression(inputText, x);
      const py = height - (((yValue - minY) / (maxY - minY)) * height);

      if (!Number.isFinite(yValue) || py < 0 || py > height) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.stroke();
  } catch {
    ctx.fillStyle = '#fca5a5';
    ctx.font = '18px Arial';
    ctx.fillText('Invalid function', 12, 28);
  }
}
