//© Zero - Código libre no comercial


// Cargar el SVG y animar los corazones
fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      // Después de la animación de dibujo, mueve y agranda el SVG
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        // Mostrar texto con efecto typing
        setTimeout(() => {
          showDedicationText();
          // Mostrar petalos flotando
          startFloatingObjects();
          // Mostrar cuenta regresiva
          showCountdown();
          // Iniciar música de fondo
          playBackgroundMusic();
        }, 1200); //Tiempo para agrandar el SVG
      }, totalDuration);
    }, 50);

    // Selecciona los corazones (formas rojas)
    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

// Efecto máquina de escribir para el texto de dedicatoria (seguidores)
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { //seguidores
  let text = getURLParam('text');
  if (!text) {
    text = `Para el amor de mi vida:\n\nDesde el primer momento supe que eras tú. Tu sonrisa, tu voz, tu forma de ser… todo en ti me hace sentir en casa.\n\nGracias por acompañarme en cada paso, por entenderme incluso en silencio, y por llenar mis días de amor.\n\nTe amo más de lo que las palabras pueden expresar.`;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      // Al terminar el typing, mostrar la firma animada
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// Firma manuscrita animada
function showSignature() {
  // Cambia para buscar la firma dentro del contenedor de dedicatoria
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con amor, Guillermo";
  signature.classList.add('visible');
}



// Controlador de objetos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    // Posición inicial
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    // Animación flotante
    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    // Eliminar después de animar
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    // Generar más objetos
    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

// Cuenta regresiva o fecha especial
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2023-02-24T00:00:00'); 
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2027-02-24T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `Llevamos juntos desde: <b>${days}</b> días<br>` +
      `Nuestro proximo aniversario es en: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

// --- Música de fondo ---
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  // --- Opción archivo local por parámetro 'musica' ---
  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    // Decodifica y previene rutas maliciosas
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  }

  // --- Opción YouTube (solo mensaje de ayuda) ---
  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    // Muestra mensaje de ayuda para descargar el audio
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = '🔊 Música';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }
  audio.volume = 0.7;
  audio.loop = true;
  // Intentar reproducir inmediatamente
  audio.play().then(() => {
    btn.textContent = '🔊 Música';
  }).catch(() => {
    // Si falla el autoplay, esperar click en el botón
    btn.textContent = '▶️ Música';
  });
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música';
    }
  };
}

// Intentar reproducir la música lo antes posible (al cargar la página)
window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    body {
      margin: 0;
      padding: 0;
      background: #000;
      overflow: hidden;
      height: 100vh;
    }

    .hearts-container {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0; left: 0;
      pointer-events: none;
      z-index: 1;
    }

    .center-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-family: Arial, sans-serif;
      font-size: 2.5rem;
      text-align: center;
      z-index: 2;
      font-weight: bold;
      text-shadow: 0 2px 8px #000;
    }

    @media (max-width: 600px) {
      .center-text {
        font-size: 2.2rem;
      }
      .heart {
        width: 32px !important;
        height: 28px !important;
      }
    }

    .heart {
      position: absolute;
      width: 40px;
      height: 36px;
      pointer-events: none;
      opacity: 0.7;
      z-index: 1;
      animation: floatUp linear forwards;
    }

    .heart-shape {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0; top: 0;
      background: inherit;
      transform: rotate(-45deg);
    }

    .heart-shape::before,
    .heart-shape::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: inherit;
      border-radius: 50%;
    }

    .heart-shape::before {
      top: -50%;
      left: 0;
    }

    .heart-shape::after {
      left: 50%;
      top: 0;
    }

    .cursor {
      display: inline-block;
      width: 1ch;
      animation: blink 1s steps(1) infinite;
      color: #fff;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .love-big {
      display: inline-block;
      font-size: 1.35em;
      transition: font-size 0.4s;
      filter: none;
    }
    </style>
</head>
<body>
  <div class="hearts-container"></div>
  <div class="center-text" id="typewriter"></div>
  <script>
  const colors = [
    "#ff1493", // fucsia puro
    "#ff3fa6", // fucsia claro
    "#ff69b4", // rosa fuerte/fucsia
    "#e75480", // rosa medio
    "#ff4f81", // rosa intenso
    "#d72660", // magenta oscuro
    "#ff2d7a", // fucsia brillante
    "#ff5fa2", // fucsia pastel
    "#ff0080", // fucsia neón
    "#ff85c0"  // rosa pastel
  ];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  // Detecta si es móvil
  function isMobile() {
    return window.innerWidth <= 600;
  }

  function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    const mobile = isMobile();
    const minSize = mobile ? 20 : 20;
    const maxSize = mobile ? 48 : 80;
    const size = randomBetween(minSize, maxSize); // px
    heart.style.width = `${size}px`;
    heart.style.height = `${size * 0.9}px`;
    heart.style.left = `${randomBetween(-10, 100)}vw`;
    heart.style.bottom = `-60px`;
    heart.style.opacity = randomBetween(0.3, 0.9);
    heart.style.zIndex = Math.floor(randomBetween(1, 3));
    heart.style.animationDuration = `${randomBetween(4, 10)}s`;
    heart.style.animationDelay = `${randomBetween(0, 5)}s`;

    // Color
    const color = colors[Math.floor(Math.random() * colors.length)];
    const heartShape = document.createElement('div');
    heartShape.className = 'heart-shape';
    heartShape.style.background = color;
    heartShape.style.filter = `blur(${randomBetween(0, 3)}px)`;

    heart.appendChild(heartShape);

    const wind = randomBetween(-180, 180); 
    const sway1 = randomBetween(-90, 90);
    const sway2 = randomBetween(-120, 120);
    const sway3 = randomBetween(-90, 90);
    const sway4 = randomBetween(-150, 150);
    const rotate1 = randomBetween(-25, 25);
    const rotate2 = randomBetween(-45, 45);

    const animName = `floatUp_${Math.random().toString(36).substr(2, 8)}`;
    const keyframes = `
      @keyframes ${animName} {
        0% {
          transform: translateX(0px) translateY(0) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate1}deg);
          opacity: ${heart.style.opacity};
        }
        15% {
          transform: translateX(${sway1}px) translateY(-15vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate2}deg);
        }
        30% {
          transform: translateX(${sway2}px) translateY(-30vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate1}deg);
        }
        50% {
          transform: translateX(${sway3}px) translateY(-50vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate2}deg);
        }
        70% {
          transform: translateX(${sway4}px) translateY(-70vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate1}deg);
        }
        85% {
          transform: translateX(${wind}px) translateY(-95vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate2}deg);
          opacity: ${heart.style.opacity};
        }
        100% {
          transform: translateX(${wind * 1.2}px) translateY(-110vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate2}deg);
          opacity: 0;
        }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);

    heart.style.animationName = animName;

    heart.addEventListener('animationend', () => {
      heart.remove();
      styleSheet.remove();
      createHeart(); 
    });

    heart.addEventListener('mouseenter', () => {
      heart.style.transition = 'transform 0.2s cubic-bezier(.68,-0.55,.27,1.55), filter 0.2s';
      heart.style.transform += ' scale(1.5)';
      heart.style.filter = 'brightness(1.3) drop-shadow(0 0 12px #fff3)';
    });
    heart.addEventListener('mouseleave', () => {
      heart.style.transition = 'transform 0.2s, filter 0.2s';
      heart.style.transform = heart.style.transform.replace(/scale\(1\.5\)/, '');
      heart.style.filter = '';
    });

    document.querySelector('.hearts-container').appendChild(heart);
  }

  const maxHearts = isMobile() ? 90 : 360;
  let currentHearts = isMobile() ? 20 : 60;
  const particlesPerInterval = isMobile() ? 4 : 14;

  for (let i = 0; i < currentHearts; i++) {
    createHeart();
  }

  const interval = setInterval(() => {
    if (currentHearts < maxHearts) {
      createHeart();
      currentHearts++;
    } else {
      clearInterval(interval);
    }
  }, isMobile() ? 60 : 30);

  function explodeHeart(heart) {
    heart.style.transition = 'transform 0.3s, opacity 0.3s';
    heart.style.transform += ' scale(2) rotate(40deg)';
    heart.style.opacity = 0;
    setTimeout(() => {
      heart.remove();
      createHeart();
    }, 300);
  }

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('heart') || e.target.classList.contains('heart-shape')) {
      const heart = e.target.closest('.heart');
      if (heart) explodeHeart(heart);
    }
  });

  function addTextPulse() {
    const el = document.getElementById('typewriter');
    if (el) {
      el.innerHTML = el.innerHTML.replace(
        /(I love You)/i,
        '<span class="love-big">$1</span>'
      );
    }
  }

  function typeWriterEffect(element, lines, speed = 70, lineDelay = 600) {
    let line = 0, char = 0;
    function type() {
      if (line < lines.length) {
        if (char <= lines[line].length) {
          element.innerHTML =
            lines.slice(0, line).join('<br>') +
            (line > 0 ? '<br>' : '') +
            lines[line].slice(0, char) + '<span class="cursor">|</span>';
          char++;
          setTimeout(type, speed);
        } else {
          char = 0;
          line++;
          setTimeout(type, lineDelay);
        }
      } else {
        element.innerHTML =
          lines[0] + '<br><span class="love-big">' + lines[1] + '</span>';
        addTextPulse();
      }
    }
    type();
  }

  window.addEventListener('DOMContentLoaded', () => {
    const typewriter = document.getElementById('typewriter'); 
    typeWriterEffect(typewriter, ["Eres la novia que siempre quise,", "Te amo Mucho"]);  //Followers
  });


  </script>
</body>
</html>
