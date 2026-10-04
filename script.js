const display = document.querySelector('#display');
const modeBtn = document.getElementById('modeBtn');
const standardButtons = document.getElementById('standardButtons');
const scientificButtons = document.getElementById('scientificButtons');
let expression = '';
let isScientific = false;

// Toggle between standard and scientific mode
modeBtn.addEventListener('click', () => {
  isScientific = !isScientific;
  if (isScientific) {
    standardButtons.style.display = 'none';
    scientificButtons.style.display = 'grid';
    modeBtn.textContent = 'Scientific';
  } else {
    standardButtons.style.display = 'grid';
    scientificButtons.style.display = 'none';
    modeBtn.textContent = 'Standard';
  }
});

function updateDisplay(value = expression || '0') {
  display.value = value;
}

function calculate() {
  if (!expression) return;

  try {
    // Create a safe evaluation context with Math functions
    const mathContext = {
      sin: (x) => Math.sin(x),
      cos: (x) => Math.cos(x),
      tan: (x) => Math.tan(x),
      asin: (x) => Math.asin(x),
      acos: (x) => Math.acos(x),
      atan: (x) => Math.atan(x),
      sqrt: (x) => Math.sqrt(x),
      ln: (x) => Math.log(x),
      log: (x) => Math.log10(x),
      fact: (x) => {
        if (x < 0) throw new Error('Factorial of negative number');
        if (x === 0 || x === 1) return 1;
        let result = 1;
        for (let i = 2; i <= x; i++) result *= i;
        return result;
      },
      PI: Math.PI,
      E: Math.E
    };

    // Build safe expression
    let safeExpression = expression
      .replace(/π/g, mathContext.PI)
      .replace(/e/g, mathContext.E)
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/!/g, (match, offset, str) => {
        // Handle factorial: find the number before !
        let num = '';
        for (let i = offset - 1; i >= 0; i--) {
          const char = str[i];
          if (/[0-9.]/.test(char)) {
            num = char + num;
          } else if (char === ')') {
            // Handle factorial of parentheses expression
            let parenCount = 1;
            let j = i - 1;
            while (j >= 0 && parenCount > 0) {
              if (str[j] === ')') parenCount++;
              if (str[j] === '(') parenCount--;
              j--;
            }
            num = str.substring(j + 1, i + 1) + '!';
            break;
          } else {
            break;
          }
        }
        return match;
      });

    // Process factorial
    safeExpression = safeExpression.replace(/(\d+)!/g, (match, num) => {
      return `Math.factorial(${num})`;
    });

    // Add Math object context for factorial
    const result = Function(
      `"use strict"; 
       const Math_factorial = ${mathContext.fact}; 
       Math.factorial = Math_factorial;
       return (${safeExpression})`
    )();

    if (!Number.isFinite(result)) throw new Error('Invalid result');
    expression = String(Number(result.toFixed(10)));
    updateDisplay();
  } catch {
    expression = '';
    updateDisplay('Error');
  }
}

// Add button click handler
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

// Add listeners to both button sets
addButtonListener(standardButtons);
addButtonListener(scientificButtons);

// Keyboard support
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
