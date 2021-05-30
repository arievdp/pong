// requestAnimationFrame calls a callback at 60fps. If the tab isn't active it will stop making calls until it becomes active again

const animate = 
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { 
    window.setTimeout(callback, 1000/60) 
  }

const canvas = document.createElement('canvas')
canvas.className = 'canvas'
const width = 400
const height = 600

canvas.width = width
canvas.height = height

// getContext returns an object that provides methods for drawing and manipulating images and graphics on a canvas element

const context = canvas.getContext('2d')

window.onload = function() {
  document.body.appendChild(canvas)
  animate(step)
  updateDomScores()
}

let player1Score = 0
let player2Score = 0

// the sttep Function updates all objects: players paddle,computers paddle, and the ball. Next it will render those objects. Lastly it will use requestAnimationFrame to call the step function again

function step() {
  update()
  render()
  animate(step)
}

// Pass computer and player paddle to the ball.update function

function update() {
  player.update()
  computer.update(ball)
  ball.update(player.paddle, computer.paddle)
}

let player = new Player();
let computer = new Computer();
let ball = new Ball(200, 300);

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
  this.score = 0
}

function Computer() {
  this.paddle = new Paddle(175, 10, 50, 10);
  this.score = 0
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

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-4, 0);
    } else if (value == 39) { // right arrow
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
  for (var i = touches?.length - 1; i >= 0; i--) {
    let centerX = canvas.offsetLeft + canvas.offsetWidth / 2;
    var touch = touches[i];
    if (touch.screenX < centerX) {
      this.paddle.move(-4, 0);
    } else if (touch.screenX > centerX) {
      this.paddle.move(4, 0);
    }
  };
};


function setPosistion() {
  update();

  
}


Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 400) { // all the way to the right
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
}

// context.arc? 

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#FFFFFF";
  context.fill();
}

// Cleverly sets the ball to be animated by updating it's x/y value each fps

// The collision detection is happening is Axis Aligned Bounding Boxes or AABBs

// If the paddle is moving when it hits the ball, the x_speed is added to the ball. This will cause it to move faster or slower depending on the direction of the ball and the direction of the paddle.

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  let top_x = this.x - 5;
  let top_y = this.y - 5;
  let bottom_x = this.x + 5;
  let bottom_y = this.y + 5;

  if(this.x - 5 < 0) { // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 400) { // hitting the right wall
    this.x = 395;
    this.x_speed = -this.x_speed;
  }

  if(this.y < 0) { // a point was scored Player1
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
    player.score ++
    updateDomScores()
  }

  if(this.y > 600) { // a point was scored compy
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
    computer.score += 1 
    updateDomScores()
  }

  if(top_y > 300) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // hit the player's paddle
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // hit the computer's paddle
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
}

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -4) { // max speed left
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed right
    diff = 5;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 400) {
    this.paddle.x = 400 - this.paddle.width;
  }
};

let keysDown = {}
let dots = {}
let touches

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

document.addEventListener('touchstart', function(event) {
  touches = event.touches
})

document.addEventListener('touchend', function(event) {
  touches = null
})

document.addEventListener('touchmove', function(event) {
  event.preventDefault();
  touches = event.touches;
}, false);

function updateDomScores () {
  document.getElementById('playerScore').innerHTML = player.score;
  document.getElementById('computerScore').innerHTML = computer.score;
}

