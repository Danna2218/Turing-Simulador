/* ============================================================
   vista.js — PRESENTACIÓN (solo DOM)
   Lee la configuración de la máquina y la pinta. Nunca la modifica.
   ============================================================ */
class Vista {
  constructor(config) {
    this.config = config;
    const $ = id => document.getElementById(id);
    this.el = {
      entrada: $("entrada"), aviso: $("aviso"), cinta: $("cinta"),
      estado: $("estado"), estadoDesc: $("estadoDesc"), datoEstado: $("datoEstado"),
      pasos: $("pasos"), leido: $("leido"), explica: $("explica"),
      resultado: $("resultado"), registro: $("registro"),
      btnPaso: $("btnPaso"), btnTodo: $("btnTodo"), btnLimpiar: $("btnLimpiar"),
      velocidad: $("velocidad"), tbody: document.querySelector("#tabla tbody")
    };
  }

  // ---------- Entrada ----------
  get cadena() { return this.el.entrada.value; }
  set cadena(valor) { this.el.entrada.value = valor; }
  get velocidadMs() { return Number(this.el.velocidad.value); }
  mostrarAviso(texto) { this.el.aviso.textContent = texto; }
  enfocarEntrada() { this.el.entrada.focus(); }

  setControlesActivos(activos) {
    this.el.btnPaso.disabled = !activos;
    this.el.btnTodo.disabled = !activos;
    this.el.entrada.disabled = !activos;
  }

  // ---------- Tabla de transiciones ----------
  construirTabla() {
    this.el.tbody.innerHTML = "";
    this.config.transiciones.forEach(t => {
      const tr = document.createElement("tr");
      [t.estado, t.lee, t.escribe, t.mueve === "D" ? "Derecha →" : "Izquierda ←", t.sig, t.texto]
        .forEach(valor => {
          const td = document.createElement("td");
          td.textContent = valor;
          tr.appendChild(td);
        });
      this.el.tbody.appendChild(tr);
    });
  }

  // ---------- Dibujo principal ----------
  dibujar(conf, { filaUsada = -1, celdaEscrita = -1 } = {}) {
    const { blanco, etiquetas } = this.config;
    const { cinta, cabezal, estado, pasos } = conf;

    this.el.cinta.innerHTML = "";
    const total = Math.max(cinta.length, cabezal + 1) + 2; // 2 casillas vacías extra
    for (let i = 0; i < total; i++) {
      const simbolo = i < cinta.length ? cinta[i] : blanco;
      const celda = document.createElement("div");
      celda.className = "celda";
      if (simbolo === blanco) celda.classList.add("vacia");
      if (simbolo === "X") celda.classList.add("marca-x");
      if (simbolo === "Y") celda.classList.add("marca-y");
      if (i === cabezal) celda.classList.add("activa");
      if (i === celdaEscrita) celda.classList.add("cambio");
      celda.textContent = simbolo;
      const indice = document.createElement("span");
      indice.className = "indice";
      indice.textContent = i + 1;
      celda.appendChild(indice);
      this.el.cinta.appendChild(celda);
    }
    const activa = this.el.cinta.querySelector(".activa");
    if (activa) activa.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });

    this.el.estado.textContent = estado;
    this.el.estadoDesc.textContent = etiquetas[estado];
    this.el.datoEstado.className = "dato estado-" + estado;
    this.el.pasos.textContent = pasos;
    this.el.leido.textContent = cinta[cabezal] !== undefined ? cinta[cabezal] : blanco;

    this.el.tbody.querySelectorAll("tr").forEach((tr, i) => tr.classList.toggle("usada", i === filaUsada));
  }

  // ---------- Explicación y resultado ----------
  explicar(texto) { this.el.explica.textContent = texto; }

  ocultarResultado() {
    this.el.resultado.className = "resultado oculto";
    this.el.resultado.textContent = "";
  }

  mostrarResultado(acepta, cadena, motivo) {
    const texto = cadena || "(vacía)";
    this.el.resultado.className = "resultado " + (acepta ? "acepta" : "rechaza");
    this.el.resultado.innerHTML = acepta
      ? `<strong>✔ ACEPTA</strong>La cadena «${texto}» tiene la forma 0ⁿ1ⁿ. ${motivo}`
      : `<strong>✘ RECHAZA</strong>La cadena «${texto}» no tiene la forma 0ⁿ1ⁿ. ${motivo}`;
    this.explicar(acepta
      ? "La máquina terminó en el estado qa (aceptación)."
      : "La máquina terminó en el estado qr (rechazo).");
  }

  // ---------- Registro ----------
  reiniciarRegistro() {
    this.el.registro.innerHTML =
      '<li class="vacio">Aún no hay pasos. Pulsa «Paso a paso» o «Ejecutar todo» para empezar.</li>';
  }

  registrar(texto) {
    const reg = this.el.registro;
    const vacio = reg.querySelector(".vacio");
    if (vacio) vacio.remove();
    const previo = reg.querySelector(".ultimo");
    if (previo) previo.classList.remove("ultimo");
    const li = document.createElement("li");
    li.textContent = texto;
    li.classList.add("ultimo");
    reg.appendChild(li);
    reg.scrollTop = reg.scrollHeight;
  }

  /** Traduce un evento de la máquina a líneas del registro. */
  registrarEvento(ev, pasosTotales, cadena) {
    if (ev.esPrimero) {
      this.registrar(`Inicio: cinta cargada con «${cadena || "(vacía)"}», estado q0, cabezal en la primera casilla.`);
    }
    if (ev.indiceRegla === -1) {
      this.registrar(`En ${ev.estadoAnterior} leyó «${ev.leido}»: no hay ninguna regla para esa situación → RECHAZA.`);
    } else {
      const dir = ev.mueve === "D" ? "derecha →" : "izquierda ←";
      this.registrar(`Paso ${pasosTotales}: en ${ev.estadoAnterior} leyó «${ev.leido}» → escribió «${ev.escribe}», se movió a la ${dir} y pasó a ${ev.estadoNuevo}.`);
    }
    if (ev.terminada) {
      this.registrar(ev.acepta
        ? "Fin: la máquina llegó al estado qa → ACEPTA."
        : "Fin: la máquina se detuvo en el estado qr → RECHAZA.");
    }
  }
}
