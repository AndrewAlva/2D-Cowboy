// SETUP GAME CANVAS

	// Speed of render (Frames per second)
	var FPS = 30;
	setInterval(function(){
		update();
		draw();
	},1000/FPS);


	// Setup Canvas Play Area
	var canvasWidth = 1280;
	var canvasHeight = 720;

	var c = document.getElementById("playArea");
	c.setAttribute("width", canvasWidth);
	c.setAttribute("height", canvasHeight);
	var ctx = c.getContext("2d");

// END SETUP CANVAS





// SETUP PLAYER
	// PLAYER PROPERTIES VALUES
	var widthPlayer = 15;
	var heightPlayer = 130;
	var posXPlayer = canvasWidth / 2;
	var posYPlayer = canvasHeight - (heightPlayer);
	var jumpPower = 0;
	var jumpBoolean = false;
	var jumpUp = false;
	var jumpDown = false;


	var player = {
		color: "#00A",
		x: posXPlayer,
		y: posYPlayer,
		width: widthPlayer,
		height: heightPlayer,
		lookRight: true,
		speed: 10,
		
		draw: function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		},
		moveRight: function(){
			this.x += this.speed;
			this.lookRight = true;
		},
		moveLeft: function(){
			this.x -= this.speed;
			this.lookRight = false;
		},

		gravity: 1,
		jumpHeight: 13, 

		jumping: function(){
			this.y += jumpPower;

			if (jumpBoolean && jumpUp){
				jumpPower -= player.gravity;

				if (jumpPower <= player.jumpHeight * -1){
					jumpUp = false;
					jumpDown = true;
				}
			}

			if (jumpBoolean && jumpDown){
				jumpPower += player.gravity;

				if (player.y >= canvasHeight - (heightPlayer)) {
					jumpDown = false;
					jumpBoolean = false;
					jumpPower = 0;
				}
			}
		},

		bullets:[],
		shoot: function(){
			var bulletPosition = this.midpoint();

			if (player.lookRight){
				player.bullets.push(Bullet({
					speed: 5,
					x: bulletPosition.x,
					y: bulletPosition.y
				}));

			} else {
				player.bullets.push(Bullet({
					speed: -5,
					x: bulletPosition.x,
					y: bulletPosition.y
				}));
			}
		},
		midpoint: function(){
			return {
				x: this.x + this.width/2,
				y: this.y + this.height/2 + 10
			};
		}

		
	};


// END PLAYER





// KEY PRESS CONTROLS
	Mousetrap.bind("right", function() {
		player.moveRight();
	});

	Mousetrap.bind("left", function() {
		player.moveLeft();
	});

	Mousetrap.bind("up", function() {
		if (jumpBoolean == false) {
			jumpBoolean = true;
			jumpUp = true;
		}
	});

	Mousetrap.bind("space", function() {
		player.shoot();
	});

	// // konami code!
	// Mousetrap.bind('left down right enter', function() {
	//     testMT('Hadou Ken!');
	// });

	// function testMT (keyPressed) {
	// 	alert('Mousetrap working, key pressed: ' + keyPressed);
	// }
// END KEY PRESS CONTROLS





// SHOOTING OBJECTS
	function Bullet(I) {
		I.active = true;

		I.xVelocity = I.speed;
		I.yVelocity = 0;
		I.width = 20;
		I.height = 3;
		I.color = "#ff0000";

		// PLAY AREA LIMITS
		I.inBounds = function() {
			return I.x >= 0 && I.x <= canvasWidth &&
			I.y >= 0 && I.y <= canvasHeight;
		};

		// DRAW BULLETS
		I.draw = function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		};

		// BULLET MOVEMENT
		I.update = function() {
			I.x += I.xVelocity;
			I.y += I.yVelocity;

			I.active = I.active && I.inBounds();
		};

		return I;
	}
// END SHOOTING


// ENEMIES OBJECTS
	enemiesA = [];

	function EnemyA(I) {
		I = I || {};

		I.active = true;

		I.color = "#ffff00";

		I.width = 15;
		I.height = 90;

		I.x = canvasWidth - I.width;
		I.y = canvasHeight - I.height;
		I.xVelocity = -2
		I.yVelocity = 0;


		I.inBounds = function() {
			return I.x >= 0 && I.x <= canvasWidth &&
			I.y >= 0 && I.y <= canvasHeight;
		};

		I.draw = function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		};

		I.update = function() {
			I.x += I.xVelocity;
			I.y += I.yVelocity;

			I.xVelocity = -5;


			I.active = I.active && I.inBounds();
		};

		I.explode = function() {
		    this.active = false;
		};

		return I;

		
	};


	enemiesB = [];

	function EnemyB(I) {
		I = I || {};

		I.active = true;

		I.color = "#00ffff";

		I.width = 20;
		I.height = 60;

		I.x = I.width;
		I.y = canvasHeight - I.height;
		I.xVelocity = 1.5
		I.yVelocity = 0;


		I.inBounds = function() {
			return I.x >= 0 && I.x <= canvasWidth &&
			I.y >= 0 && I.y <= canvasHeight;
		};

		I.draw = function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		};

		I.update = function() {
			I.x += I.xVelocity;
			I.y += I.yVelocity;

			I.xVelocity = 5;


			I.active = I.active && I.inBounds();
		};

		I.explode = function() {
		    this.active = false;
		};

		return I;
	};
