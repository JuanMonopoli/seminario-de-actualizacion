function crearLogo({ contenedorClases = [], estiloContenedor = '', enlaceClases = [], estiloEnlace = '', anchoImagen = null } = {}) {
    const contenedor = document.createElement('div');
    contenedor.classList.add(...contenedorClases);
    if (estiloContenedor) contenedor.style.cssText = estiloContenedor;

    const titulo = document.createElement('h5');
    titulo.style.cssText = 'line-height:1; margin:0!important; font-weight:300';

    const enlace = document.createElement('a');
    enlace.href = './index.html';
    enlace.classList.add(...enlaceClases);
    if (estiloEnlace) enlace.style.cssText = estiloEnlace;

    const imagen = document.createElement('img');
    imagen.src = './assets/admin-logo.png';
    imagen.alt = 'w3mix';
    imagen.classList.add('w3-image');
    if (anchoImagen) imagen.width = anchoImagen;

    enlace.appendChild(imagen);
    enlace.append('\u00A0\u00A0W3Admin');

    titulo.appendChild(enlace);
    contenedor.appendChild(titulo);
    return contenedor;
}

function crearBotonMenuLateral({ clasesExtra = [], estiloExtra = '' } = {}) {
    const etiqueta = document.createElement('label');
    etiqueta.setAttribute('for', 'sidebar-control');
    etiqueta.classList.add('w3-button', 'w3-large', 'w3-opacity-min', ...clasesExtra);
    if (estiloExtra) etiqueta.style.cssText = estiloExtra;

    const icono = document.createElement('i');
    icono.classList.add('fa', 'fa-bars');
    etiqueta.appendChild(icono);
    return etiqueta;
}

function crearBotonIconoSuperior(iconoClase) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.classList.add('w3-button', 'w3-large', 'w3-opacity-min');

    const icono = document.createElement('i');
    icono.classList.add('fa', iconoClase);

    boton.appendChild(icono);
    return boton;
}

function crearAvatarUsuario() {
    const contenedor = document.createElement('div');
    contenedor.classList.add('w3-button');

    const circulo = document.createElement('div');
    circulo.classList.add('w3-circle', 'w3-center', 'w3-text-white', 'w3-primary');
    circulo.style.cssText = 'width:38px; height:38px';

    const icono = document.createElement('i');
    icono.classList.add('fa', 'fa-fw', 'fa-user', 'fa');
    icono.style.marginTop = '11px';

    circulo.appendChild(icono);
    contenedor.appendChild(circulo);
    return contenedor;
}

function crearEnlaceMenu({ href, iconoClase, texto, claseIconoExtra = '' }) {
    const enlace = document.createElement('a');
    enlace.href = href;
    enlace.classList.add('w3-bar-item', 'w3-button', 'w3-padding-large', 'w3-hover-text-primary');

    const icono = document.createElement('i');
    icono.classList.add('fa', 'fa-fw', iconoClase);
    if (claseIconoExtra) icono.classList.add(claseIconoExtra);

    enlace.appendChild(icono);
    enlace.append('\u00A0 ' + texto);
    return enlace;
}

function crearEtiquetaSeccionMenu(texto, estiloExtra = '') {
    const etiqueta = document.createElement('span');
    etiqueta.classList.add('w3-bar-item', 'w3-padding', 'w3-small', 'w3-opacity');
    if (estiloExtra) etiqueta.style.cssText = estiloExtra;
    etiqueta.textContent = texto;
    return etiqueta;
}

class WCApplicationView extends HTMLElement {

    constructor() {
        super();

        this._checkboxSidebar = this._crearCheckboxSidebar();
        this._app = this._crearApp();

        this.appendChild(this._checkboxSidebar);
        this.appendChild(this._app);
    }


    connectedCallback() {
    }

    disconnectedCallback() {

    }


    _crearCheckboxSidebar() {
        const checkbox = document.createElement('input');
        checkbox.id = 'sidebar-control';
        checkbox.type = 'checkbox';
        checkbox.classList.add('w3-hide');
        return checkbox;
    }

    _crearApp() {
        const app = document.createElement('div');
        app.id = 'app';

        app.appendChild(this._crearBarraSuperior());
        app.appendChild(this._crearBarraLateral());
        app.appendChild(this._crearCuerpoPrincipal());

        return app;
    }

