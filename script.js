const canvas = document.getElementById('mesh');
const ctx = canvas.getContext('2d');
let width = 0;
let height = 0;
let nodes = [];

function resize() {
  width = canvas.width = window.innerWidth * devicePixelRatio;
  height = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  const count = Math.min(110, Math.floor(window.innerWidth / 13));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.34 * devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.34 * devicePixelRatio,
    r: (Math.random() * 1.5 + 0.6) * devicePixelRatio
  }));
}

function drawGrid(time) {
  const gap = 72 * devicePixelRatio;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 106, 0, 0.07)';
  ctx.lineWidth = 1 * devicePixelRatio;
  const offset = (time / 34) % gap;
  for (let x = -gap; x < width + gap; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x - height * 0.22 + offset, height);
    ctx.stroke();
  }
  for (let y = -gap; y < height + gap; y += gap) {
    ctx.beginPath();
    ctx.moveTo(0, y + offset);
    ctx.lineTo(width, y - width * 0.08 + offset);
    ctx.stroke();
  }
  ctx.restore();
}

function draw(time) {
  ctx.clearRect(0, 0, width, height);
  drawGrid(time);

  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const max = 150 * devicePixelRatio;
      if (d < max) {
        const alpha = (1 - d / max) * 0.22;
        ctx.strokeStyle = `rgba(255, 106, 0, ${alpha})`;
        ctx.lineWidth = 1 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (const node of nodes) {
    ctx.fillStyle = 'rgba(255, 154, 61, 0.65)';
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize, { passive: true });
resize();
requestAnimationFrame(draw);
