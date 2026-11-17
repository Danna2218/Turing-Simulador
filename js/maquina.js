/* ============================================================
   maquina.js — LÓGICA PURA (sin DOM, sin estilos)
   Modelo de la máquina de Turing. Recibe la configuración por
   constructor y expone un paso de cómputo a la vez.
   Se puede probar en Node sin navegador.
   ============================================================ */
class MaquinaTuring {
  constructor(config) {
    this.config = config;
    this.cargar("");
  }

  /** Carga una cadena y deja la máquina en su configuración inicial. */
  cargar(cadena) {
    const { blanco, estadoInicial } = this.config;
    this.cadena = cadena;
    this.cinta = cadena.length ? cadena.split("") : [blanco];
    this.cabezal = 0;
    this.estado = estadoInicial;
    this.pasos = 0;
    this.iniciada = false;
    this.terminada = false;
    this.acepta = null;
  }

  /** Copia de la configuración instantánea (la vista no puede modificarla). */
  get configuracion() {
    return {
      cinta: [...this.cinta],
      cabezal: this.cabezal,
      estado: this.estado,
      pasos: this.pasos,
      terminada: this.terminada,
      acepta: this.acepta
    };
  }

  get simboloActual() {
    const s = this.cinta[this.cabezal];
    return s !== undefined ? s : this.config.blanco;
  }

  /**
   * Ejecuta un paso. Devuelve un evento descriptivo o null si ya terminó.
   * evento = { esPrimero, estadoAnterior, leido, escribe, mueve, estadoNuevo,
   *            indiceRegla, texto, posicionEscrita, terminada, acepta, motivo }
   */
  darPaso() {
    if (this.terminada) return null;
    const { blanco, estadoAceptacion, estadoRechazo, transiciones, motivos } = this.config;

    const esPrimero = !this.iniciada;
    this.iniciada = true;

    if (this.cabezal < 0) this.cabezal = 0;
    if (this.cabezal >= this.cinta.length) this.cinta.push(blanco);

    const leido = this.cinta[this.cabezal];
    const estadoAnterior = this.estado;
    const indiceRegla = transiciones.findIndex(t => t.estado === estadoAnterior && t.lee === leido);

    // Sin regla aplicable -> rechaza
    if (indiceRegla === -1) {
      this.estado = estadoRechazo;
      this.terminada = true;
      this.acepta = false;
      return {
        esPrimero, estadoAnterior, leido,
        escribe: null, mueve: null, estadoNuevo: estadoRechazo,
        indiceRegla: -1, texto: null, posicionEscrita: -1,
        terminada: true, acepta: false,
        motivo: motivos[estadoAnterior + "|" + leido]
          || `No existe una regla para el estado ${estadoAnterior} leyendo «${leido}».`
      };
    }

    // Aplicar la regla
    const t = transiciones[indiceRegla];
    const posicionEscrita = this.cabezal;
    this.cinta[this.cabezal] = t.escribe;
    this.cabezal += t.mueve === "D" ? 1 : -1;
    this.estado = t.sig;
    this.pasos++;

    if (this.estado === estadoAceptacion) {
      this.terminada = true;
      this.acepta = true;
    }

    return {
      esPrimero, estadoAnterior, leido,
      escribe: t.escribe, mueve: t.mueve, estadoNuevo: t.sig,
      indiceRegla, texto: t.texto, posicionEscrita,
      terminada: this.terminada, acepta: this.acepta,
      motivo: this.acepta ? "Cada 0 tuvo su 1 pareja y no sobró nada." : null
    };
  }
}

if (typeof module !== "undefined") module.exports = { MaquinaTuring };
