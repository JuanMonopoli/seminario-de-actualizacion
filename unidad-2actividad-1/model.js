class CalculatorModel extends EventTarget {

    constructor() {
        super();
        this._expression = '0';
    }

    set expression(nuevoValor) {
        if (this._expression !== nuevoValor) {
            this._expression = nuevoValor;
            this.changed();
        }
    }

    get expression() {
        return this._expression;
    }

    changed() {
        this.dispatchEvent(new CustomEvent('changed'));
    }


    agregarValor(valor) {
        const reiniciar = (this._expression === '0' || this._expression === 'Error');

        if (reiniciar && valor !== '.') {
            this.expression = valor;
        } else if (reiniciar && valor === '.') {
            this.expression = '0.';
        } else {
            this.expression = this._expression + valor;
        }
    }

    calcular() {
        try {
            const resultado = eval(this._expression).toString();
            this.expression = resultado;
        } catch {
            this.expression = 'Error';
        }
    }

    limpiar() {
        this.expression = '0';
    }
}
