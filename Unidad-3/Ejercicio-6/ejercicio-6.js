function main() {
    let myModel = new Model();
    let myView = new View();
    let myController = new Controller(myView, myModel);
    myController.enable();
    document.body.appendChild(myView);
}
window.onload = main;
