const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const result = document.getElementById('result');

const names = ['Julián', 'Paula', 'Wendy', 'Santiago']; // 4 personas
const colors = ['#FFDDC1', '#FFABAB', '#FFC3A0', '#FF677D'];
const winningName = 'Santiago'; // Siempre gana Santiago

let startAngle = 0;
let arcSize = (2 * Math.PI) / names.length;
let spinAngle = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let isSpinning = false;

function drawWheel() {
    for (let i = 0; i < names.length; i++) {
        const angle = startAngle + i * arcSize;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2,
            angle,
            angle + arcSize
        );
        ctx.fill();
        ctx.save();
        ctx.translate(
            canvas.width / 2 + Math.cos(angle + arcSize / 2) * 200,
            canvas.height / 2 + Math.sin(angle + arcSize / 2) * 200
        );
        ctx.rotate(angle + arcSize / 2 + Math.PI / 2);
        ctx.fillStyle = '#000';
        ctx.font = "bold 18px Arial";
        ctx.fillText(names[i], -ctx.measureText(names[i]).width / 2, 0);
        ctx.restore();
    }
}

function drawArrow() {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 10, 10);
    ctx.lineTo(canvas.width / 2 + 10, 10);
    ctx.lineTo(canvas.width / 2, 40);
    ctx.fill();
}

function rotateWheel() {
    spinAngle = Math.random() * 10 + 30; // Velocidad inicial mayor
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 5000; // Duración total del giro extendida para un efecto más realista
    isSpinning = true;
    requestAnimationFrame(rotate);
}

function rotate() {
    spinTime += 30;

    // Si el tiempo de giro es mayor o igual al tiempo total, detenemos el giro
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }

    const progress = spinTime / spinTimeTotal;

    // Fórmula para desaceleración realista: empieza rápido y luego desacelera
    const easedProgress = easeOutCubic(progress);

    // Número de vueltas y giro añadido al final
    const spins = 8; // Más vueltas para que parezca más realista
    const finalSpinAngle = spins * 360 + calculateWinningAngleDegrees();

    // Actualizamos el ángulo de la ruleta
    startAngle = (easedProgress * finalSpinAngle * Math.PI) / 180;

    drawWheel();
    drawArrow();

    requestAnimationFrame(rotate); // Continuar animación
}

function stopRotateWheel() {
    const finalAngle = calculateWinningAngle(); // Calcula el ángulo para que siempre gane Santiago
    startAngle = finalAngle; // Establecemos el ángulo final
    drawWheel();
    drawArrow();
    result.textContent = `El ganador es: ${winningName}!`;

    // Mostrar ventana emergente cuando el ganador sea Santiago
    setTimeout(() => {
        alert('The winner is Santiago!');
    }, 500); // Un pequeño retraso para asegurar que se dibuje correctamente antes del alert

    isSpinning = false;
}

function calculateWinningAngle() {
    const index = names.indexOf(winningName);
    const degreesPerSegment = 360 / names.length;
    const winningAngleDegrees = (index * degreesPerSegment) + degreesPerSegment / 2;
    return (winningAngleDegrees * Math.PI) / 180;
}

function calculateWinningAngleDegrees() {
    const index = names.indexOf(winningName);
    const degreesPerSegment = 360 / names.length;
    return (index * degreesPerSegment) + degreesPerSegment / 2;
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3); // Fórmula de desaceleración suave
}

spinButton.addEventListener('click', () => {
    if (!isSpinning) {
        result.textContent = '';
        rotateWheel();
    }
});

// Dibujar la ruleta y la flecha al cargar la página
drawWheel();
drawArrow();
