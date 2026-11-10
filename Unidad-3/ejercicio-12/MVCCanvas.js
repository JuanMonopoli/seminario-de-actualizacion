class Model extends EventTarget {
    constructor() {
        super();
        this.figures = [];
    }

    addFigure(figure) {
        this.figures.push(figure);
        this.changed();
    }

    clear() {
        this.figures = [];
        this.changed();
    }

    changed() {
        this.dispatchEvent(new CustomEvent('changed'));
    }
}

class View extends HTMLElement {
    constructor()
    {
        super();
        this.innerHTML = `
            <div>
                Tipo de línea:
                <select id="lineType">
                    <option value="solid">Continua</option>
                    <option value="dashed">Guiones</option>
                    <option value="dotted">Puntos</option>
                </select>
                Grosor:
                <input id="lineWidth" type="number" min="1" value="1">
                <button id="load">Cargar figuras</button>
                <button id="clear">Limpiar</button>
            </div>
        `;
        this._canvas = document.createElement('canvas');
        this._canvas.width = 800;
        this._canvas.height = 600;
        this._canvas.style.border = '1px solid black';
        this.ctx = this._canvas.getContext('2d');
        this.appendChild(this._canvas);

        this.querySelector('#load').onclick = () => {
            this.dispatchEvent(new CustomEvent('request', {
                detail: {
                    action: 'load',
                    lineType: this.querySelector('#lineType').value,
                    lineWidth: Number(this.querySelector('#lineWidth').value) || 1
                }
            }));
        };
        this.querySelector('#clear').onclick = () => {
            this.dispatchEvent(new CustomEvent('request', { detail: { action: 'clear' } }));
        };
    }

    render( renderFunction )
    {
        this.clear();
        renderFunction( this._canvas );
    }

    clear()
    {
        this.ctx.clearRect(0,0,this._canvas.width,this._canvas.height );
    }

    drawFigure(figure)
    {
        const ctx = this.ctx;
        const w = figure.lineWidth;
        let dash = [];
        if (figure.lineType === 'dashed') dash = [w * 5, w * 3];
        if (figure.lineType === 'dotted') dash = [w, w * 2];

        ctx.save();
        ctx.lineWidth = w;
        ctx.setLineDash(dash);
        ctx.beginPath();
        if (figure.type === 'circle') {
            ctx.arc(figure.x, figure.y, figure.radius, 0, Math.PI * 2);
        } else {
            figure.points.forEach(([px, py], i) => {
                if (i === 0) ctx.moveTo(figure.x + px, figure.y + py);
                else ctx.lineTo(figure.x + px, figure.y + py);
            });
            ctx.closePath();
        }
        ctx.stroke();
        ctx.restore();
    }

    connectedCallback() {
       console.log('Canvas agregado...')
    }
    disconnectedCallback() {

    }

    _onSave() {

    }
}
customElements.define('x-view', View);

class Controller {
    constructor(view, model) {
        this._view = view;
        this._model = model;
        this._onModelChanged = this.onModelChanged.bind(this);
        this._onViewRequest = this.onViewRequest.bind(this);
    }
    enable() {
        this._model.addEventListener('changed', this._onModelChanged);
        this._view.addEventListener('request', this._onViewRequest);
    }
    disable() {
        this._model.removeEventListener('changed', this._onModelChanged);
        this._view.removeEventListener('request', this._onViewRequest);
    }
    onModelChanged() {
        this._view.render(() => {
            this._model.figures.forEach(figure => this._view.drawFigure(figure));
        });
    }
    onViewRequest(event) {
        const { action, lineType, lineWidth } = event.detail;
        if (action === 'clear') {
            this._model.clear();
            return;
        }
        const text = prompt('Ingrese el JSON de la figura', '{"type":"circle","x":400,"y":300,"radius":80}');
        if (text === null) return;
        try {
            const data = JSON.parse(text);
            const list = Array.isArray(data) ? data : [data];
            list.forEach(figure => this._model.addFigure({ ...figure, lineType, lineWidth }));
        } catch (error) {
            alert('JSON inválido');
        }
    }
}
