class Model extends EventTarget {
    constructor() {
        super();
        this.figures = [];
    }

    addFigure(figure) {
        this.validate(figure);
        if (figure.type === 'cakegraph') {
            figure = {
                ...figure,
                colors: figure.data.map(() => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`)
            };
        }
        this.figures.push(figure);
        this.changed();
    }

    clear() {
        this.figures = [];
        this.changed();
    }

    validate(figure) {
        const valid = Number.isFinite(figure.x) && Number.isFinite(figure.y) && (
            (figure.type === 'circle' && figure.radius > 0) ||
            (figure.type === 'polygon' && Array.isArray(figure.points)) ||
            (figure.type === 'cakegraph' && figure.radius > 0 && Array.isArray(figure.data))
        );
        if (!valid) {
            throw new Error('Figura inválida');
        }
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
                Figura:
                <select id="figureType">
                    <option value="circle">Círculo</option>
                    <option value="polygon">Polígono</option>
                    <option value="cakegraph">CakeGraph</option>
                </select>
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
                    figureType: this.querySelector('#figureType').value,
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
        if (figure.type === 'cakegraph') {
            this._drawCake(figure);
        } else {
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
        }
        ctx.restore();
    }

    _drawCake(figure)
    {
        const ctx = this.ctx;
        const values = figure.data.map(item => typeof item === 'number' ? item : item.value);
        const total = values.reduce((sum, value) => sum + value, 0);
        let start = -Math.PI / 2;

        values.forEach((value, i) => {
            const angle = (value / total) * Math.PI * 2;
            const end = start + angle;

            ctx.beginPath();
            ctx.moveTo(figure.x, figure.y);
            ctx.arc(figure.x, figure.y, figure.radius, start, end);
            ctx.closePath();
            ctx.fillStyle = figure.colors[i];
            ctx.fill();
            ctx.stroke();

            const middle = start + angle / 2;
            const label = typeof figure.data[i] === 'number' ? '' : (figure.data[i].label ?? '');
            const text = `${label} ${Math.round((value / total) * 100)}%`.trim();
            ctx.fillStyle = 'black';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                text,
                figure.x + Math.cos(middle) * figure.radius * 0.65,
                figure.y + Math.sin(middle) * figure.radius * 0.65
            );

            start = end;
        });
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
        this._examples = {
            circle: '{"x":400,"y":300,"radius":80}',
            polygon: '{"x":400,"y":300,"points":[[0,-60],[60,40],[-60,40]]}',
            cakegraph: '{"x":400,"y":300,"radius":150,"data":[{"label":"A","value":0.3},{"label":"B","value":0.5},{"label":"C","value":0.1},{"label":"D","value":0.1}]}'
        };
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
        const { action, figureType, lineType, lineWidth } = event.detail;
        if (action === 'clear') {
            this._model.clear();
            return;
        }
        const text = prompt('Ingrese el JSON de la figura', this._examples[figureType]);
        if (text === null) return;
        try {
            const data = JSON.parse(text);
            const list = Array.isArray(data) ? data : [data];
            list.forEach(figure => this._model.addFigure({ ...figure, type: figureType, lineType, lineWidth }));
        } catch (error) {
            alert('JSON inválido o incompleto');
        }
    }
}
