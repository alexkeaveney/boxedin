    
    //holds a reference to the canvas and the context (drawing surface to the canvas)
    var can, ctx;

    //holds x and y for the player
    var dx, dy;

    //holds the velocity for the player
    var vx, vy;

    var enemyCenterX, enemyCenterY;
            var heroCenterX, heroCenterY;
            var health = 10;
			var motion="static";
            var invincible = false;
            var hit = false;
            
            hero = new Object();
            hero.static = {velocity : {vx:0, vy: 0}};
            hero.down = {velocity : {vx:0, vy: 3}};
            hero.left = {velocity : {vx:-3, vy: 0}};
            hero.right = {velocity : {vx:3, vy: 0}};
            hero.up = {velocity : {vx:0, vy: -3}};
            var color = "blue";
            
            hero.returnAnim = function(str) {
                return this[str];
            };
            
			var curAnim;
            var loop;
            var enemies;
			var enemiesCreated = true;

			function init() {
                console.log("hello init");
				can =  document.getElementById("canvas")
				ctx =  can.getContext("2d");
				dx = can.width/2;
				dy = can.height/2;
                enemy();
				gameLoop();
			}

            function gameLoop() {
    
                this.loop = requestAnimationFrame(gameLoop);
                ctx.clearRect(0,0, can.width, can.height);      
                drawEnemies();
                drawSquare();
                drawHealth();
            }
            
            function start() {
                if (!this.loop) {
                   loop();
                }
            }

            function stop() {
                if (this.loop) {
                   window.cancelAnimationFrame(this.loop);
                   this.loop = undefined;
                }
            }
            
            function drawHealth()
            {
                
                /* health container */ 
                
                ctx.beginPath();
                ctx.rect(can.width - 120, 30, 100, 20);
                ctx.fillStyle = "yellow";
                ctx.fill();
                ctx.closePath();
                
                /* health bar */
                
                ctx.beginPath();
                ctx.rect(can.width-120, 30, health*10, 20);
                ctx.fillStyle = "red";
                ctx.fill();
                ctx.closePath();
                
                /* health text */
                
                ctx.beginPath();
                ctx.font = "16px Arial";
                ctx.textAlign = "left";
                ctx.fillStyle = "white";
                ctx.fillText("Health",canvas.width -120, 20);
                ctx.closePath();
                
                
            }
            
            function drawSquare() {
            
                curAnim = hero.returnAnim(motion);
                vx = curAnim["velocity"].vx;
                vy = curAnim["velocity"].vy;
                dx = dx + vx;
                dy = dy + vy;
                if (dx > canvas.width-25 || dx < 1) {
                    dx = dx - vx;
                }
                if (dy > canvas.height-25 || dy < 1) {
                    dy = dy - vy;
                }
                ctx.beginPath();
                ctx.rect(dx,dy,25,25);

                if (this.hit) {
                    ctx.fillStyle = "red";  
                    console.log("Red");
                    ctx.fill();
                }
                else {
                    ctx.fillStyle = "blue";    
                    ctx.fill();
                }
                
                ctx.strokeStyle = this.color; 
                ctx.stroke();
                
                ctx.closePath();
                
            }
            
            function getCenterPointHero() {
                heroCenterX = dx + 25/2;
                heroCenterY = dy + 25/2;
            }
            
            function getCenterPointEnemy(enemy) {
                var cx = enemy.getDX() + enemy.getWidth()/2;
                var cy = enemy.getDY() + enemy.getHeight()/2;
                var center = {
                    x: cx,
                    y: cy
                };
                return center;
            }
            
            function checkDistance(x1, y1, x2, y2) {
                var d = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
                return d;
            
            }
            
            var angle =0;
            
            function checkAngle(x1, y1, x2, y2) {
                var dx = x2 - x1;
                var dy = y2 - y1;
                angle = Math.atan2(dy, dx);
                angle *= 180/Math.PI;
            }
            
            function checkCollision(enemy) {
                if (health < 1) {
                    console.log("You lose");
                    stop();
                    dead();
                }                
                else if (checkDistance(enemy.getCenterX(), enemy.getCenterY(), dx+12, dy+12) < (enemy.getWidth()/2 + 12/2)) {
                    console.log("hit");
                    this.hit = true;
                    if (!invincible) {
                        health--;
                        
                        invincible = true;
                        setTimeout(function() {
                            invincible = false;
                        }, 500);
                    }
                    
                    
                    this.color="red";
                }
                else {
                    this.hit = false;
                    this.color = "blue";
                }
            }
            
            function getSmallest(l1, l2) {
                
                if (l1 < l2) {
                    return l1;
                }
                else {
                    return l2;
                }
                
            }
            
            function enemyHitsEnemy() {
                for (var i =0; i < enemies.length; i++) {
                    for (var x =0; x < enemies.length; x++) {
                        
                        if (x != i) {
                            if (checkDistance(enemies[i].getDX(), enemies[i].getDY(), enemies[x].getDX(), enemies[x].getDY()) < getSmallest(enemies[i].getWidth(), enemies[x].getWidth())) {
                                var w;
                                if (enemies[i].getWidth() < enemies[x].getWidth()) {
                                    w = enemies[i].getWidth();
                                    
                                    enemies[x].setWidth(enemies[x].getWidth() + enemies[i].getWidth());
                                    enemies[x].setHeight(enemies[x].getHeight() + enemies[i].getHeight());
                                    enemies.splice(i, 1);
                                }
                                else {
                                    w = enemies[x].getWidth();
                                    enemies[i].setWidth(enemies[i].getWidth() + enemies[x].getWidth());
                                    enemies[i].setHeight(enemies[i].getHeight() + enemies[x].getHeight());
                                    enemies.splice(x, 1);
                                }
                            }
                        }
                        
                    }
                }
            }
            
            function drawEnemies() {
                for (var i =0; i < enemies.length; i++) {
                    ctx.beginPath();
                    checkAngle(dx, dy, enemies[i].getDX(), enemies[i].getDY());
                 enemyHitsEnemy();   
                 checkCollision(enemies[i]);   
                      
                //sets boundaries so the enemy can't leave the canvas
                if (enemies[i].getDX() > canvas.width-enemies[i].getWidth() || enemies[i].getDX() < 1) {
                    enemies[i].setDX(enemies[i].getDX() - enemies[i].getVX());
                }
                if (enemies[i].getDY() > canvas.height-enemies[i].getHeight() || enemies[i].getDY() < 1) {
                    enemies[i].setDY(enemies[i].getDY() - enemies[i].getVY());
                }
                
                //checks if the distance between the middle point of the player and the enemy is less than 300px
                if (checkDistance(dx, dy, enemies[i].getCenterX(), enemies[i].getCenterY()) < 300) {
                   
                    //rounds the float value to an int for comparison
                    var intAngle = parseInt(angle, 10);

            /*
                Box angles defined
                
                        90    
                     ___|___
                     |  |  |
                  0 -|--|--|- 180  
                     |  |  |
                     ---|---        
                       -90
             */     
                  
                    if (intAngle > 0 && intAngle < 90) {
                        //between 0 and 90
                        enemies[i].setVX(-1);
                        enemies[i].setVY(-1);
                    }
                    else if (intAngle > 90 && intAngle < 180) {
                        //between 90 and 180
                        enemies[i].setVX(1);
                        enemies[i].setVY(-1);
                        
                    }
                    else if (intAngle < 0 && intAngle > -90) {
                        //between 0 and -90
                        enemies[i].setVX(-1);
                        enemies[i].setVY(1);
                    }
                    else if (intAngle < -90 && intAngle > -180) {
                        //between -90 and -180
                        enemies[i].setVX(1);
                        enemies[i].setVY(1);
                    }
                    else if (intAngle == 0) {
                        //straight left;
                        enemies[i].setVX(-1);
                        enemies[i].setVY(0);
                    }
                    else if (intAngle == 90) {
                        //straight up
                        enemies[i].setVX(0);
                        enemies[i].setVY(-1);
                    } 
                    else if (intAngle == 180) {
                        //straight right
                        enemies[i].setVX(1);
                        enemies[i].setVY(0);
                    } 
                    else if (intAngle == -90) {
                        //straight down 
                        enemies[i].setVX(0);
                        enemies[i].setVY(1);
                    }

                }
                
                //add the velocity to the enemies current X and Y positions
                    
                enemies[i].setDX(enemies[i].getDX() + enemies[i].getVX());
                enemies[i].setDY(enemies[i].getDY() + enemies[i].getVY());    
                        

                    //makes it green
                    ctx.beginPath();
                    ctx.fillStyle = "green";
                    ctx.strokeStyle = "green";
                    ctx.rect(enemies[i].getDX(), enemies[i].getDY(),enemies[i].getWidth(), enemies[i].getHeight());
                    ctx.stroke();
                    ctx.fill();

                    //closes the path for the enemy
                    ctx.closePath();
                }
            }


            function enemy() {
                this.enemies = new Array();
                for (var i =0; i < 20; i++) {
                    var randomX = Math.floor((Math.random() * can.width));
                    var randomY = Math.floor((Math.random() * can.height));
                    this.enemies[i] = new Enemy(randomX, randomY, 0, 0, 20, 20);
                }
            }

            function dead()
            {

                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.rect(0, 0, can.width, can.height); 
                ctx.fill(); 
                ctx.closePath();
                
                ctx.beginPath();
                ctx.font = "60px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.fillText("Your dead!",canvas.width/2,canvas.height/2);
                ctx.closePath();
            }
            
			function checkKeys(e) {
				var keyPressed = e.keyCode;
				

				/*
				Keycode for arrow keys are. You need to listen to the
				onkeydown event.
	     		left = 37
				up = 38
				right = 39
				down = 40
			    */
			   
			    switch (keyPressed) {
					case (37): //left arrow
						motion = "left";
						break;
                    case (38): //up arrow
                        motion = "up";
                        break;
                    case (39): //right arrow
                        motion = "right";
                        break;
                    case (40): //down arrow
                        motion = "down";
                        break;
                    case (87): //W
                        motion = "up";
                        break;
                    case (65): //A
                        motion = "left";
                        break;
                    case (83): //S
                        motion = "down";
                        break;
                    case (68): //D
                        motion = "right";
                        break;
					default:
						console.log("default key");
						motion = "static";
				}
			}