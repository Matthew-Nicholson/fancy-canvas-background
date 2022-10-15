'use strict';

// Get canvas
const canvas = document.getElementById('canvas');
// Get context
const ctx = canvas.getContext('2d');
// Prepare canvas
const prepareCanvas = () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
prepareCanvas();

// Mouse
let mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};
let lastUpdate = Date.now();
window.addEventListener('mousemove', (e) => {
  if (Date.now() - lastUpdate < 1000 / 60) return; // Update coordinates at 60fps.
  lastUpdate = Date.now();
  mouse.x = e.x;
  mouse.y = e.y;
});

// =====================
// ===== VARIABLES =====
// =====================
let numberOfLines = window.innerWidth * 0.05;
numberOfLines > 150 ? (numberOfLines = 150) : (numberOfLines = numberOfLines);
const dotSize = 1;
const colors = ['#FF3F8E', '#04C2C9', '#2E55C1'];
let randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};
const lineLength = () => {
  return window.innerWidth;
};
const startingXCoordinate = () => {
  return Math.round(Math.random() * window.innerWidth);
};
const startingYCoordinate = () => {
  return Math.round(Math.random() * window.innerHeight);
};

// Helpers
const getDistanceFromPoint = function (x1, x2, y1, y2) {
  var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt(a * a + b * b);
};

// Define lines
function Line(startX, startY, length, degrees, dotColor) {
  this.angle = degrees * (Math.PI / 180); // Convert degrees to radians
  this.startX = startX;
  this.startY = startY;
  this.endX = startX + length * Math.cos(this.angle); // cosine finds adjacent value using angle and hypotenuse.
  this.endY = startY + length * Math.sin(this.angle); // sin finds opposite length given the angle and hypotenuse.
  this.length = length;
  this.dotColor = dotColor;
  this.brightness = 0.1;
  this.radians = Math.random(Math.PI * 2);
  this.velocity = 0.0022;
  //Methods
  this.getDistanceFromMouse = function (x, y, x1, y1, x2, y2) {
    //x and y are mouse coordinates.
    //x1, x2, y1, y2 represent the line segment.
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0)
      //in case of 0 length line
      param = dot / len_sq;

    var xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  this.setBrightness = function () {
    let distance = this.getDistanceFromMouse(
      mouse.x,
      mouse.y,
      this.startX,
      this.startY,
      this.endX,
      this.endY
    );
    if (distance < 50) {
      if (this.brightness < 0.3) this.brightness += 0.01; // 0.015 is default
    } else {
      if (this.brightness > 0.1) this.brightness -= 0.0075; // 0.01 is default
    }
  };
  this.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.brightness})`;
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = this.dotColor;
    ctx.arc(this.startX, this.startY, dotSize, 0, 2 * Math.PI);
    ctx.fill();
  };
  this.animate = function () {
    //Move points over time
    this.radians += this.velocity;
    this.startX =
      startX +
      Math.cos(this.radians) *
        ((getDistanceFromPoint(
          startX,
          startY,
          window.innerWidth / 2,
          window.innerHeight / 2
        ) *
          1) /
          Math.PI);
    this.startY = startY + Math.sin(this.radians) * 100;
    this.endX = this.startX + length * Math.cos(this.angle);
    this.endY = this.startY + length * Math.sin(this.angle);
    this.setBrightness();
    this.draw();
  };
}

// Draw lines
let lines = [];
for (let i = 0; i < numberOfLines; i++) {
  let line = new Line(
    startingXCoordinate(),
    startingYCoordinate(),
    lineLength(),
    -60, //Angle in degrees
    randomColor()
  );
  line.draw();
  lines.push(line);
}

// Animate lines

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    line.animate();
  }

  window.requestAnimationFrame(animate);
}

// Init
window.requestAnimationFrame(animate);

// Handle resize
window.addEventListener('resize', () => {
  prepareCanvas();
});
