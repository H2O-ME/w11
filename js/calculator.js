class Calculator {
    constructor(container) {
        this.container = container;
        this.display = container.querySelector('.calc-display');
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = false;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const buttons = this.container.querySelectorAll('.calc-buttons button');
        
        buttons.forEach(button => {
            button.addEventListener('mousedown', (e) => {
                e.preventDefault(); // 防止失去焦点
                const value = button.textContent;
                
                if ('0123456789.'.includes(value)) {
                    this.handleNumber(value);
                } else if ('+-×÷'.includes(value)) {
                    this.handleOperator(value);
                } else if (value === '=') {
                    this.calculate();
                } else if (value === 'C') {
                    this.clear();
                } else if (value === '±') {
                    this.toggleSign();
                } else if (value === '%') {
                    this.percentage();
                }
                
                this.updateDisplay();
            });
        });
    }

    handleNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = num;
            this.shouldResetDisplay = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
    }

    handleOperator(op) {
        if (this.operation !== null) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operation = op;
        this.shouldResetDisplay = true;
    }

    calculate() {
        if (this.operation === null || this.previousValue === null) return;
        
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷': result = prev / current; break;
        }

        this.currentValue = result.toString();
        this.operation = null;
        this.previousValue = null;
        this.shouldResetDisplay = true;
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = false;
    }

    toggleSign() {
        this.currentValue = (parseFloat(this.currentValue) * -1).toString();
    }

    percentage() {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
    }

    updateDisplay() {
        this.display.value = this.currentValue;
    }
}

// 确保Calculator类全局可用
window.Calculator = Calculator; 