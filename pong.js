// requestAnimationFrame calls a callback at 60fps. If the tab isn't active it will stop making calls until it becomes active again

const animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) }

const canvas = document.createElement('canvas')
const width = 400
const height = 600

canvas.width = width
canvas.height = height

// getContext returns an object that provides methods for drawing and manipulating images and graphics on a canvas element

const context = canvas.getContext('2d')

window.onload = function() {
  document.body.appendChild(canvas)
  animate(step)
}

// the sttep Function updates all objects: players paddle,computers paddle, and the ball. Next it will render those objects. Lastly it will use requestAnimationFrame to call the step function again

function step() {
  update()
  render()
  animate(step)
}

function update() {
  ball.update();
}

var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

function render() {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height)
  player.render();
  computer.render();
  ball.render();
}

// Creates a paddle, gives it an x/y position, and an x / y speed

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

// In JavaScript, prototype refers to a system. This system allows you to define properties on objects that can be accessed via the object's instances. When an instance is created, it can call these properties on the instance

function Player() {
  this.paddle = new Paddle(175, 580, 50, 10);
}

function Computer() {
 this.paddle = new Paddle(175, 10, 50, 10);
}

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 5;
}

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

Paddle.prototype.render = function() {
  context.fillStyle = "#FFFFFF";
  context.fillRect(this.x, this.y, this.width, this.height);
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#FFFFFF";
  context.fill();
};

// Cleverly sets the ball to be animated by updating it's x/y value each fps

Ball.prototype.update = function() {
  this.x += this.x_speed;
  this.y += this.y_speed;
};