// END ENEMIES


// OBSTACLES OBJECTS
	// GENERAL SETUP
	var obstaclesWidth = 50;
	var obstaclesHeight = 50;
	var obstacleX = Math.random() * canvasWidth;
	if (obstacleX >= canvasWidth / 2 - (player.width / 2 ) && obstacleX <= canvasWidth / 2 + (player.width / 2) ){
		obstacleX += player.width * 2; 
	}

	var obstacle2X = Math.random() * canvasWidth;
	if (obstacle2X >= canvasWidth / 2 - (player.width / 2 ) && obstacle2X <= canvasWidth / 2 + (player.width / 2) ){
		obstacle2X += player.width * 2; 
	}

	var obstaclesY = canvasHeight - obstaclesHeight;

	// OBSTACLE 1 SETUP
	var obstacle1 = {
		color: "#99ff00",
		x: obstacleX,
		y: obstaclesY,
		width: obstaclesWidth,
		height: obstaclesHeight,

		draw: function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		},
	};

	// OBSTACLE 2 SETUP
	var obstacle2 = {
		color: "#ff00ff",
		x: obstacle2X,
		y: obstaclesY,
		width: obstaclesWidth,
		height: obstaclesHeight,

		draw: function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		},
	};
// END OBSTACLES






// COLLISION DETECTION
	function collides(a, b) {
		return a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y;
	}

	function handleCollisions() {
		// COLLISIONS WITH ENEMY A
		player.bullets.forEach(function(bullet) {
			enemiesA.forEach(function(enemy) {
				if (collides(bullet, enemy)) {
					enemy.explode();
					bullet.active = false;
				}
			});
		});

		enemiesA.forEach(function(enemy) {
			if (collides(enemy, player)) {
				enemy.explode();
				player.explode();
			}
		});

		// COLLISIONS WITH ENEMY B
		player.bullets.forEach(function(bullet) {
			enemiesB.forEach(function(enemy) {
				if (collides(bullet, enemy)) {
					enemy.explode();
					bullet.active = false;
				}
			});
		});

		enemiesB.forEach(function(enemy) {
			if (collides(enemy, player)) {
				enemy.explode();
				player.explode();
			}
		});
	}
// END COLLISION

// EXPLODE ACTIONS
	player.explode = function(){
		this.active = false;
	}
// END EXPLODES



// SETUP GAME RENDER CYCLES
	function update (x) {
		// ANIMATION JUMPING PLAYER
		player.jumping();


		// BULLETS MOVE
		player.bullets.forEach(function(bullet) {
			bullet.update();
		});

		player.bullets = player.bullets.filter(function(bullet) {
			return bullet.active;
		});


		// ENEMIES MOVE
			// ENEMIES A
			enemiesA.forEach(function(enemy) {
				enemy.update();
			});

			enemiesA = enemiesA.filter(function(enemy) {
				return enemy.active;
			});

			if(Math.random() < 0.03) {
				enemiesA.push(EnemyA());
			}

			// ENEMIES B MOVE
			enemiesB.forEach(function(enemy) {
				enemy.update();
			});

			enemiesB = enemiesB.filter(function(enemy) {
				return enemy.active;
			});

			if(Math.random() < 0.03) {
				enemiesB.push(EnemyB());
			}
		// END ENEMIES MOVE


		// COLLISIONS DETECTION
			handleCollisions();
		// END COLLISIONS
	}

	function draw (x) {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  		player.draw();
  		obstacle1.draw();
  		obstacle2.draw();

  		// BULLETS
  		player.bullets.forEach(function(bullet) {
			bullet.draw();
		});

  		// ENEMIES
			// ENEMIES A
			enemiesA.forEach(function(enemy) {
		    	enemy.draw();
			});

			// ENEMIES B
			enemiesB.forEach(function(enemy) {
		    	enemy.draw();
			});
		// END ENEMIES
	}
// END RENDER CYCLES