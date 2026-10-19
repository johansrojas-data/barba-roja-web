/* =========================================================
   BARBA ROJA · INTERACCIONES
   Los datos se editan en js/datos.js, no aquí.
   ========================================================= */
(function () {
  "use strict";

  const D = window.BARBAROJA;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const pesos = (n) => "$" + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });
  const escapar = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- WhatsApp ---------- */
  const MENSAJES = {
    consulta: "Hola Barba Roja 👋 Tengo una consulta:"
  };
  const linkWhatsApp = (texto) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(texto)}`;

  $$("[data-wa]").forEach((a) => {
    a.href = linkWhatsApp(MENSAJES[a.dataset.wa] || MENSAJES.consulta);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- Cabecera y menú móvil ---------- */
  const cabecera = $("#cabecera");
  const nav = $("#nav");
  const hamburguesa = $("#hamburguesa");

  const alScroll = () => cabecera.classList.toggle("solida", window.scrollY > 40);
  window.addEventListener("scroll", alScroll, { passive: true });
  alScroll();

  const cerrarMenu = () => {
    nav.classList.remove("abierto");
    hamburguesa.setAttribute("aria-expanded", "false");
    hamburguesa.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
  };
  hamburguesa.addEventListener("click", () => {
    const abrir = !nav.classList.contains("abierto");
    nav.classList.toggle("abierto", abrir);
    hamburguesa.setAttribute("aria-expanded", String(abrir));
    hamburguesa.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = abrir ? "hidden" : "";
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", cerrarMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

  /* ---------- Fotos: se cargan solo si existen en /img ---------- */
  $$("[data-foto]").forEach((el) => {
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url("${el.dataset.foto}")`;
      el.classList.add("con-foto");
    };
    img.src = el.dataset.foto;
  });

  /* ---------- Carta ---------- */
  const tabs = $("#cartaTabs");
  const panel = $("#cartaPanel");

  function pintarCategoria(cat) {
    const esBotella = cat.tipo === "botella";
    const cols = esBotella ? `<div class="carta__cols" aria-hidden="true"><span>Botella</span><span>Media</span></div>` : "";
    const filas = cat.items.map((it, i) => {
      const sello = it.destacado ? `<span class="sello">${cat.id === "cerveza" ? "Cubetazo" : "De la casa"}</span>` : "";
      const nombre = it.destacado && cat.id === "cerveza" ? it.n.replace(/^Cubetazo\s*/, "") : it.n;
      const precios = esBotella
        ? `<span class="producto__precio" aria-label="Botella ${pesos(it.b)}">${pesos(it.b)}</span>
           <span class="producto__precio producto__precio--media" aria-label="Media ${pesos(it.m)}">${pesos(it.m)}</span>`
        : `<span class="producto__precio">${pesos(it.p)}</span>`;
      return `<div class="producto" style="animation-delay:${i * 35}ms">
                <span class="producto__nombre">${escapar(nombre)}${sello}</span>
                <span class="producto__precios">${precios}</span>
              </div>`;
    }).join("");

    panel.innerHTML = `<div class="carta__titulo"><h3>${escapar(cat.nombre)}</h3>${cols}</div>${filas}`;
    panel.setAttribute("aria-labelledby", "tab-" + cat.id);
  }

  function seleccionar(id, enfocar) {
    $$(".carta__tab", tabs).forEach((b) => {
      const activo = b.dataset.id === id;
      b.setAttribute("aria-selected", String(activo));
      b.tabIndex = activo ? 0 : -1;
      if (activo) {
        if (enfocar) b.focus();
        b.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      }
    });
    pintarCategoria(D.carta.find((c) => c.id === id));
  }

  if (D.carta && D.carta.length) {
    tabs.innerHTML = D.carta.map((c) =>
      `<button class="carta__tab" role="tab" id="tab-${c.id}" data-id="${c.id}" aria-controls="cartaPanel">${escapar(c.nombre)}</button>`
    ).join("");
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest(".carta__tab");
      if (b) seleccionar(b.dataset.id);
    });
    tabs.addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
      const ids = D.carta.map((c) => c.id);
      const actual = ids.indexOf(document.activeElement.dataset.id);
      const sig = (actual + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length;
      seleccionar(ids[sig], true);
    });
    // primer render sin mover la página
    const primero = D.carta[0].id;
    $$(".carta__tab", tabs).forEach((b) => {
      b.setAttribute("aria-selected", String(b.dataset.id === primero));
      b.tabIndex = b.dataset.id === primero ? 0 : -1;
    });
    pintarCategoria(D.carta[0]);
  }
  $("#cartaNota").textContent = D.notaCarta || "";
  const cartaOriginal = $("#cartaOriginal");
  if (D.cartaOriginalUrl) cartaOriginal.href = D.cartaOriginalUrl; else cartaOriginal.remove();

  /* ---------- Eventos ---------- */
  const lista = $("#listaEventos");
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const aFecha = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

  const proximos = (D.eventos || [])
    .filter((ev) => ev.fecha && aFecha(ev.fecha) >= hoy)
    .sort((a, b) => aFecha(a.fecha) - aFecha(b.fecha));

  if (proximos.length) {
    lista.innerHTML = proximos.map((ev) => {
      const f = aFecha(ev.fecha);
      const mes = f.toLocaleDateString("es-CO", { month: "short" }).replace(".", "");
      const dia = f.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", "");
      return `<article class="evento revelar">
        ${ev.imagen ? `<div class="evento__img foto" data-foto="${escapar(ev.imagen)}"></div>` : ""}
        <div class="evento__cuerpo">
          <div class="evento__fecha"><small>${escapar(dia)}</small>${f.getDate()}<small>${escapar(mes)}</small></div>
          <div>
            <h3>${escapar(ev.titulo)}</h3>
            ${ev.piso ? `<p class="evento__piso">${escapar(ev.piso)}</p>` : ""}
            ${ev.detalle ? `<p class="evento__detalle">${escapar(ev.detalle)}</p>` : ""}
          </div>
        </div>
      </article>`;
    }).join("");
    $$(".evento [data-foto]", lista).forEach((el) => {
      const img = new Image();
      img.onload = () => { el.style.backgroundImage = `url("${el.dataset.foto}")`; el.classList.add("con-foto"); };
      img.src = el.dataset.foto;
    });
  } else {
    lista.innerHTML = `<div class="eventos__vacio revelar">
      <strong>Próximamente</strong>
      <p>Las próximas fiestas, artistas invitados y noches especiales se anuncian primero en nuestro Instagram.</p>
      <a class="btn btn--rojo" href="${D.redes.instagram}" target="_blank" rel="noopener">Ver en Instagram</a>
    </div>`;
  }

  /* ---------- Ubicación y horarios ---------- */
  const consultaWa = `<a href="${linkWhatsApp(MENSAJES.consulta)}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>`;
  $("#direccion").innerHTML = D.direccion
    ? `${escapar(D.direccion)}<br>${escapar(D.ciudad)}`
    : `${escapar(D.ciudad)}<br><span class="pendiente">Dirección exacta: ${consultaWa}.</span>`;

  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const horario = D.horario || {};
  const hayHorario = Object.keys(horario).length > 0;

  // 18 → "6 p. m." · 26 → "2 a. m." · 18.5 → "6:30 p. m."
  const hora = (x) => {
    const h24 = Math.floor(x) % 24, min = Math.round((x % 1) * 60);
    const h12 = h24 % 12 || 12;
    return `${h12}${min ? ":" + String(min).padStart(2, "0") : ""} ${h24 < 12 ? "a. m." : "p. m."}`;
  };

  // Devuelve { abierto, texto } según la hora del visitante
  function estadoActual(ahora = new Date()) {
    const dia = ahora.getDay();
    const h = ahora.getHours() + ahora.getMinutes() / 60;
    const hoyH = horario[dia];
    const ayerH = horario[(dia + 6) % 7];

    let cierre = null, falta = 0;
    if (hoyH && h >= hoyH[0] && h < hoyH[1]) { cierre = hoyH[1]; falta = cierre - h; }
    else if (ayerH && ayerH[1] > 24 && h + 24 < ayerH[1]) { cierre = ayerH[1]; falta = cierre - 24 - h; }
    if (cierre !== null) {
      return { abierto: true, texto: falta <= 1 ? `Cierra pronto · ${hora(cierre)}` : `Abierto ahora · hasta las ${hora(cierre)}` };
    }
    for (let i = 0; i < 8; i++) {
      const d = (dia + i) % 7, r = horario[d];
      if (r && (i > 0 || h < r[0])) {
        const cuando = i === 0 ? "hoy" : i === 1 ? "mañana" : `el ${DIAS[d]}`;
        return { abierto: false, texto: `Cerrado · Abre ${cuando} a las ${hora(r[0])}` };
      }
    }
    return null;
  }

  function pintarEstado() {
    const e = hayHorario ? estadoActual() : null;
    ["#estadoHero", "#estadoUbicacion"].forEach((sel) => {
      const el = $(sel);
      if (!e) { el.hidden = true; return; }
      el.hidden = false;
      el.textContent = e.texto;
      el.classList.toggle("estado--abierto", e.abierto);
    });
  }

  if (hayHorario) {
    const hoy = new Date().getDay();
    $("#horarios").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
      const r = horario[d];
      return `<div class="horario${r ? "" : " horario--cerrado"}${d === hoy ? " horario--hoy" : ""}">
        <span>${DIAS[d][0].toUpperCase() + DIAS[d].slice(1)}${d === hoy ? " <small>hoy</small>" : ""}</span>
        <strong>${r ? `${hora(r[0])} – ${hora(r[1])}` : "Cerrado"}</strong>
      </div>`;
    }).join("");
  } else {
    $("#horarios").innerHTML = `<p class="pendiente">Horario por confirmar. ${consultaWa} para saber si abrimos hoy.</p>`;
  }
  pintarEstado();
  setInterval(pintarEstado, 60000);

  const busqueda = ["Barba Roja Disco Bar", D.direccion, D.ciudad].filter(Boolean).join(", ");
  const hayCoords = typeof D.lat === "number" && typeof D.lng === "number";
  const destino = hayCoords ? `${D.lat},${D.lng}` : busqueda;
  const llegar = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;

  $("#btnLlegar").href = llegar;
  $("#barraLlegar").href = llegar;
  $("#btnMaps").href = D.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busqueda)}`;
  const waze = $("#btnWaze");
  if (hayCoords) waze.href = `https://waze.com/ul?ll=${D.lat},${D.lng}&navigate=yes`; else waze.remove();

  const mapa = $("#mapa");
  if (D.direccion || hayCoords) {
    mapa.innerHTML = `<iframe title="Mapa de cómo llegar a Barba Roja" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://maps.google.com/maps?q=${encodeURIComponent(destino)}&z=17&hl=es&output=embed"></iframe>`;
  } else {
    mapa.innerHTML = `<div><span class="mapa__pin" aria-hidden="true">📍</span><p class="mapa__ciudad">${escapar(D.ciudad)}</p></div>`;
  }

  // Foto de la fachada: solo aparece si existe img/fachada.jpg
  const fachada = $("#fachada");
  const imgFachada = new Image();
  imgFachada.onload = () => { fachada.hidden = false; };
  imgFachada.src = "img/fachada.jpg";

  /* ---------- Menú: resaltar la sección visible ---------- */
  if ("IntersectionObserver" in window) {
    const enlaces = $$('.nav a[href^="#"]:not(.btn)');
    const espia = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        enlaces.forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => espia.observe(s));
  }

  /* ---------- Redes sociales ---------- */
  const ICONOS = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 4.8a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-9.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/></svg>',
    whatsapp: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.3.6 4.5 1.8 6.4L3 29l7.2-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm5.9 15.3c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 2.9 1.1 3.4.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>',
    threads: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.9 11.1c-.1 0-.2-.1-.3-.1-.2-3-1.8-4.7-4.6-4.7-1.7 0-3.1.7-3.9 2l1.5 1c.6-.9 1.6-1.1 2.4-1.1 1 0 1.7.3 2.1.8.3.4.6 1 .7 1.7-.8-.1-1.7-.2-2.6-.1-2.6.1-4.3 1.7-4.2 3.8.1 1.1.6 2 1.5 2.6.8.5 1.8.8 2.8.7 1.4-.1 2.5-.6 3.2-1.6.6-.7.9-1.7 1-2.9.7.4 1.2.9 1.4 1.6.5 1.1.5 3-1 4.5-1.3 1.3-2.9 1.9-5.3 1.9-2.6 0-4.6-.9-5.9-2.5C4.5 17 3.9 14.8 3.8 12c0-2.8.7-5 1.9-6.6 1.3-1.6 3.3-2.5 5.9-2.5 2.6 0 4.6.9 6 2.5.7.8 1.2 1.8 1.5 3l1.8-.5c-.4-1.4-1-2.7-1.9-3.7-1.8-2.1-4.3-3.2-7.5-3.2C8.3 1 5.8 2.1 4.1 4.2 2.6 6.1 1.8 8.7 1.8 12c0 3.3.8 5.9 2.3 7.8 1.7 2.1 4.2 3.2 7.5 3.2 2.9 0 4.9-.8 6.6-2.4 2.2-2.2 2.2-4.9 1.4-6.6-.5-1.3-1.5-2.3-2.7-2.9zm-4.6 4.6c-1.1.1-2.2-.4-2.3-1.4 0-.8.5-1.6 2.3-1.7h.6c.7 0 1.3.1 1.9.2-.2 2.5-1.4 2.9-2.5 2.9z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.3 6.3 0 1 0 5.3 6.2V8.6a7.9 7.9 0 0 0 4.4 1.4V6.7c-2.4 0-4.4-2-4.4-4.7z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>'
  };
  const redes = [
    D.redes.instagram && { k: "instagram", t: "Instagram", url: D.redes.instagram, cls: "red--ig" },
    { k: "whatsapp", t: "WhatsApp " + D.whatsappVisible, url: linkWhatsApp(MENSAJES.consulta) },
    D.redes.tiktok && { k: "tiktok", t: "TikTok", url: D.redes.tiktok },
    D.redes.facebook && { k: "facebook", t: "Facebook", url: D.redes.facebook },
    D.redes.threads && { k: "threads", t: "Threads", url: D.redes.threads }
  ].filter(Boolean);
  $("#redes-lista").innerHTML = redes.map((r) =>
    `<a class="red ${r.cls || ""}" href="${r.url}" target="_blank" rel="noopener">${ICONOS[r.k]}<span>${escapar(r.t)}</span></a>`
  ).join("");

  /* ---------- Asistente de reservas → WhatsApp ---------- */
  const form = $("#asistente");
  const f = form.elements;
  const pasos = $$(".paso", form);
  const progreso = $$("#progreso li");
  const error = $("#asistenteError");
  const btnAtras = $("#btnAtras");
  const btnSig = $("#btnSiguiente");
  const TOTAL_PASOS = 5;
  const TIPOS = { mesa: "Reserva de mesa", cumple: "Cumpleaños", privado: "Evento privado" };
  const ZONAS = ["Pub", "Crossover", "Rooftop"];
  const ESTADOS = { disponible: "Disponible", pocas: "Últimas mesas", agotado: "Agotado" };
  let paso = 1;
  let otraFecha = false;
  const orden = []; // pre-orden: [{ i: índice del producto, cant }]

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const hoyIso = iso(new Date());
  const radio = (n) => (form.querySelector(`input[name="${n}"]:checked`) || {}).value;
  const tipo = () => radio("tipo");
  const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const fechaLarga = (s) => capital(aFecha(s).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" }));
  const normalizar = (s) => String(s || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // "viernes y sábado" a partir del horario
  const diasAbiertos = [1, 2, 3, 4, 5, 6, 0].filter((d) => horario[d]).map((d) => DIAS[d]);
  const listaDias = diasAbiertos.length > 1
    ? diasAbiertos.slice(0, -1).join(", ") + " y " + diasAbiertos.at(-1)
    : diasAbiertos[0] || "";
  if (listaDias) {
    const r = horario[[1, 2, 3, 4, 5, 6, 0].find((d) => horario[d])];
    $("#reservaHorario").innerHTML = `<strong>Abrimos:</strong> ${listaDias}, ${hora(r[0])} – ${hora(r[1])}`;
  } else {
    $("#reservaHorario").remove();
  }

  /* ---------- Disponibilidad (cupos) ---------- */
  let disponibilidad = [];
  function cargarDisponibilidad(lista) {
    disponibilidad = (lista || []).map((r) => {
      let fecha = String(r.fecha || "").trim();
      const dmy = fecha.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (dmy) fecha = `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
      const z = normalizar(r.zona);
      const e = normalizar(r.estado);
      return {
        fecha,
        zona: ZONAS.find((n) => normalizar(n) === z) || "todo",
        estado: /^(agot|llen|cerr)/.test(e) ? "agotado" : /^(poc|ultim)/.test(e) ? "pocas" : "disponible"
      };
    }).filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.fecha));
  }
  cargarDisponibilidad(D.disponibilidad);

  function estadoZona(fecha, zona) {
    const regs = disponibilidad.filter((r) => r.fecha === fecha);
    const todo = regs.find((r) => r.zona === "todo");
    if (todo && todo.estado === "agotado") return "agotado";
    const propio = regs.find((r) => r.zona === zona);
    return propio ? propio.estado : todo ? todo.estado : "disponible";
  }
  function estadoNoche(fecha) {
    if (!fecha) return "disponible";
    const zonas = ZONAS.map((z) => estadoZona(fecha, z));
    if (zonas.every((e) => e === "agotado")) return "agotado";
    if (zonas.some((e) => e !== "disponible")) return "pocas";
    return "disponible";
  }

  // Hoja de Google publicada como CSV (columnas: fecha, zona, estado)
  if (D.disponibilidadCsv) {
    fetch(D.disponibilidadCsv, { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((txt) => {
        const filas = txt.trim().split(/\r?\n/).map((l) => l.split(",").map((c) => c.replace(/^"|"$/g, "").trim()));
        const cab = filas.shift().map(normalizar);
        const col = (n) => cab.indexOf(n);
        cargarDisponibilidad(filas.map((c) => ({ fecha: c[col("fecha")], zona: c[col("zona")], estado: c[col("estado")] })));
        if (paso === 2) { pintarNoches(); actualizarFecha(); }
      })
      .catch(() => { /* sin conexión a la hoja: se usa la lista de datos.js */ });
  }

  /* ---------- Paso 2: noche, hora, personas y zona ---------- */
  f.fecha.min = hoyIso;

  function proximasNoches(max = 6) {
    const out = [];
    const ahora = new Date();
    const h = ahora.getHours() + ahora.getMinutes() / 60;
    for (let i = 0; i < 35 && out.length < max; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const r = horario[d.getDay()];
      if (r && (i > 0 || h < r[1] - 1)) out.push(iso(d));
    }
    return out;
  }

  function pintarNoches() {
    const noches = hayHorario && tipo() !== "privado" ? proximasNoches() : [];
    $("#campoNoches").hidden = !noches.length;
    $("#campoFecha").hidden = noches.length > 0 && !otraFecha;
    if (!noches.length) return;
    $("#noches").innerHTML = noches.map((fecha) => {
      const d = aFecha(fecha);
      const est = estadoNoche(fecha);
      const activa = !otraFecha && f.fecha.value === fecha;
      return `<button type="button" class="noche noche--${est}${activa ? " activa" : ""}" data-fecha="${fecha}" role="radio" aria-checked="${activa}"
        aria-label="${fechaLarga(fecha)}: ${ESTADOS[est]}">
        <span class="noche__dia">${d.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", "")}</span>
        <span class="noche__num">${d.getDate()}</span>
        <span class="noche__mes">${d.toLocaleDateString("es-CO", { month: "short" }).replace(".", "")}</span>
        <span class="noche__estado">${ESTADOS[est]}</span>
      </button>`;
    }).join("") +
    `<button type="button" class="noche noche--otra${otraFecha ? " activa" : ""}" data-fecha="" role="radio" aria-checked="${otraFecha}">
      <span class="noche__icono" aria-hidden="true">📅</span><span class="noche__estado">Otra fecha</span>
    </button>`;
  }

  $("#noches").addEventListener("click", (e) => {
    const b = e.target.closest(".noche");
    if (!b) return;
    otraFecha = !b.dataset.fecha;
    f.fecha.value = b.dataset.fecha;
    error.textContent = "";
    pintarNoches();
    actualizarFecha();
    if (otraFecha) f.fecha.focus();
  });

  function actualizarFecha() {
    const ayuda = $("#ayudaFecha");
    ayuda.classList.remove("ayuda--alerta");
    $("#avisoAgotado").hidden = true;
    if (!f.fecha.value) { ayuda.textContent = ""; f.hora.innerHTML = ""; pintarZonas(); return; }

    const r = horario[aFecha(f.fecha.value).getDay()];
    // Horas de llegada cada 30 min, hasta una hora antes del cierre
    const [ini, fin] = r || [14, 24];
    const opciones = [];
    for (let x = ini; x <= fin - 1; x += 0.5) opciones.push(x);
    const previa = f.hora.value;
    f.hora.innerHTML = opciones.map((x) => `<option value="${hora(x)}">${hora(x)}</option>`).join("");
    if (opciones.map(hora).includes(previa)) f.hora.value = previa;
    else if (opciones.length > 6) f.hora.value = hora(ini + 3);

    const est = tipo() === "privado" ? "disponible" : estadoNoche(f.fecha.value);
    if (r) {
      ayuda.textContent = `${fechaLarga(f.fecha.value)} · abierto de ${hora(r[0])} a ${hora(r[1])}`;
      if (est === "pocas") ayuda.innerHTML += ' · <strong class="ayuda__pocas">¡Quedan pocas mesas!</strong>';
      if (est === "agotado") $("#avisoAgotado").hidden = false;
    } else if (tipo() === "privado") {
      ayuda.textContent = "Ese día normalmente no abrimos al público. Para eventos privados revisamos la disponibilidad contigo.";
    } else if (hayHorario) {
      ayuda.textContent = `Ese día estamos cerrados. Abrimos ${listaDias}.`;
      ayuda.classList.add("ayuda--alerta");
    } else {
      ayuda.textContent = fechaLarga(f.fecha.value);
    }
    pintarZonas();
  }
  f.fecha.addEventListener("change", () => { error.textContent = ""; actualizarFecha(); });

  function pintarZonas() {
    const fecha = f.fecha.value;
    $$('input[name="piso"]', form).forEach((inp) => {
      const zona = inp.dataset.zona;
      const est = zona && fecha && tipo() !== "privado" ? estadoZona(fecha, zona) : "disponible";
      const chip = inp.closest(".chip");
      chip.dataset.estado = est;
      inp.disabled = est === "agotado";
      const marca = chip.querySelector(".chip__estado");
      if (marca) marca.textContent = est === "agotado" ? "Agotado" : est === "pocas" ? "Últimas" : "";
      if (inp.disabled && inp.checked) form.querySelector('input[name="piso"][value="Sin preferencia"]').checked = true;
    });
  }

  // Lista de espera para noches agotadas
  $("#btnEspera").addEventListener("click", (e) => {
    e.currentTarget.href = linkWhatsApp([
      "*LISTA DE ESPERA · BARBA ROJA*",
      "━━━━━━━━━━━━━━",
      `• Tipo: ${TIPOS[tipo()]}`,
      `• Fecha: ${fechaLarga(f.fecha.value)}`,
      `• Personas: ${f.personas.value}`,
      "━━━━━━━━━━━━━━",
      "Vi en la web que esa noche está agotada. Si se libera una mesa, me gustaría tomarla. ¡Gracias!"
    ].join("\n"));
  });

  function actualizarPersonas() {
    const n = parseInt(f.personas.value, 10) || 0;
    $("#ayudaPersonas").textContent = n >= 20 && tipo() !== "privado"
      ? "Para grupos de 20 o más te recomendamos la opción Evento privado."
      : "";
  }
  const sumar = (input, delta, min, max) => {
    input.value = Math.min(max, Math.max(min, (parseInt(input.value, 10) || min) + delta));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  $$("[data-paso-cant]", form).forEach((b) => b.addEventListener("click", () => sumar(f.personas, +b.dataset.pasoCant, 1, 150)));
  f.personas.addEventListener("input", actualizarPersonas);

  /* ---------- Paso 3: pre-orden con productos de la carta ---------- */
  const productos = [];
  $("#selPedido").insertAdjacentHTML("beforeend", D.carta.map((cat) => {
    const opts = cat.tipo === "botella"
      ? cat.items.flatMap((it) => [[`${it.n} (botella)`, it.b], [`${it.n} (media)`, it.m]])
      : cat.items.map((it) => [it.n, it.p]);
    return `<optgroup label="${escapar(cat.nombre)}">` + opts.map(([n, p]) => {
      productos.push({ n, p });
      return `<option value="${productos.length - 1}">${escapar(n)} — ${pesos(p)}</option>`;
    }).join("") + "</optgroup>";
  }).join(""));

  const totalOrden = () => orden.reduce((s, o) => s + productos[o.i].p * o.cant, 0);

  function pintarOrden() {
    $("#orden").innerHTML = orden.map((o, k) => {
      const p = productos[o.i];
      return `<li>
        <span class="orden__cant">${o.cant}×</span>
        <span class="orden__nombre">${escapar(p.n)}<small>${pesos(p.p)} c/u</small></span>
        <span class="orden__precio">${pesos(p.p * o.cant)}</span>
        <button type="button" class="orden__quitar" data-quitar="${k}" aria-label="Quitar ${escapar(p.n)}">×</button>
      </li>`;
    }).join("");
    const total = $("#ordenTotal");
    total.hidden = !orden.length;
    total.innerHTML = `<span>Total aproximado</span><strong>${pesos(totalOrden())}</strong>`;
  }

  function agregarAlPedido() {
    const sel = $("#selPedido");
    if (sel.value === "") return false;
    const i = +sel.value;
    const cant = parseInt(f.cantidad.value, 10) || 1;
    const ya = orden.find((o) => o.i === i);
    if (ya) ya.cant = Math.min(20, ya.cant + cant); else orden.push({ i, cant });
    sel.value = "";
    f.cantidad.value = 1;
    pintarOrden();
    return true;
  }
  $("#btnAgregar").addEventListener("click", () => {
    if (agregarAlPedido()) { error.textContent = ""; return; }
    error.textContent = "Elige un producto de la carta para agregarlo.";
    $("#selPedido").focus();
  });
  $("#orden").addEventListener("click", (e) => {
    const b = e.target.closest("[data-quitar]");
    if (!b) return;
    orden.splice(+b.dataset.quitar, 1);
    pintarOrden();
  });
  $$("[data-cant-pedido]", form).forEach((b) => b.addEventListener("click", () => sumar(f.cantidad, +b.dataset.cantPedido, 1, 20)));

  /* ---------- Paso 4: recordar nombre y celular en este dispositivo ---------- */
  const leerContacto = () => {
    try {
      const g = JSON.parse(localStorage.getItem("barbaroja-contacto") || "{}");
      f.nombre.value = g.nombre || "";
      f.celular.value = g.celular || "";
    } catch (e) { /* sin almacenamiento: no pasa nada */ }
  };
  leerContacto();

  const soloDigitos = (s) => s.replace(/\D/g, "").replace(/^57(?=3\d{9}$)/, "");
  const celularBonito = (s) => { const d = soloDigitos(s); return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`; };

  /* ---------- Paso 5: condiciones (si el bar las define) ---------- */
  const condiciones = (D.condicionesReserva || []).filter(Boolean);
  if (condiciones.length) {
    $("#condiciones").hidden = false;
    $("#listaCondiciones").innerHTML = condiciones.map((c) => `<li>${escapar(c)}</li>`).join("");
  }

  /* ---------- Validación por paso ---------- */
  const objetivoFecha = () => ($("#campoFecha").hidden ? $(".noche.activa") || $(".noche") : f.fecha);

  function validar(n) {
    const t = tipo();
    if (n === 1 && !t) return ["Elige qué quieres reservar.", form.querySelector('input[name="tipo"]')];
    if (n === 2) {
      if (!f.fecha.value) return ["Elige la fecha.", objetivoFecha()];
      if (f.fecha.value < hoyIso) return ["La fecha no puede ser anterior a hoy.", objetivoFecha()];
      if (t !== "privado") {
        if (hayHorario && !horario[aFecha(f.fecha.value).getDay()]) return [`Ese día estamos cerrados. Abrimos ${listaDias}.`, objetivoFecha()];
        if (estadoNoche(f.fecha.value) === "agotado") return ["Esa noche está agotada. Elige otra fecha o únete a la lista de espera.", objetivoFecha()];
      }
      const p = parseInt(f.personas.value, 10);
      if (!p || p < 1 || p > 150) return ["Indica cuántas personas vienen (1 a 150).", f.personas];
    }
    if (n === 3) {
      if (t === "cumple" && !f.cumpleanero.value.trim()) return ["Escribe el nombre de quien cumple años.", f.cumpleanero];
      agregarAlPedido(); // si eligió un producto y olvidó "Agregar"
    }
    if (n === 4) {
      if (f.nombre.value.trim().length < 3) return ["Escribe tu nombre completo.", f.nombre];
      if (!/^3\d{9}$/.test(soloDigitos(f.celular.value))) return ["Escribe un celular de 10 dígitos que empiece por 3 (ej: 300 123 4567).", f.celular];
      if (!f.mayor.checked) return ["Debes confirmar que eres mayor de edad.", f.mayor];
    }
    if (n === 5 && condiciones.length && !f.acepto.checked) return ["Debes aceptar las condiciones de reserva.", f.acepto];
    return null;
  }

  /* ---------- Contenido de la solicitud (resumen y mensaje) ---------- */
  function secciones() {
    const t = tipo();
    const out = [{
      titulo: "Detalles de la reserva", icono: "📋", filas: [
        ["Tipo", TIPOS[t]],
        ["Fecha", fechaLarga(f.fecha.value)],
        ["Llegada", f.hora.value],
        ["Personas", f.personas.value],
        ["Zona", radio("piso")]
      ]
    }];
    if (t === "cumple") out.push({ titulo: "Cumpleaños", icono: "🎂", filas: [["Cumpleañero(a)", f.cumpleanero.value.trim()], ["Traen torta", radio("torta")]] });
    if (t === "privado") out.push({ titulo: "Evento", icono: "🎉", filas: [["Tipo de evento", f.tipoEvento.value], ["Espacio", f.espacio.value]] });
    if (orden.length) out.push({ titulo: "Pre-orden", icono: "🍾", orden: true });
    if (f.comentarios.value.trim()) out.push({ titulo: "Solicitudes especiales", icono: "📝", texto: f.comentarios.value.trim() });
    out.push({ titulo: "Contacto", icono: "👤", filas: [["Nombre", f.nombre.value.trim()], ["Celular", celularBonito(f.celular.value)]] });
    return out;
  }

  function pintarResumen() {
    $("#resumen").innerHTML = secciones().map((s) => {
      let cuerpo;
      if (s.filas) {
        cuerpo = `<dl>${s.filas.map(([k, v]) => `<div><dt>${escapar(k)}</dt><dd>${escapar(v)}</dd></div>`).join("")}</dl>`;
      } else if (s.orden) {
        cuerpo = `<table class="resumen__orden">
          <thead><tr><th scope="col">Producto</th><th scope="col">Cant.</th><th scope="col">Subtotal</th></tr></thead>
          <tbody>${orden.map((o) => {
            const p = productos[o.i];
            return `<tr><td>${escapar(p.n)}<small>${pesos(p.p)} c/u</small></td><td>${o.cant}</td><td>${pesos(p.p * o.cant)}</td></tr>`;
          }).join("")}</tbody>
          <tfoot><tr><th scope="row" colspan="2">Total aproximado</th><td>${pesos(totalOrden())}</td></tr></tfoot>
        </table>
        <p class="resumen__nota">Valores según la carta vigente.</p>`;
      } else {
        cuerpo = `<p class="resumen__texto">${escapar(s.texto)}</p>`;
      }
      return `<section class="resumen__bloque"><h4><span aria-hidden="true">${s.icono}</span> ${escapar(s.titulo)}</h4>${cuerpo}</section>`;
    }).join("");
  }

  const SEP = "━━━━━━━━━━━━━━";
  function mensaje(cod) {
    const L = ["*BARBA ROJA · Disco-Bar & Rooftop*", SEP, "*SOLICITUD DE RESERVA*", `Código: *${cod}*`];
    secciones().forEach((s) => {
      L.push("", `*${s.icono} ${s.titulo.toUpperCase()}*`);
      if (s.filas) {
        s.filas.forEach(([k, v]) => L.push(`• ${k}: ${v}`));
      } else if (s.orden) {
        orden.forEach((o) => {
          const p = productos[o.i];
          L.push(o.cant > 1
            ? `• ${o.cant} × ${p.n} — ${pesos(p.p)} c/u = *${pesos(p.p * o.cant)}*`
            : `• 1 × ${p.n} — *${pesos(p.p)}*`);
        });
        L.push(`*Total aproximado: ${pesos(totalOrden())}*`, "_Valores según la carta vigente._");
      } else {
        L.push(s.texto);
      }
    });
    if (condiciones.length) L.push("", "✅ Acepto las condiciones de reserva.");
    const enviado = new Date().toLocaleString("es-CO", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
    L.push(SEP, `_Solicitud enviada desde la web · ${enviado}_`, "", "Quedo atento(a) a la confirmación. ¡Gracias!");
    return L.join("\n");
  }

  function codigo() {
    const d = aFecha(f.fecha.value);
    const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let r = "";
    for (let i = 0; i < 3; i++) r += letras[Math.floor(Math.random() * letras.length)];
    return `BR-${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")}-${r}`;
  }

  /* ---------- Navegación entre pasos ---------- */
  function mostrar(n) {
    paso = n;
    pasos.forEach((p) => { p.hidden = +p.dataset.paso !== n; });
    progreso.forEach((li, i) => {
      li.classList.toggle("hecho", i + 1 < n);
      li.classList.toggle("actual", i + 1 === n);
    });
    $("#progreso").hidden = n > TOTAL_PASOS;
    $("#asistenteNav").hidden = n > TOTAL_PASOS;
    btnAtras.style.visibility = n === 1 ? "hidden" : "visible";
    btnSig.textContent = n === TOTAL_PASOS ? "Enviar por WhatsApp" : "Continuar";
    btnSig.classList.toggle("btn--wa", n === TOTAL_PASOS);
    form.classList.toggle("es-cumple", tipo() === "cumple");
    form.classList.toggle("es-privado", tipo() === "privado");
    error.textContent = "";

    if (n === 2) {
      // Por defecto, la próxima noche con mesas disponibles
      if (!f.fecha.value && !otraFecha && tipo() !== "privado" && hayHorario) {
        f.fecha.value = proximasNoches().find((x) => estadoNoche(x) !== "agotado") || "";
      }
      pintarNoches();
      actualizarFecha();
      actualizarPersonas();
    }
    if (n === 5) pintarResumen();

    const titulo = pasos.find((p) => !p.hidden).querySelector("legend, .paso__titulo");
    $("#pasoAnuncio").textContent = n <= TOTAL_PASOS ? `Paso ${n} de ${TOTAL_PASOS}: ${titulo.textContent}` : titulo.textContent;
    if (n > 1) {
      titulo.focus({ preventScroll: true });
      const top = form.getBoundingClientRect().top;
      if (top < 70 || top > window.innerHeight * 0.4) window.scrollTo({ top: window.scrollY + top - 90, behavior: "smooth" });
    }
  }

  function enviar() {
    const cod = codigo();
    const link = linkWhatsApp(mensaje(cod));
    try { localStorage.setItem("barbaroja-contacto", JSON.stringify({ nombre: f.nombre.value.trim(), celular: f.celular.value.trim() })); } catch (e) { /* opcional */ }
    window.open(link, "_blank", "noopener");
    $("#codigoFinal").textContent = cod;
    $("#btnReabrir").href = link;
    mostrar(6);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fallo = validar(paso);
    if (fallo) {
      error.textContent = fallo[0];
      if (fallo[1]) fallo[1].focus();
      return;
    }
    if (paso === TOTAL_PASOS) enviar(); else mostrar(paso + 1);
  });
  btnAtras.addEventListener("click", () => mostrar(Math.max(1, paso - 1)));

  // Elegir el tipo avanza solo al siguiente paso
  $$('input[name="tipo"]', form).forEach((r) => r.addEventListener("change", () => setTimeout(() => mostrar(2), 180)));

  $("#btnNueva").addEventListener("click", () => {
    form.reset();
    orden.length = 0;
    otraFecha = false;
    leerContacto();
    pintarOrden();
    mostrar(1);
  });

  mostrar(1);

  /* ---------- Videos ---------- */
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ahorroDatos = !!(navigator.connection && navigator.connection.saveData);

  // Portada: si el visitante pide menos movimiento o ahorro de datos, queda el fondo estático
  const videoPortada = $(".hero__video");
  if (videoPortada) {
    if (menosMovimiento || ahorroDatos) {
      videoPortada.remove();
    } else {
      videoPortada.addEventListener("error", () => videoPortada.remove());
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([en]) => {
          if (en.isIntersecting) videoPortada.play().catch(() => {}); else videoPortada.pause();
        }).observe(videoPortada);
      }
    }
  }

  // Historias: se reproducen sin sonido al verlas; el sonido se activa de a un video
  const reels = $$(".reel video");
  const pintarSonido = (v) => {
    const b = v.closest(".reel__marco").querySelector(".reel__sonido");
    b.textContent = v.muted ? "🔇" : "🔊";
    b.setAttribute("aria-pressed", String(!v.muted));
    b.setAttribute("aria-label", v.muted ? "Activar sonido" : "Silenciar");
  };
  reels.forEach((v) => {
    const marco = v.closest(".reel__marco");
    const barra = marco.querySelector(".reel__progreso span");
    v.addEventListener("timeupdate", () => { if (v.duration) barra.style.width = (v.currentTime / v.duration) * 100 + "%"; });
    v.addEventListener("error", () => marco.closest(".reel").remove());
    marco.querySelector(".reel__sonido").addEventListener("click", () => {
      const activar = v.muted;
      reels.forEach((o) => { o.muted = true; pintarSonido(o); });
      v.muted = !activar;
      if (activar) { delete v.dataset.pausadoPorUsuario; marco.classList.remove("pausado"); v.play().catch(() => {}); }
      pintarSonido(v);
    });
    // Tocar el video lo pausa o lo reanuda
    v.addEventListener("click", () => {
      if (v.paused) { delete v.dataset.pausadoPorUsuario; v.play().catch(() => {}); marco.classList.remove("pausado"); }
      else { v.dataset.pausadoPorUsuario = "1"; v.pause(); marco.classList.add("pausado"); }
    });
  });
  if (!menosMovimiento && "IntersectionObserver" in window) {
    const vigia = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting && !v.dataset.pausadoPorUsuario) v.play().catch(() => {});
        else if (!en.isIntersecting) { v.pause(); if (!v.muted) { v.muted = true; pintarSonido(v); } }
      });
    }, { threshold: 0.6 });
    reels.forEach((v) => vigia.observe(v));
  } else {
    reels.forEach((v) => { v.controls = true; });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".revelar").forEach((el) => obs.observe(el));
  } else {
    $$(".revelar").forEach((el) => el.classList.add("visible"));
  }

  $("#anio").textContent = new Date().getFullYear();
})();
