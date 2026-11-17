/* ============================================================
   main.js — CONTROLADOR
   Conecta la lógica (MaquinaTuring) con la vista (Vista):
   traduce las acciones del usuario en pasos de la máquina.
   ============================================================ */
(function () {
  const maquina = new MaquinaTuring(CONFIG);
  const vista = new Vista(CONFIG);

  let temporizador = null;
  let filaUsada = -1;
  let celdaEscrita = -1;

  function reiniciar() {
    detener();
    maquina.cargar(vista.cadena);
    filaUsada = -1;
    celdaEscrita = -1;
    vista.reiniciarRegistro();
    vista.ocultarResultado();
    vista.explicar("Escribe una cadena (por ejemplo 0011) y pulsa «Paso a paso» para ver cómo trabaja la máquina.");
    vista.dibujar(maquina.configuracion);
  }

  function darPaso() {
    const ev = maquina.darPaso();
    if (!ev) return;

    filaUsada = ev.indiceRegla;
    celdaEscrita = ev.posicionEscrita;

    vista.registrarEvento(ev, maquina.pasos, vista.cadena);
    if (ev.texto) vista.explicar(ev.texto);

    if (ev.terminada) {
      detener();
      vista.mostrarResultado(ev.acepta, vista.cadena, ev.motivo);
    }
    vista.dibujar(maquina.configuracion, { filaUsada, celdaEscrita });
  }

  function detener() {
    if (temporizador !== null) {
      clearInterval(temporizador);
      temporizador = null;
    }
    vista.setControlesActivos(true);
  }

  function pasoManual() {
    if (maquina.terminada) reiniciar();
    darPaso();
  }

  function ejecutarTodo() {
    if (maquina.terminada) reiniciar();
    if (temporizador !== null) return;
    temporizador = setInterval(darPaso, vista.velocidadMs);
    vista.setControlesActivos(false);
    darPaso();
  }

  function limpiar() {
    vista.cadena = "";
    vista.mostrarAviso("");
    reiniciar();
    vista.enfocarEntrada();
  }

  // ---------- Eventos ----------
  vista.el.btnPaso.addEventListener("click", pasoManual);
  vista.el.btnTodo.addEventListener("click", ejecutarTodo);
  vista.el.btnLimpiar.addEventListener("click", limpiar);

  vista.el.entrada.addEventListener("input", () => {
    const limpio = vista.cadena.replace(/[^01]/g, "");
    vista.mostrarAviso(limpio !== vista.cadena ? "Solo se permiten los símbolos 0 y 1." : "");
    vista.cadena = limpio;
    reiniciar();
  });
  vista.el.entrada.addEventListener("keydown", e => { if (e.key === "Enter") pasoManual(); });

  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      vista.cadena = chip.dataset.ejemplo;
      vista.mostrarAviso("");
      reiniciar();
    });
  });

  // ---------- Inicio ----------
  vista.construirTabla();
  vista.cadena = "0011";
  reiniciar();
})();
