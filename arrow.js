const nodes = graph.children;
const canvas = document.getElementById("test");

const size = graph.getBoundingClientRect();
const ctx = canvas.getContext("2d");

let graphWidth = size.right - size.left;
let graphHeight = size.bottom - size.top;
canvas.setAttribute("width", graphWidth);
canvas.setAttribute("height", graphHeight);

function toggle() {
  if (canvas.style.width === "50%") {
    canvas.style.width === "100%";
  } else {
    canvas.style.width = "50%";
  }
}

for (let idx = 1; idx < nodes.length - 1; idx++) {
  const loc = nodes[idx].getBoundingClientRect();
  const loc_next = nodes[idx + 1].getBoundingClientRect();

  let sx = (loc.left + loc.right) / 2;
  let sy = loc.bottom;
  let ex = (loc_next.left + loc_next.right) / 2;
  let ey = loc_next.top;

  if (ctx != null) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();

    const arrowWidth = 5;
    const arrowLength = 10;

    let dx = ex - sx;
    let dy = ey - sy;
    let angle = Math.atan2(dy, dx);
    let length = Math.sqrt(dx * dy * 2);

    ctx.translate(ex, ey);
    ctx.rotate(angle);
    ctx.fillstyle = "black";
    ctx.beginPath();
    ctx.moveTo(length - arrowLength, -arrowWidth);
    ctx.lineTo(length, 0);
    ctx.lineTo(length - arrowLength, arrowWidth);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
