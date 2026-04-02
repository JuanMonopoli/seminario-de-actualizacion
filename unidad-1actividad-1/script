const pantalla = document.getElementById("pantalla");
const botones = document.querySelectorAll("button");

let expresion = "";

botones.forEach(boton => {
    boton.addEventListener("click", () => {

        if (boton.classList.contains("num") || boton.classList.contains("op")) {
            const valor = boton.getAttribute("data-valor");

            if (pantalla.value === "0" && valor !== ".") {
                expresion = valor;
            } else {
                expresion += valor;
            }

            pantalla.value = expresion;
        }

        if (boton.classList.contains("igual")) {
            try {
                expresion = eval(expresion).toString();
                pantalla.value = expresion;
            } catch {
                pantalla.value = "Error";
                expresion = "";
            }
        }

        if (boton.classList.contains("borrar")) {
            expresion = "";
            pantalla.value = "0";
        }

    });
});
