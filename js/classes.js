class SpriteBackground {
  constructor({ position, imageSrc}) {
    this.position = position;
    this.width = 1280;
    this.height = 720;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {    
  c.drawImage(this.image, this.position.x, this.position.y, 1280, 720);
  this.position.x = 0
  }

  update() {
    this.draw();  
  }
}


///
class Sprite{
  constructor({position,imageSrc, scale = 1, framesMax = 1 ,offset = {x:0,y:0}}) {
      this.position = position;
      this.width = 50;
      this.height = 150;
      this.image = new Image()
      this.image.src = imageSrc
      this.scale = scale
      this.framesMax = framesMax
      this.framesCurrent = 0
      this.framesElapsed = 0
      this.framesHold = 40
      this.offset = offset
      this.originalOffsetX = offset.x;
      this.originalOffsetY = offset.y
      this.isAnimationPaused = false; 
      
  }

  //draw method 
  draw() {
      c.drawImage(
        this.image, 
        //this code is calculating the frames for spritesheets
        //sprite animation "cropping technique for html canvas"
        //current frame * current image width / how many frames there are
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax, 
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.framesMax) * this.scale,
        this.image.height * this.scale
      )

         // Draw attack hitbox if attacking
         if (this.isAttacking) {
          c.fillStyle = "green";
          c.fillRect(
            this.attackBox.position.x +this.attackBox.offset.x, // Use attackBox offset
            this.attackBox.position.y + this.attackBox.offset.y,
            this.attackBox.width,
            this.attackBox.height
          );
        }
  } 

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      this.framesCurrent = (this.framesCurrent + 1) % this.framesMax;
    }
  }

  //update method
  update() {
      this.draw();
      this.animateFrames();

  }

  pauseAnimation() {
    this.isAnimationPaused = true;
  }

  resumeAnimation() {
    this.isAnimationPaused = false;
  }
}

class Player extends Sprite {
  constructor({
    width,
    height,
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined }
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.lastKey;
    this.color = color;
    this.isAttacking;
    this.isHeavyAttacking;
    this.isParry;
    this.health = 100;
    this.isDodging;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 15;
    this.sprites = sprites;
    this.isParryKeyHeld = false;
    this.facingRight = true;
    this.isParryAnimationComplete = false;
    this.holdParryFrame = false;

    // Store original offset
    this.originalOffsetX = offset.x;
    this.originalOffsetY = offset.y;

    // Attack box initialization
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    };

    // Parry box initialization
    this.parryBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: { x: 0, y: 0 },
      width: 125,
      height: 125,
    };

    // Load sprites
    for (const sprite in sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );

    // Draw attack hitbox if attacking
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  animateFrames() {
    this.framesElapsed++;
    
    if (this.framesElapsed % this.framesHold === 0) {
        // For parry animation, stop at last frame
        if (this.image === this.sprites.parry.image) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            }
        } 
      
    }
}

  update() {
    this.draw();
    this.animateFrames();

    // Update attack box position based on facing direction
    if (this.facingRight) {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    } else {
      this.attackBox.position.x = this.position.x - this.attackBox.width + 25;
    }
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Update parry box position
    this.parryBox.position.x = this.position.x + this.parryBox.offset.x;
    this.parryBox.position.y = this.position.y + this.parryBox.offset.y;

    // Gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 50) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }

    // Update position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Horizontal boundaries
    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.width >= canvas.width) {
      this.position.x = canvas.width - this.width;
    }

    // Vertical boundaries
    if (this.position.y + this.velocity.y <= 0) {
      this.position.y = 0;
      this.velocity.y = -Math.abs(this.velocity.y);
      this.velocity.y += 2;
    }

    // Reset dodge velocity
    if (this.isDodging && this.velocity.x === 1) {
      this.velocity.x = 0;
    }
  }

  attack(duration = 100) {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, duration);
  }

  parry() {
    this.isParry = true;
    this.framesCurrent = 0;
    this.switchSprite('parry');
  }

  endParry() {
    this.isParry = false;
    this.holdParryFrame = false;
    this.isParryAnimationComplete = false;
    this.switchSprite('idle');
  }

  dodge() {
    this.isDodging = true;
    setTimeout(() => {
      this.isDodging = false;
    }, 500);
  }

  offsetRight() {
    if (!this.facingRight) {
      this.facingRight = true;
    }
  }

  offsetLeft() {
    if (this.facingRight) {
      this.facingRight = false;
    }
  }

  switchSprite(sprite) {
    // Override if parrying and animation isn't complete
    if (this.image === this.sprites.parry.image && 
        this.holdParryFrame && 
        this.isParryAnimationComplete) {
      return;
    }

    // Override for attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "runNeg":
        if (this.image !== this.sprites.runNeg.image) {
          this.image = this.sprites.runNeg.image;
          this.framesMax = this.sprites.runNeg.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "roll":
        if (this.image !== this.sprites.roll.image) {
          this.image = this.sprites.roll.image;
          this.framesMax = this.sprites.roll.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "parry":
        if (this.image !== this.sprites.parry.image) {
          this.image = this.sprites.parry.image;
          this.framesMax = this.sprites.parry.framesMax;
          this.framesCurrent = 6;
          //this.isParryAnimationComplete = false;
        }
        break;
    }
  }
}





