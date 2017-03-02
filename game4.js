    
    //holds a reference to the canvas and the context (drawing surface to the canvas)
    var can, ctx;

    //holds x and y for the player
    var dx, dy;

    //holds the velocity for the player
    var vx, vy;

    //holds the health for the player
    var health = 10;

    //sets players motion to static (No Velocity)
    var motion="static";

    //this varible holds a temporary boolean that makes the player invincible for half a second after they have been hit
    var invincible = false;

    //a variable to tell whether the player has been hit or not
    var hit = false;

    // holds angle between the enemies and the player
    var angle =0;
          
    //creates an object to hold the heros velocities
    hero = new Object();

    //object for static velocity
    hero.static = {velocity : {vx:0, vy: 0}};

    //velocity to move the player down
    hero.down = {velocity : {vx:0, vy: 3}};

    //velocity to move the player left
    hero.left = {velocity : {vx:-3, vy: 0}};

    //velocity to move the player right
    hero.right = {velocity : {vx:3, vy: 0}};

    //velocity to move the player up
    hero.up = {velocity : {vx:0, vy: -3}};
    
    //holds the players color
    var color = "blue";
            
    //gets the velocity for the player
    hero.returnAnim = function(str) {
        
        //returns the velocity for specific motion
        return this[str];
        
    };
    
    //holds the players current motion
    var curAnim;

    //holds the game loop / used to stop the animation frames
    var loop;

    //holds the enemies
    var enemies;

    //holds the collectibles
    var points;

    //holds current state of player
    var alive = true;

    //boolean to hold if the player won or lost
    var win = false;

    //holds amount of points left;
    var pointsLeft = 10;

    //called when the body has been loaded
    function init() {
        
        //sets the canvas reference
        this.can =  document.getElementById("canvas");
        
        //sets the context reference for drawing
        this.ctx =  this.can.getContext("2d");
        
        //sets the players x to center x of canvas
        this.dx = this.can.width/2;
				
        //sets the players y to center y of canvas
        this.dy = this.can.height/2;
                
        //calls function to create enemies
        createEnemies();
				
        //calls the function to create collectibles
        createPoints();
        
        //starts the game loop
        gameLoop();
        
    }

    //This loop is called recursively to wipe are redraw the elements on to the canvas
    function gameLoop() {
        
        //clears the canvas
        this.ctx.clearRect(0,0, this.can.width, this.can.height);      
        

        
        //if the player is still alive
        if (this.alive) {
            
            //calls function to draw all the enemy boxes
            drawEnemies();
        
            //calls the function to draw the points
            drawPoints();
            
            //calls function to draw the players box 
            drawSquare();
            
            //calls function to draw the players health on the screen
            drawHealth();
            
            //function that tells the browser that you wish to perform an animation and requests that the browser call this function to update the animation before the next repaint.
            this.loop = requestAnimationFrame(gameLoop);
            
        }
        else if (this.win) {
            console.log("You win");
            stop();
            winning();
        }
        else {
            stop();
            dead();
        }


            
    }
        
    //function to start the animation loop
    function start() {
        
        //if the loop isnt running already
        if (!this.loop) {
            
            //start the loop
            this.loop();
        
        }
    }

    //function to stop the animation loop
    function stop() {
        
        //if the loop is running
        if (this.loop) {
            
            //cancel the animation frame
            window.cancelAnimationFrame(this.loop);
            
            //set the variable equal to undefined
            this.loop = undefined;
            
        }
    }
            
    //function to draw the health bar
    function drawHealth() {
                
        /* draws the health container */ 
            
            this.ctx.beginPath();
            this.ctx.rect(this.can.width - 120, 30, 100, 20);
            this.ctx.fillStyle = "yellow";
            this.ctx.fill();
            this.ctx.closePath();
                
        /* draws the health bar */
                
            this.ctx.beginPath();
            this.ctx.rect(this.can.width-120, 30, health*10, 20);
            this.ctx.fillStyle = "red";
            this.ctx.fill();
            this.ctx.closePath();
                
        /* Draws the health heading */
                
            this.ctx.beginPath();
            this.ctx.font = "16px Arial";
            this.ctx.textAlign = "left";
            this.ctx.fillStyle = "white";
            this.ctx.fillText("Health", this.can.width -120, 20);
            this.ctx.closePath();
                
    }
        
    /* Draws the players square */
    function drawSquare() {
            
        //sets current motion for player
        this.curAnim = hero.returnAnim(motion);
        
        //sets players velocity x to current motion velocity x
        this.vx = this.curAnim["velocity"].vx;
        
        //sets players velocity y to current motion velocity y
        this.vy = this.curAnim["velocity"].vy;
        
        //add the velocity to the players current x position
        this.dx = this.dx + this.vx;
                
        //adds the velocity to the players current y position
        this.dy = this.dy + this.vy;
        
        //sets boundary x so the player can't move off the map x
        if (this.dx > this.can.width-25 || this.dx < 1) {
            
            //minus vx to any vx added 
            this.dx = this.dx - this.vx;
        
        }
        
        //sets boundary y so the player can't move off the map y
        if (this.dy > this.can.height-25 || this.dy < 1) {
            
            //minus vy to any vy added
            this.dy = this.dy - this.vy;
        
        }
        
        /* draws the players square */
        this.ctx.beginPath();
        this.ctx.rect(this.dx, this.dy,25,25);
        this.ctx.fillStyle = "blue";    
        this.ctx.fill();
        this.ctx.strokeStyle = this.color; 
        this.ctx.stroke();
        this.ctx.closePath();
                
    }

    //This function draws the points on to the screen
    function drawPoints() {
        
        //for all the point objects
        for (var i = 0; i < points.length; i++) {
            
            /* Draw arcs for all the of the points */
            this.ctx.beginPath();
            this.ctx.arc(points[i].x, points[i].y, points[i].radius,0, 2*Math.PI);
            this.ctx.fillStyle = "yellow";
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();
            
            //calls the check collision function for the points
            var collected = collectPoints(points[i]);
            
            /*
                If it is returned true a point has been collected 
            */
            
            if (collected) {
                
                //remove this point from the array
                points.splice(i, 1);
                
                //take a point off the total points
                this.pointsLeft = this.pointsLeft - 1;
                
                //if the player collected all the points        
                if (this.pointsLeft < 1) {

                   //stop the animation loop
                    stop();
                    
                    console.log("Points left: " + this.pointsLeft);

                   
                    
                    this.win = true;
                    
                    //call the win screen
                    winning();
                    
                    break;
                }    
                
            }
        }
    }

    /* This function checks the distance between two points*/
    function checkDistance(x1, y1, x2, y2) {
        
        /*        
            The distance formula is:
            d = (x1-x2)² + (y1-y2)²   
        */
        
        var d = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
        
        //returns the result;
        return d;
            
    }
            
            
    /* function to check the angle between the player and the enemies */   
    function checkAngle(x1, y1, x2, y2) {
        
        //sets the difference between enemies x and the players x
        var dx = x2 - x1;
        
        //sets the difference between enemies y and the players y
        var dy = y2 - y1;
        
        //gets the angle between these two using Math.atan2 function
        this.angle = Math.atan2(dy, dx);
        
        //converts the angle to degrees
        this.angle *= 180/Math.PI;
        
    }
            
    /* function for checking if the player hits an enemy */
    function checkCollision(enemy) {
        
       //if the player has no health left         
       if (health < 1) {
           
           //stop the animation loop
            stop();
           
           //call the dead screen
            dead();
        }                
        
        //if the distance between the center point of the enemy and the center point of the player is less than the enemies width divided by two plus the players width divided by two
        else if (checkDistance(enemy.getCenterX(), enemy.getCenterY(), this.dx+12, this.dy+12) < (enemy.getWidth()/2 + 12/2)) {
                 
            //if the player has not been hit already in the last half second
            if (!invincible) {
                
                //take one away from the players health
                health--;
                
                //the player cant be hurt while invincible
                invincible = true;
                
                //set a timer for 500 milisecond (half a second)
                setTimeout(function() {
                    
                    //set the player to fallible again
                    invincible = false;
                    
                }, 500);
            }

        }
    }

    // Checks collision from the player and the points
    function collectPoints(point) {
        
        //if the distance between the center point of the enemy and the center point of the player is less than the enemies width divided by two plus the players width divided by two
        if (checkDistance(point.x, point.y, this.dx+12, this.dy+12) < (point.radius + 12/2)) {
   
            return true;
        }
        
        return false;
        
    }
       
    //returns the smallest of two values
    function getSmallest(l1, l2) {
                
        //if the first value is less than the second
        if (l1 < l2) {
            
            //return the first
            return l1;
        }
        
        //otherwise
        else {
            
            //return the second
            return l2;
        }
    }
    

    //This function checks if an enemy hits another enemy
    function enemyHitsEnemy() {
        
        for (var i =0; i < enemies.length; i++) {
            for (var x =0; x < enemies.length; x++) {
                
                //keeps the enemies bounds being compared to itself
                if (x != i) {
                    
                    //if the distance between the enemies x, y compared to the widths of each enemy
                    if (checkDistance(enemies[i].getDX(), enemies[i].getDY(), enemies[x].getDX(), enemies[x].getDY()) < getSmallest(enemies[i].getWidth(), enemies[x].getWidth())) {
                        
                        //if the first enemy is smaller than the second 
                        if (enemies[i].getWidth() < enemies[x].getWidth()) {
                            
                            /* adds the smaller ones w and h to the larger ones */
                            enemies[x].setWidth(enemies[x].getWidth() + enemies[i].getWidth());
                            enemies[x].setHeight(enemies[x].getHeight() + enemies[i].getHeight());
                            
                            //remove the smaller one from the enemies array
                            enemies.splice(i, 1);
                            
                        }
                        else {
                            
                            /* adds the smaller one to the larger one */
                            enemies[i].setWidth(enemies[i].getWidth() + enemies[x].getWidth());
                            enemies[i].setHeight(enemies[i].getHeight() + enemies[x].getHeight());
                            
                            //removes the smaller enemy from the enemies array
                            enemies.splice(x, 1);
                        }
                    }
                }            
            } //close inside for loop        
        } //closes outside for loop
    }
            
    function drawEnemies() {
        
        // loop through the enemies
        for (var i =0; i < enemies.length; i++) {
            
            //starts the path for the enemies
            this.ctx.beginPath();
            
            //calls the check angle difference between the player and enemy
            checkAngle(this.dx, this.dy, enemies[i].getDX(), enemies[i].getDY());
  
             //sets boundaries so the enemy can't leave the canvas
            if (enemies[i].getDX() > this.can.width-enemies[i].getWidth() || enemies[i].getDX() < 1) {
                
                //takes the vx from the dx
                enemies[i].setDX(enemies[i].getDX() - enemies[i].getVX());
            }
            if (enemies[i].getDY() > this.can.height-enemies[i].getHeight() || enemies[i].getDY() < 1) {
                
                //takes the vy from the dy
                enemies[i].setDY(enemies[i].getDY() - enemies[i].getVY());
            }
                
            //checks if the distance between the middle point of the player and the enemy is less than 300px
            if (checkDistance(this.dx, this.dy, enemies[i].getCenterX(), enemies[i].getCenterY()) < 300) {
                   
                //rounds the float value to an int for comparison
                var intAngle = parseInt(this.angle, 10);

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

                //up and left
                if (intAngle > 0 && intAngle < 90) {
                    //between 0 and 90
                    enemies[i].setVX(-1);
                    enemies[i].setVY(-1);
                }
                
                //up and right
                else if (intAngle > 90 && intAngle < 180) {
                    //between 90 and 180
                    enemies[i].setVX(1);
                    enemies[i].setVY(-1);
                }
                
                //down and left
                else if (intAngle < 0 && intAngle > -90) {
                    //between 0 and -90
                    enemies[i].setVX(-1);
                    enemies[i].setVY(1);
                }

                //down and right
                else if (intAngle < -90 && intAngle > -180) {
                    //between -90 and -180
                    enemies[i].setVX(1);
                    enemies[i].setVY(1);
                }
                
                //straight left;
                else if (intAngle == 0) {
                    enemies[i].setVX(-1);
                    enemies[i].setVY(0);
                }
                
                //straight up
                else if (intAngle == 90) {
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
                        
            //draws the square
            this.ctx.beginPath();
            this.ctx.fillStyle = "green";
            this.ctx.strokeStyle = "green";
            this.ctx.rect(enemies[i].getDX(), enemies[i].getDY(),enemies[i].getWidth(), enemies[i].getHeight());
            this.ctx.stroke();
            this.ctx.fill();

            //closes the path for the enemy
            this.ctx.closePath();
                    
            //checks collision with player
            checkCollision(enemies[i]);  
                    
            //checks if the enemy hits another enemy
            enemyHitsEnemy(); 
                    
        } //
    
    }  //closes drawing enemies


    /* function to create the enemies at the start of the game */
    function createEnemies() {
        
        //creates an array for enemies
        this.enemies = new Array();
        
        //loop to create 20 enemies
        for (var i =0; i < 20; i++) {
            
            //get random x between 0 and canvas x minus the size of the enemy
            var randomX = Math.floor((Math.random() * this.can.width-20));
            
            //get random y between 0 and canvas y minus the size of the enemy
            var randomY = Math.floor((Math.random() * this.can.height-20));
            
            //adds a new enemy at the random coordinates made to the enemies array
            this.enemies[i] = new Enemy(randomX, randomY, 0, 0, 20, 20);
        }
    }

    /* Function that creates 10 points at the end of the game */
    function createPoints() {
        
        //creates an array to hold the point objects
        this.points = new Array();
        
        //loop from 0 to 9
        for (var i =0; i < 10; i++) {
            
            /**
                 * Returns a random integer between min (inclusive) and max (inclusive)
                 * Using Math.round() will give you a non-uniform distribution! 
                 * From Mozilla Site: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random    
                    
                Math.floor(Math.random() * (max - min + 1)) + min;
                    
            */    
            
            
            //creates random x and y for points keeping them on the map
            var randomX = Math.floor((Math.random() * (this.can.width-20+1))+20);
            var randomY = Math.floor((Math.random() * (this.can.height-20+1))+20);
            
            //creates an object holding x, y and a radius for the points
            this.points[i] = {x: randomX, y: randomY, radius: 5};
        
        }
    }

    //Function that is called when you run out of health
    function dead() {
        
        //set this boolean to false to stop the drawing
        this.alive = false;
               
        //makes the screen red
        this.ctx.beginPath();
        this.ctx.fillStyle = "red";
        this.ctx.rect(0, 0, this.can.width, this.can.height); 
        this.ctx.fill(); 
        this.ctx.closePath();
          
        //puts a lose message in the center of the screen
        this.ctx.beginPath();
        this.ctx.font = "60px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Your dead!", this.can.width/2, this.can.height/2);
        this.ctx.closePath();
    }

    function winning() {
                
        //games over
        this.alive = false;
           
        //makes the canvas blue
        this.ctx.beginPath();
        this.ctx.fillStyle = "blue";
        this.ctx.rect(0, 0, this.can.width, this.can.height); 
        this.ctx.fill(); 
        this.ctx.closePath();
         
        //puts a win message in the center of the screen
        this.ctx.beginPath();
        this.ctx.font = "60px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("You win!", this.can.width/2, this.can.height/2);
        this.ctx.closePath();
                
    }
        
    //called on key down with an event
    function checkKeys(e) {
        
        //get the keycode (number representing the keys) from the event
        var keyPressed = e.keyCode;

        //compares the keys pressed to cases for button that change the players direction
        
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
                //anything else
                console.log("default key");
				motion = "static";
        }
    }
