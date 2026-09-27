# Simple Calculator

A lightweight calculator built with vanilla HTML, CSS, and JavaScript. It supports basic arithmetic operations through button clicks or keyboard input and runs directly in a web browser without any dependencies.

## Features

- Addition, subtraction, multiplication, and division
- Decimal number support
- **AC** button to clear the current expression
- **DEL** button to remove the last character
- **=** button to calculate the result
- Keyboard controls
- Responsive layout for desktop and mobile screens
- Basic handling for invalid expressions and results such as division by zero

## Getting Started

### Option 1: Open locally

1. Clone or download this repository.
2. Open `index.html` in a modern web browser.
3. Use the on-screen buttons or your keyboard to perform calculations.

### Option 2: Run with a local server

From the project directory, run a local server such as:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000) in your browser.

## How to Use

### Mouse or touch

- Select number buttons to enter values.
- Select an operator (`+`, `−`, `×`, or `÷`).
- Select `=` to calculate the result.
- Select `AC` to reset the calculator.
- Select `DEL` to remove the most recently entered character.

### Keyboard

- Numbers and operators: enter them directly.
- `Enter` or `=`: calculate the result.
- `Backspace`: delete the last character.
- `Escape`: clear the expression.

## How It Works

### `index.html`

Defines the calculator structure, including the display and button grid. Each button uses data attributes to identify its value or action, allowing the JavaScript to handle all buttons through one event listener.

### `style.css`

Provides the visual design and responsive layout. CSS Grid arranges the buttons, while different colors distinguish operators, utility buttons, and the equals button.

### `script.js`

Maintains the current expression and updates the display whenever the user enters input. It handles button clicks and keyboard events, validates the expression, performs the calculation, and displays an error when the expression cannot be evaluated.

## Project Structure

```text
simple-calculator/
├── index.html  # Calculator markup
├── style.css   # Layout and visual styles
├── script.js   # Input handling and calculations
└── README.md   # Project documentation
```

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

## License

This project is available for personal and educational use.
