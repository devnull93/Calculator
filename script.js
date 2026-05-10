document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display");
    const historyDisplay = document.getElementById("history");
    const themeSelect = document.getElementById("themeSelect");
    const buttonsGrid = document.querySelector(".buttons-grid");
    const calculatorContainer = document.getElementById(".calculator-container");

    let currentInput = "0";
    let previousInput = "";
    let operator = null;
    let waitingForSecondOperand = false;
    let displayHistory = "";

    let PI = Trig.PI;
    let SQRT = Trig.sqrt;
    let COS = Trig.cos;
    let SIN = Trig.sin;
    let TAN = Trig.tan;

    const ERROR_DIV_BY_ZERO = "Divide by 0";
    const ERROR_NAN = "NaN";
    const ERROR_GENERAL = "Error";

    function updateDisplay(value) {
       display.value = value;
    }

    function updateHistory(value) {
       historyDisplay.textContent = value;
    }

    function setTheme(themeName) {
       localStorage.setItem("calculatorTheme", themeName);
       document.body.className = `theme-${themeName}`;
    }

    function getTheme() {
       return localStorage.getItem("calculatorTheme") || "dark";
    }

    function appendToInput(value) {
       if (waitingForSecondOperand) {
           currentInput = value;
           waitingForSecondOperand = false;
       } else {
           if (value === "." && currentInput.includes(".")) return;
           currentInput = currentInput === "0" && value !== "." ? value : currentInput + value;
       }
       updateDisplay(currentInput)
    }

    function handleOperator(op) {
       const inputValue = parseFloat(currentInput);

       if (op === "." && currentInput === "0") {
           appendToInput(".");
           return;
       }

       if (isNaN(inputValue)) {
           handleClearEntry();
           return;
       }

       if (previousInput === "") {
           previousInput = inputValue;
       } else if (operator) {
           previousInput = calculate(previousInput, inputValue, operator);
           if (typeof previousInput === "string" && previousInput.includes("Error")) {
               updateDisplay(previousInput);
               operator = null;
               waitingForSecondOperand = false;
               displayHistory = "";
               updateHistory(displayHistory);
               return;
           }
           updateHistory(`${previousInput} ${op}`);
       }

       operator = op;
       waitingForSecondOperand = true;
       if (displayHistory === "" || displayHistory.endsWith("=")) {
           displayHistory = `${previousInput} ${op}`;
       } else {
           displayHistory = `${displayHistory.replace(/ $/, "")} ${op}`;
       }
       updateHistory(displayHistory);
    }

    function calculate(num1, num2, op) {
       let result;
       switch(op) {
           case "+":
              result = num1 + num2;
              break;
           case "-":
              result = num1 - num2;
              break;
           case "*":
              result = num1 * num2;
              break;
           case "/":
              if (num2 === 0) return ERROR_DIV_BY_ZERO;
              result = num1 / num2;
              break;
           default:
              return ERROR_GENERAL;
       }

       if (isNaN(result)) return ERROR_NAN;
       if (Math.abs(result) < 1e-10) return 0;
       return parseFloat(result.toPrecision(15));
    }

    function handleEquals() {
       if (operator === null || waitingForSecondOperand) {
           return;
       }

       const secondValue = parseFloat(currentInput);
       if (isNaN(secondValue)) {
           updateDisplay(ERROR_NAN);
           operator = null;
           previousInput = "";
           currentInput = "0";
           displayHistory = " ";
           updateHistory(displayHistory);
           return;
       }

       const result = calculate(previousInput, secondValue, operator);
       updateDisplay(result);

       if (typeof result === "string" && result.includes("Error")) {
           displayHistory = `Error: ${result}`;
       } else {
           displayHistory = `${previousInput} ${operator} ${currentInput} =`;
       }
       updateHistory(displayHistory);

       previousInput = result;
       currentInput = "0";
       operator = null;
       waitingForSecondOperand = false;
    }

    function handleFunction(funcName) {
       const currentValue = parseFloat(currentInput);
       if (isNaN(currentValue) || currentValue.toString().includes("Error")) {
           updateDisplay(ERROR_NAN);
           return;
       }

       let result;
       let historyString = "";

       switch(funcName) {
           case "sqrt":
              if (currentValue < 0) {
                  result = ERROR_NAN;
                  historyString = `√(${currentInput}) = ${result}`;
              } else {
                  result = SQRT(currentValue);
                  historyString = `√(${currentInput}) = ${result}`;
              }
              break;
           case "pi":
              result = PI;
              historyString = `π = ${result}`;
              break;
           case "cos":
              result = COS(currentValue);
              historyString = `cos(${currentValue}) = ${result}`;
              break;
           case "sin":
              result = SIN(currentValue);
              historyString = `sin(${currentValue}) = ${result}`;
              break;
           case "tan":
              const angleRad = currentValue;
              const piOver2 = PI / 2;
              const tolerance = 1e-6;

              if (Trig.abs(angleRad - piOver2 * Math.round(angleRad / piOver2)) < tolerance) {
                  result = ERROR_DIV_BY_ZERO;
                  historyString = `tan(${currentValue}) = ${result}`;
              } else {
                  result = TAN(currentValue);
                  historyString = `tan(${currentValue}) = ${result}`;
              }
              break;
           default:
              result = ERROR_GENERAL;
       }

       updateDisplay(result);
       if (funcName === "pi") {
           currentInput = result.toString();
           previousInput = "";
           operator = null;
           waitingForSecondOperand = false;
       } else {
           currentInput = result.toString();
           previousInput = result;
           operator = null;
           waitingForSecondOperand = true;
       }

       if (funcName !== "pi" && !result.toString().includes("Error")) {
           displayHistory = historyString;
           updateHistory(displayHistory);
       } else if (result.toString().includes("Error")) {
           displayHistory = `Error: ${result}`;
           updateHistory(displayHistory);
       }
    }

    function handleClearEntry() {
       currentInput = "0";
       updateDisplay(currentInput);
    }

    function handleClearAll() {
       currentInput = "0";
       previousInput = "";
       operator = null;
       waitingForSecondOperand = false;
       displayHistory = "";
       updateDisplay(currentInput);
       updateHistory(displayHistory);
    }

    buttonsGrid.addEventListener("click", (event) => {
        const target = event.target;
        if (!target.classList.contains("btn")) return;

        const value = target.dataset.value;

        if (target.classList.contains("num-btn")) {
            appendToInput(value);
        } else if (target.classList.contains("op-btn")) {
            if (value === "=") {
                handleEquals();
            } else if (value === "CE") {
                handleClearEntry();
            } else if (value === "C") {
                handleClearAll();
            } else if (target.classList.contains("func-btn")) {
                handleFunction(value);
            } else {
                handleOperator(value);
            }
        }
    });

    themeSelect.addEventListener("change", (event) => {
        setTheme(event.target.value);
    });

    const savedTheme = getTheme();
    setTheme(savedTheme);
    themeSelect.value = savedTheme;
    updateDisplay(currentInput);
});