    _crearBarraSuperior() {
        const top = document.createElement('div');
        top.classList.add('w3-top', 'w3-card');
        top.style.height = '54px';

        const barra = document.createElement('div');
        barra.classList.add('w3-flex-bar', 'w3-theme', 'w3-left-align');

        const logo = crearLogo({
            contenedorClases: ['admin-logo', 'w3-bar-item', 'w3-hide-medium', 'w3-hide-small'],
            enlaceClases: ['w3-button', 'w3-bold'],
            anchoImagen: 26
        });

        const botonMenu = crearBotonMenuLateral();

        const botonesDerecha = document.createElement('div');
        botonesDerecha.classList.add('w3-right');
        botonesDerecha.appendChild(crearBotonIconoSuperior('fa-envelope-open'));
        botonesDerecha.appendChild(crearBotonIconoSuperior('fa-bell'));

        const zonaUsuario = document.createElement('div');
        zonaUsuario.classList.add('text-right');
        zonaUsuario.appendChild(crearAvatarUsuario());

        barra.appendChild(logo);
        barra.appendChild(botonMenu);
        barra.appendChild(botonesDerecha);
        barra.appendChild(zonaUsuario);

        top.appendChild(barra);
        return top;
    }

    _crearBarraLateral() {
        const nav = document.createElement('nav');
        nav.id = 'sidebar';
        nav.classList.add(
            'w3-sidebar', 'w3-top', 'w3-bottom', 'w3-collapse',
            'w3-white', 'w3-border-right', 'w3-border-top', 'scrollbar'
        );
        nav.style.cssText = 'z-index:3;width:230px;height:auto;margin-top:54px;border-color:rgba(0, 0, 0, .1)!important';

        const cabecera = document.createElement('div');
        cabecera.classList.add('w3-bar-item', 'w3-border-bottom', 'w3-hide-large');
        cabecera.style.padding = '6px 0';

        const botonMenu = crearBotonMenuLateral({
            clasesExtra: ['w3-left'],
            estiloExtra: 'background:white!important'
        });

        const logo = crearLogo({
            enlaceClases: ['w3-button'],
            estiloEnlace: 'background:white!important'
        });

        cabecera.appendChild(botonMenu);
        cabecera.appendChild(logo);

        const bloqueMenu = document.createElement('div');
        bloqueMenu.classList.add('w3-bar-block');

        bloqueMenu.appendChild(crearEtiquetaSeccionMenu('MAIN NAVIGATION', 'margin-top:8px'));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: './index.html', iconoClase: 'fa-bar-chart', texto: 'Dashboard' }));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: './icons.html', iconoClase: 'fa-fire', texto: 'UI Icons' }));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: './forms.html', iconoClase: 'fa-edit', texto: 'Forms' }));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: './tables.html', iconoClase: 'fa-table', texto: 'Tables' }));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: './profile.html', iconoClase: 'fa-user-circle', texto: 'Profile' }));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: './login.html', iconoClase: 'fa-lock', texto: 'Login' }));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: './register.html', iconoClase: 'fa-sign-in', texto: 'Registration' }));

        bloqueMenu.appendChild(crearEtiquetaSeccionMenu('LABELS'));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: '#dashboard', iconoClase: 'fa-coffee', claseIconoExtra: 'w3-text-danger', texto: 'Important' }));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: '#dashboard', iconoClase: 'fa-circle-o-notch', claseIconoExtra: 'w3-text-success', texto: 'Warning' }));
        bloqueMenu.appendChild(crearEnlaceMenu({ href: '#dashboard', iconoClase: 'fa-share-alt', claseIconoExtra: 'w3-text-info', texto: 'Information' }));

        nav.appendChild(cabecera);
        nav.appendChild(bloqueMenu);
        return nav;
    }

    _crearCuerpoPrincipal() {
        const main = document.createElement('div');
        main.classList.add('w3-main');
        main.style.marginTop = '54px';

        const cuerpo = document.createElement('div');
        cuerpo.classList.add('w3-container');
        cuerpo.style.padding = '16px 32px';

        main.appendChild(cuerpo);
        main.appendChild(this._crearPie());
        return main;
    }

    _crearPie() {
        const footer = document.createElement('footer');
        footer.classList.add('w3-padding', 'w3-border-top', 'w3-center', 'w3-white', 'w3-margin-top');

        const texto = document.createElement('span');
        texto.classList.add('w3-opacity');
        texto.append('Powered with ');

        const corazon = document.createElement('span');
        corazon.classList.add('w3-text-red');
        corazon.textContent = '\u2665';
        texto.appendChild(corazon);
        texto.append(' by ');

        const enlace = document.createElement('a');
        enlace.href = 'https://w3mix.com';
        enlace.target = '_blank';
        const fuerte = document.createElement('strong');
        fuerte.textContent = 'W3Mix.com';
        enlace.appendChild(fuerte);
        texto.appendChild(enlace);
        texto.append('.');

        footer.appendChild(texto);
        return footer;
    }
}

customElements.define('wc-application', WCApplicationView);
