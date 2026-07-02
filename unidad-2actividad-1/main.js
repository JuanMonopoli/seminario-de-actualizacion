function main() {
    const vista = document.querySelector('x-calculadora');
    const modelo = new CalculatorModel();
    const controlador = new CalculatorController(vista, modelo);

    controlador.enable();
}

window.onload = main;
