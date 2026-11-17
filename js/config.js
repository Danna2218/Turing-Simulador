/* ============================================================
   config.js — DEFINICIÓN DE LA MÁQUINA (solo datos)
   Aquí vive la función de transición δ. Para simular otra
   máquina basta con cambiar este archivo.
   ============================================================ */
const CONFIG = Object.freeze({
  blanco: "□",
  estadoInicial: "q0",
  estadoAceptacion: "qa",
  estadoRechazo: "qr",

  // D = derecha, I = izquierda
  transiciones: [
    { estado: "q0", lee: "0",  escribe: "X",  mueve: "D", sig: "q1", texto: "Marca el primer 0 sin tachar con una X y se va a buscar su 1 pareja." },
    { estado: "q0", lee: "Y",  escribe: "Y",  mueve: "D", sig: "q3", texto: "Ya no quedan 0 sin tachar. Pasa a verificar que no sobren 1." },
    { estado: "q1", lee: "0",  escribe: "0",  mueve: "D", sig: "q1", texto: "Pasa por encima de un 0 sin tachar, buscando un 1." },
    { estado: "q1", lee: "Y",  escribe: "Y",  mueve: "D", sig: "q1", texto: "Pasa por encima de un 1 que ya tiene pareja (Y)." },
    { estado: "q1", lee: "1",  escribe: "Y",  mueve: "I", sig: "q2", texto: "Encontró un 1: lo tacha con una Y (ya tiene pareja) y regresa." },
    { estado: "q2", lee: "0",  escribe: "0",  mueve: "I", sig: "q2", texto: "Regresa hacia la izquierda pasando por un 0." },
    { estado: "q2", lee: "Y",  escribe: "Y",  mueve: "I", sig: "q2", texto: "Regresa hacia la izquierda pasando por una Y." },
    { estado: "q2", lee: "X",  escribe: "X",  mueve: "D", sig: "q0", texto: "Llegó a la última X: avanza una casilla para buscar el siguiente 0." },
    { estado: "q3", lee: "Y",  escribe: "Y",  mueve: "D", sig: "q3", texto: "Comprueba que solo queden unos emparejados (Y)." },
    { estado: "q3", lee: "□",  escribe: "□",  mueve: "D", sig: "qa", texto: "Llegó al final y todo estaba emparejado: ¡la cadena se acepta!" }
  ],

  etiquetas: {
    q0: "Buscando un 0 sin tachar",
    q1: "Buscando el 1 pareja",
    q2: "Regresando al inicio",
    q3: "Verificando que todo esté emparejado",
    qa: "Cadena aceptada",
    qr: "Cadena rechazada"
  },

  // Motivo de rechazo cuando no existe regla para (estado|símbolo)
  motivos: {
    "q0|□": "La cadena está vacía: se necesita al menos un 0 y un 1 (n > 0).",
    "q0|1": "La cadena empieza con 1, pero debe empezar con 0.",
    "q1|□": "Sobran ceros: no hay un 1 para emparejar con cada 0.",
    "q3|1": "Sobran unos: hay más 1 que 0.",
    "q3|0": "Hay un 0 después de un 1: primero deben ir todos los 0 y luego todos los 1."
  }
});
