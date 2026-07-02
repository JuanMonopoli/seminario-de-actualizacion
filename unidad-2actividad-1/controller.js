class CalculatorController {

    constructor(view, model) {
        this._view = view;
        this._model = model;

        this._onModelChanged = this.onModelChanged.bind(this);
        this._onViewRequest = this.onViewRequest.bind(this);
    }

    enable() {
        this._model.addEventListener('changed', this._onModelChanged);
        this._view.addEventListener('request', this._onViewRequest);

        // Sincroniza la vista con el estado inicial del modelo
        this._view.value = this._model.expression;
    }

    disable() {
        this._model.removeEventListener('changed', this._onModelChanged);
        this._view.removeEventListener('request', this._onViewRequest);
    }

    onModelChanged() {
        this._view.value = this._model.expression;
    }

    onViewRequest(event) {
        const { tipo, valor } = event.detail;

        switch (tipo) {
            case 'num':
            case 'op':
                this._model.agregarValor(valor);
                break;
            case 'igual':
                this._model.calcular();
                break;
            case 'borrar':
                this._model.limpiar();
                break;
        }
    }
}
