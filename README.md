# Simulador de Máquina de Turing · 0ⁿ1ⁿ

Abre `index.html` en el navegador (no requiere servidor).

```
simulador-turing/
├── index.html        Estructura de la página
├── css/styles.css    Tema oscuro (negro, morado, verde)
└── js/
    ├── config.js     Datos: tabla de transiciones δ, etiquetas y motivos
    ├── maquina.js    Lógica pura (sin DOM). Clase MaquinaTuring
    ├── vista.js      Presentación (DOM). Clase Vista
    └── main.js       Controlador: une máquina y vista
```

Orden de carga de scripts: config → maquina → vista → main.
`maquina.js` no toca el DOM, así que se puede probar en Node.
