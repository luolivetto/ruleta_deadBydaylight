// Lista base de pruebas
const perks = [
  "Sprint", "Autocuración", "Adrenalina", "Fajación", 
  "Déjà Vu", "Evasión Urbana", "Golpe Decisivo", "Vigil",
  "Empatía", "Tenacidad", "Lucha Intensa", "Excitación",
  "Ingenio", "Arrebato", "Construcción Duradera", "Voluntad de Hierro"
];

const colores = ["#005f73", "#0a9396", "#94d2bd", "#e9d8a6", "#ee9b00", "#ca6702", "#bb3e03", "#ae2012"];

const canvas = document.getElementById("ruletaCanvas");
const ctx = canvas.getContext("2d");
const centro = canvas.width / 2;
const radio = centro - 10;

let anguloActual = 0;
let girando = false;

// Dibuja los sectores y el texto radialmente
function dibujarRuleta() {
  const cantSectores = perks.length;
  const anguloSector = (2 * Math.PI) / cantSectores;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < cantSectores; i++) {
    const anguloInicio = anguloActual + i * anguloSector;
    const anguloFin = anguloInicio + anguloSector;

    // Dibujar sector
    ctx.beginPath();
    ctx.moveTo(centro, centro);
    ctx.arc(centro, centro, radio, anguloInicio, anguloFin);
    ctx.fillStyle = colores[i % colores.length];
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#111";
    ctx.stroke();

    // Dibujar texto del nombre de la perk
    ctx.save();
    ctx.translate(centro, centro);
    ctx.rotate(anguloInicio + anguloSector / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Arial";
    ctx.fillText(perks[i], radio - 20, 5);
    ctx.restore();
  }
}

// Lógica de físicas y animación de giro
document.getElementById("btnGirar").addEventListener("click", () => {
  if (girando) return;
  girando = true;
  document.getElementById("textoResultado").innerText = "";

  const vueltas = 5 + Math.random() * 5; // Entre 5 y 10 vueltas
  const gradosTotales = vueltas * 2 * Math.PI;
  const duracion = 4000; // 4 segundos de giro
  const inicioTiempo = performance.now();
  const anguloInicial = anguloActual;

  function animar(tiempoActual) {
    const transcurrido = tiempoActual - inicioTiempo;
    const progreso = Math.min(transcurrido / duracion, 1);
    
    // Curva de desaceleración (Ease-Out)
    const avance = 1 - Math.pow(1 - progreso, 3);

    anguloActual = anguloInicial + gradosTotales * avance;
    dibujarRuleta();

    if (progreso < 1) {
      requestAnimationFrame(animar);
    } else {
      girando = false;
      calcularResultado();
    }
  }

  requestAnimationFrame(animar);
});

// Calcula qué perk cayó según la posición de la aguja (a la derecha)
function calcularResultado() {
  const cantSectores = perks.length;
  const anguloSector = (2 * Math.PI) / cantSectores;
  let anguloNormalizado = (2 * Math.PI - (anguloActual % (2 * Math.PI))) % (2 * Math.PI);
  const indice = Math.floor(anguloNormalizado / anguloSector);

  const perkGanadora = perks[indice];
  document.getElementById("textoResultado").innerText = "¡Ganaste: " + perkGanadora + "!";
}

// Primer renderizado
dibujarRuleta();