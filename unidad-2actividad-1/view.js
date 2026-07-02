class CalculatorView extends HTMLElement {

    constructor() {
        super();

        this._pantalla = document.createElement('input');
        this._pantalla.type = 'text';
        this._pantalla.id = 'pantalla';
        this._pantalla.readOnly = true;
        this._pantalla.value = '0';

        const definicionFilas = [
            [{ valor: '7', clase: 'num' }, { valor: '8', clase: 'num' }, { valor: '9', clase: 'num' }, { valor: '+', clase: 'op' }],
            [{ valor: '4', clase: 'num' }, { valor: '5', clase: 'num' }, { valor: '6', clase: 'num' }, { valor: '-', clase: 'op' }],
            [{ valor: '3', clase: 'num' }, { valor: '2', clase: 'num' }, { valor: '1', clase: 'num' }, { valor: '*', clase: 'op', texto: '×' }],
            [{ valor: '0', clase: 'num' }, { valor: '.', clase: 'num' }, { clase: 'igual', texto: '=' }, { valor: '/', clase: 'op' }]
        ];

        const tabla = document.createElement('table');

        definicionFilas.forEach(fila => {
            const tr = document.createElement('tr');
            fila.forEach(def => {
                const td = document.createElement('td');
                const boton = document.createElement('button');
                boton.classList.add(def.clase);
                if (def.valor !== undefined) {
                    boton.dataset.valor = def.valor;
                }
                boton.innerText = def.texto ?? def.valor;
                td.appendChild(boton);
                tr.appendChild(td);
            });
            tabla.appendChild(tr);
        });

        this._botonBorrar = document.createElement('button');
        this._botonBorrar.classList.add('borrar');
        this._botonBorrar.innerText = 'Borrar';

        this.appendChild(this._pantalla);
        this.appendChild(tabla);
        this.appendChild(this._botonBorrar);

        this._onClick = this._onClick.bind(this);
    }


    set value(texto) {
        this._pantalla.value = texto;
    }

    get value() {
        return this._pantalla.value;
    }


    connectedCallback() {
        this.addEventListener('click', this._onClick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
    }


    _onClick(event) {
        const boton = event.target.closest('button');
        if (!boton) return;

        if (boton.classList.contains('num')) {
            this._emitirSolicitud('num', boton.dataset.valor);
        } else if (boton.classList.contains('op')) {
            this._emitirSolicitud('op', boton.dataset.valor);
        } else if (boton.classList.contains('igual')) {
            this._emitirSolicitud('igual');
        } else if (boton.classList.contains('borrar')) {
            this._emitirSolicitud('borrar');
        }
    }

    _emitirSolicitud(tipo, valor = null) {
        this.dispatchEvent(new CustomEvent('request', { detail: { tipo, valor } }));
    }
}

customElements.define('x-calculadora', CalculatorView);
