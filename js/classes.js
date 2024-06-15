

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
      this.framesHold = 15
      this.offset = offset
      this.originalOffsetX = offset.x;
      this.originalOffsetY = offset.y
      
  }

  //draw method 
  draw() {
      c.drawImage(
        this.image, 
        //sprite animation "cropping technique for html canvas"
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax, //divide by unknown
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
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++

      } else {
        this.framesCurrent = 0

      }
    }
  }

  //update method
  update() {
      this.draw();
      this.animateFrames();

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

    // Attack and parry box objects
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    }
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
       for (let sprite in sprites) {
        sprites[sprite].image = new Image();
        sprites[sprite].image.src = sprites[sprite].imageSrc;
      }
  
  }

  update() {
    this.draw(); // Draws hitboxes
    this.animateFrames(); // Animates sprites
    
   // c.fillStyle = enemy.color;
    //c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //updates facing direction
    if (this.facingRight) {
      player.offsetRight();
    } else {
      player.offsetLeft();
    }


    // Update attack box coordinates
    player.attackBox.position.x = player.position.x + this.attackBox.offset.x;
    player.attackBox.position.y = player.position.y + this.attackBox.offset.y;

    // Update player coordinates
    player.position.x += this.velocity.x;
    player.position.y += this.velocity.y;

    // Update parry box coordinates
    player.parryBox.position.x = player.position.x + this.parryBox.offset.x;
    player.parryBox.position.y = player.position.y + this.parryBox.offset.y;

    

     // gravity 
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 50) {
      this.velocity.y = 0;
      //this.position.y = 330
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

    // Update player position for dodge
    if (this.isDodging && player.velocity.x === 1) {
      player.velocity.x = 0;  
      } 
    }

   
  //player instance methods 
  attack(duration) {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, duration);
  }

  parry() {
    this.isParry = true;
    setTimeout(() => {
      this.isParry = false;
    }, 600);
  }

  dodge() {
    this.isDodging = true;
    setTimeout(() => {
      this.isDodging = false;
    },500);
  }

  offsetRight(direction) {
    player.attackBox.offset.x = 0;

  }

  offsetLeft(direction) {
    player.attackBox.offset.x = -70;
  }

  
  
  //sprite state management 
  switchSprite(sprite) {

       // overriding all other animations with the attack animation
       if (
        this.image === this.sprites.attack1.image &&
        this.framesCurrent < this.sprites.attack1.framesMax - 1
      )
        return

        
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0
        }
        break;

      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0
        }
        break;

      case "runNeg":
          if (this.image !== this.sprites.runNeg.image) {
            this.image = this.sprites.runNeg.image;
            this.framesMax = this.sprites.runNeg.framesMax;
            this.framesCurrent = 0
          }
        break;

      case "roll":
        if (this.image !== this.sprites.roll.image) {
          this.framesMax = this.sprites.roll.framesMax;
          this.image = this.sprites.roll.image;
          this.framesCurrent = 0
        }
        break;

        case "attack1":
          if (this.image !== this.sprites.attack1.image) {
            this.framesMax = this.sprites.attack1.framesMax;
            this.image = this.sprites.attack1.image;
            this.framesCurrent = 0
          }
          break;
        case "parry":
          if (this.image !== this.sprites.parry.image) {
            this.framesMax = this.sprites.parry.framesMax;
            this.image = this.sprites.parry.image;
            this.framesCurrent = 0
          }
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













