# Barba Roja Disco-Bar · Rooftop — Sitio web (versión 1)

Página web oficial de **Barba Roja Disco-Bar / Rooftop** (Madrid, Cundinamarca). Es la primera versión del proyecto: un sitio estático, sin servidor ni base de datos.

## Cómo verla

**Doble clic en `index.html`.** Se abre en el navegador; no hay que instalar nada.

Para el mapa y las tipografías se necesita conexión a internet.

## Qué muestra

- **Portada.** Logo, lema y estado en vivo ("Abierto ahora" o "Abre el viernes a las 6 p. m."), calculado con el horario real.
- **Experiencia.** Los 3 ambientes: Pub, Disco-Bar Crossover y Rooftop.
- **Videos.**
  - En la portada, un video de fondo sin sonido y en bucle.
  - En la sección «Así se vive», tres videos verticales tipo historia (sin planes → el plan → Barba Roja). Se reproducen solos al llegar a ellos, el botón del parlante activa el sonido de uno a la vez y tocar el video lo pausa.
  - En el celular se deslizan como carrusel.
  - Si el visitante tiene activado «reducir movimiento» o el ahorro de datos, los videos no arrancan solos.
- **Carta.** La carta oficial del bar, por categorías, con precios de botella y media.
- **Reservas.** Un asistente de 5 pasos:
  1. Tipo de reserva.
  2. Noche, hora, personas y zona, con cupos ("Disponible", "Últimas mesas", "Agotado") y lista de espera.
  3. Detalles y pre-orden de botellas con el total.
  4. Datos de contacto.
  5. Resumen.

  Al final se arma un mensaje de WhatsApp ordenado, con un código de reserva.
- **Ubicación y horarios.** Mapa, botones "Cómo llegar" (Google Maps y Waze) y horario de la semana.
- **Redes sociales** y barra de accesos rápidos en el celular.

> ⚠️ El botón final de la reserva abre el **WhatsApp real del bar**. Para la demostración se puede llegar hasta el mensaje sin enviarlo.

## Estructura

```
index.html       Estructura de la página
css/styles.css   Diseño (colores de la marca, adaptación a celular)
js/datos.js      Datos editables: carta, precios, horario, contacto, cupos
js/main.js       Interacciones (carta, asistente de reservas, mapa, estado abierto/cerrado)
img/             Logo e imagen para compartir
videos/          portada-fiesta.mp4 (fondo) e historia-1/2/3 (sección «Así se vive»)
```

Hecho con HTML5, CSS3 y JavaScript, sin librerías externas. Toda la información (carta, dirección, horario, WhatsApp) sale de las fuentes oficiales del establecimiento: Instagram, su página de enlaces, la carta publicada y Google Maps.
