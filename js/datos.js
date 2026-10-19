/* =========================================================
   BARBA ROJA · DATOS DEL SITIO
   ---------------------------------------------------------
   Este es el ÚNICO archivo que hay que editar para cambiar
   precios, eventos, horarios o datos de contacto.
   - Los precios van sin puntos: 240000  →  se muestra $240.000
   - Si un dato no está confirmado, déjalo vacío: ""
   ========================================================= */

window.BARBAROJA = {

  /* ---------- Contacto ---------- */
  // Número con indicativo de Colombia (57), sin espacios ni "+"
  whatsapp: "573103020223",
  whatsappVisible: "310 302 0223",

  /* ---------- Ubicación y horarios ---------- */
  ciudad: "Madrid, Cundinamarca",
  direccion: "Cl. 23 #12-50, Mz 1 Int 14 Casa 20, La Pincha",
  // Coordenadas exactas del local (tomadas de Google Maps)
  lat: 4.7345364,
  lng: -74.2662946,
  mapsUrl: "https://www.google.com/maps/place/Barba+Roja/@4.7345364,-74.2662946,17z/data=!4m6!3m5!1s0x8e3f797c8389da3b:0xed3b3b1426b4410f!8m2!3d4.7345364!4d-74.2662946!16s%2Fg%2F11v9kbbrbp",

  /* Horario por día. 0 = domingo, 1 = lunes … 6 = sábado.
     Formato 24 horas: [apertura, cierre]. Si cierra después de
     medianoche se suma 24 (2 a. m. = 26). Día sin horario = cerrado. */
  horario: {
    5: [18, 26],   // viernes 6:00 p. m. – 2:00 a. m.
    6: [18, 26]    // sábado  6:00 p. m. – 2:00 a. m.
  },

  /* ---------- Disponibilidad de reservas ----------
     Cuando una noche o un piso se llene, márcalo aquí:
       zona:   "todo"  o  "Pub" / "Crossover" / "Rooftop"
       estado: "agotado" → no deja reservar (ofrece lista de espera)
               "pocas"   → muestra "Últimas mesas"
     Ejemplos:
       { fecha: "2026-10-24", zona: "todo",    estado: "agotado" },
       { fecha: "2026-10-23", zona: "Rooftop", estado: "pocas" }      */
  disponibilidad: [
  ],

  /* Opcional (recomendado): manejar la disponibilidad desde el celular
     con una hoja de Google Sheets con columnas  fecha | zona | estado
     publicada como CSV (Archivo → Compartir → Publicar en la web → CSV).
     Pega aquí el enlace. Si está lleno, manda la hoja y no la lista de arriba. */
  disponibilidadCsv: "",

  /* Condiciones que el cliente debe aceptar antes de enviar la reserva.
     Déjalo vacío hasta que el bar las confirme. Ejemplos:
       "La mesa se guarda hasta 30 minutos después de la hora de llegada.",
       "Para grupos de más de 10 personas se pide un abono."            */
  condicionesReserva: [
  ],

  /* ---------- Redes sociales oficiales ---------- */
  redes: {
    instagram: "https://www.instagram.com/barbarojadiscobar/",
    threads: "https://www.threads.com/@barbarojadiscobar",
    tiktok: "",           // pendiente de confirmar
    facebook: ""          // pendiente de confirmar
  },

  // Carta original publicada por el establecimiento
  cartaOriginalUrl: "https://heyzine.com/flip-book/30df4aa7fa.html",

  /* ---------- Eventos ----------
     Agrega solo eventos confirmados. Ejemplo:
     { fecha: "2026-11-07", titulo: "Noche Crossover", piso: "Piso 2",
       detalle: "DJ invitado toda la noche", imagen: "img/eventos/crossover.jpg" }
     Los eventos con fecha pasada se ocultan solos. */
  eventos: [],

  /* ---------- Carta ----------
     tipo "botella": precios de botella y media
     tipo "simple":  un solo precio                       */
  carta: [
    {
      id: "whisky", nombre: "Whisky", tipo: "botella",
      items: [
        { n: "Buchanan's", b: 240000, m: 140000 },
        { n: "Old Parr", b: 230000, m: 125000 },
        { n: "Jack Daniel's Honey", b: 210000, m: 115000 },
        { n: "Jack Daniel's Tradicional", b: 210000, m: 115000 },
        { n: "Jägermeister", b: 170000, m: 100000 },
        { n: "Sello Rojo", b: 150000, m: 90000 }
      ]
    },
    {
      id: "tequila", nombre: "Tequila", tipo: "botella",
      items: [
        { n: "Jimador", b: 190000, m: 100000 },
        { n: "José Cuervo", b: 170000, m: 95000 },
        { n: "Olmeca", b: 170000, m: 95000 }
      ]
    },
    {
      id: "ron", nombre: "Ron", tipo: "botella",
      items: [
        { n: "Viejo de Caldas", b: 135000, m: 70000 },
        { n: "Medellín Dorado", b: 130000, m: 70000 },
        { n: "Bacardí", b: 125000, m: 65000 }
      ]
    },
    {
      id: "aguardiente", nombre: "Aguardiente", tipo: "botella",
      items: [
        { n: "Amarillo", b: 135000, m: 75000 },
        { n: "Antioqueño Azul", b: 135000, m: 75000 },
        { n: "Antioqueño Rojo", b: 135000, m: 75000 },
        { n: "Antioqueño Verde", b: 130000, m: 70000 },
        { n: "Néctar Verde", b: 110000, m: 60000 },
        { n: "Cristal XS", b: 100000, m: 60000 }
      ]
    },
    {
      id: "vodka", nombre: "Vodka", tipo: "botella",
      items: [
        { n: "Smirnoff Lulo", b: 120000, m: 70000 }
      ]
    },
    {
      id: "cocteles", nombre: "Cócteles", tipo: "simple",
      items: [
        { n: "Pecera", p: 75000 },
        { n: "Corona Sunrise", p: 35000 },
        { n: "Mojito Jäger", p: 35000 },
        { n: "Barba Roja", p: 30000, destacado: true },
        { n: "Margarita", p: 30000 },
        { n: "Blue Shark", p: 30000 },
        { n: "Paradise", p: 30000 },
        { n: "Mojito", p: 30000 },
        { n: "Cuba Libre", p: 30000 },
        { n: "Tequila Sunrise", p: 30000 },
        { n: "Granizado + licor", p: 18000 }
      ]
    },
    {
      id: "cerveza", nombre: "Cerveza", tipo: "simple",
      items: [
        { n: "Corona", p: 12000 },
        { n: "Coronita", p: 7000 },
        { n: "Águila", p: 6000 },
        { n: "Budweiser", p: 6000 },
        { n: "Michelada", p: 3000 },
        { n: "Cubetazo Coronita (10 polas)", p: 65000, destacado: true },
        { n: "Cubetazo Águila (10 polas)", p: 56000, destacado: true },
        { n: "Cubetazo Budweiser (10 polas)", p: 54000, destacado: true }
      ]
    },
    {
      id: "combos", nombre: "Combos", tipo: "simple",
      items: [
        { n: "1 botella + ½ Aguardiente Amarillo + six Budweiser", p: 230000 },
        { n: "1 botella + ½ Ron Dorado + six Budweiser", p: 225000 },
        { n: "1 botella + ½ Aguardiente Antioqueño Verde + six Budweiser", p: 220000 }
      ]
    },
    {
      id: "otros", nombre: "Otros", tipo: "simple",
      items: [
        { n: "Four Loko", p: 25000 },
        { n: "Electrolit", p: 15000 },
        { n: "Smirnoff Ice", p: 14000 },
        { n: "Granizado", p: 14000 },
        { n: "Red Bull", p: 12000 },
        { n: "Gatorade", p: 6000 },
        { n: "Coca-Cola", p: 6000 },
        { n: "Agua", p: 4000 }
      ]
    }
  ],

  notaCarta: "Acompañamiento por botella: botella de agua o botella de Coca-Cola."
};