class Enemy extends Sprite {
    constructor({
      width,
      height,
      position,
      velocity,
      color = "red",
      imageSrc,
      scale = 1,
      framesMax,
      offset = { x: 0, y: 0 },
      sprites,
    }){
        super({
          position,
          imageSrc,
          scale,
          framesMax,
          offset,
        });
           
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.lastKey;
        this.color = color;
        this.isAttacking;
        this.isHeavyAttacking;
        this.isParry;
        this.isEnemyParry;
        this.health = 100 
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 15;
        this.sprites = sprites;

        this.attackBox = {
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          offset: { x: 0, y: 0 }, // Separate offset object for attackBox
          width: 200,
          height: 50,
        };
      
        this.specialParryMoveBox = {
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          offset: { x: 0, y: 0 }, // Separate offset object for specialParryMoveBox
          width: 100,
          height: 75,
        };

           // Load sprites
       for (let sprite in sprites) {
        sprites[sprite].image = new Image();
        sprites[sprite].image.src = sprites[sprite].imageSrc;
      }
    
      }




    //draw method 

    //update method
    update() {
      this.draw();
      this.animateFrames()
      c.fillStyle = enemy.color;
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
      // Update enemy coordinates
      this.position.x += enemy.velocity.x;
      this.position.y += enemy.velocity.y;
  
      // Update attack box coordinates
      enemy.attackBox.position.x = enemy.position.x + enemy.attackBox.offset.x;
      enemy.attackBox.position.y = enemy.position.y + enemy.attackBox.offset.y;
  
      // Update specialParryMoveBox coordinates
      enemy.specialParryMoveBox.position.x = enemy.position.x + enemy.specialParryMoveBox.offset.x;
      enemy.specialParryMoveBox.position.y = enemy.position.y + enemy.specialParryMoveBox.offset.y;
  
      // Bottom boundary collision
      if (this.position.y + this.height + this.velocity.y >= canvas.height - 50) {
          this.velocity.y = 0;
      } else {
          this.velocity.y += gravity;
      }
  
      // Left and right boundaries
      if (this.position.x + this.velocity.x <= 0) {
          this.position.x = 0;
          this.velocity.x = 0;
      } else if (this.position.x + this.width + this.velocity.x >= canvas.width) {
          this.position.x = canvas.width - this.width;
          this.velocity.x = 0;
      } else {
          this.position.x += this.velocity.x;
      }
  
      // Top boundary
      if (this.position.y + this.velocity.y <= 0) {
          this.position.y = 0;
          this.velocity.y = -Math.abs(this.velocity.y);
          player.velocity.y += 2;
      }

          if (player.position.x < enemy.position.x) {
            enemy.offsetRight(); // This will set the attack box offset to the left
          } else if (player.position.x > enemy.position.x) {
            enemy.offsetLeft(); // This will set the attack box offset to the right
          }

          const enemyAttackBox = {
            position: {
              x: enemy.position.x + enemy.attackBox.offset.x,
              y: enemy.position.y + enemy.attackBox.offset.y
            },
            width: enemy.attackBox.width,
            height: enemy.attackBox.height
          };
    }

    

    enemyParry(){
        this.isEnemyParry = true
        setTimeout(()=>{
            this.isEnemyParry = false
        },1000)
    }

    //attack method
    attack(duration) {
        this.isAttacking = true;
        
        setTimeout(() => {
            this.isAttacking = false;
        }, `${duration}`);
    }


    offsetLeft(){
        enemy.attackBox.offset.x = 25
        enemy.specialParryMoveBox.offset.dax = 50
    }

    offsetRight(){
        enemy.attackBox.offset.x = -100
        enemy.specialParryMoveBox.offset.x = -75
    }


    switchSprite(sprite) {
         // overriding all other animations with the attack animation
  
    switch (sprite) {
     case "idle":
       if (this.image !== this.sprites.idle.image) {
         this.image = this.sprites.idle.image;
         this.framesMax = this.sprites.idle.framesMax;
         this.framesCurrent = 0
       }
       break;
   }
   
 }

    //postion reset state 
    

    //state 1 (sentry/idle)

    //state2 (walk up to player and jump attack twice) -> reset
    


    //state3 (dash agressively at player and one big hit) ->reset

   
}






//level assembler arhictecture 
class LevelAssembler{
 constructor({
  playerObjectList,
  enemyObjectList,
  levelAssetList,
  levelTitle
  }){
  this.levelTitle = levelTitle
  this.isLevelCompleted = false
  this.score = score
  this.specialThing = this.specialThing
  this.playerObjectList = playerObjectList
  this.enemyObjectList = enemyObjectList
  this.levelAssetList = levelAssetList
}



//methods
initBaddies(){
//some code to somehow load all player objects ine
}

initPlayer(){
//some code
}

initAssets(){
//some code
}

initLogic(){
//some codee
}

}














