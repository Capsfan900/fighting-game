


//global scope things
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;
//need to seperate the concerns of players facingDirection and the enemy
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

//DOM References
const debug = document.querySelector(".debug")
const playerHealth = document.querySelector("#playerHealth2");
const enemyHealth = document.querySelector("#enemyHealth2");


//GAME OBJECTS//
const backgroundlayer0 = new SpriteBackground({
  position:{
      x:0,
      y:0,
  },
  imageSrc:'/img/misc/background1.png',
})

const backgroundlayer1 = new SpriteBackground({
    position:{
        x:0,
        y:0,
    },
    imageSrc:'/img/misc/background2.png',
})

const backgroundLayer2 = new SpriteBackground({
    position:{
        x:0,
        y:0,
    },
    imageSrc:'/img/misc/background3.png',
})

const clouds = new Sprite({
     position:{
        x:925,
        y:600,
    },
    imageSrc:'/img/misc/cloud1.png',
    scale:3.75,
    framesMax:0
})

const campFire = new Sprite({
    position:{
        x:925,
        y:600,
    },
    imageSrc:'/img/misc/weirdFire.png',
    scale:3.75,
    framesMax:16
})


const player = new Player({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
 // Add width and height properties
    width:50, 
    height: 150,
    imageSrc:'/img/misc/wow.png',
    //global limit to player instance framerate
    framesMax:8,
    scale: 2,
    //adjust sprite position
    offset:{
        x:85,
        y:80
    },

    sprites:{
        idle:{
            imageSrc:'/img/misc/idleSheetWow.png',
            framesMax:9
        },
        run:{
            imageSrc:'/img/misc/rightGood.png',
            framesMax:1
        },
        runNeg:{
          imageSrc:'/img/misc/leftGood.png',
            framesMax:1
        },
        roll:{
            imageSrc:'/img/misc/roll.png',
            framesMax: 11,
        },

        attack1:{
          imageSrc:'/img/misc/weirdAttack.png',
          framesMax: 12
        },

        parry:{
          imageSrc:'/img/misc/parryBlastSheetLong.png',
          framesMax: 5
        },

        heavyAttack:{
          imageSrc:'/img/misc/heavyAttack.png',
          framesMax: 10
        },

    },
    attackBox: {
        offset: {
          x: 0,
          y: 0 
        },
        width: 160,
        height: 50
      }

});


const enemy = new Enemy({
  position: {
    x: 600,
    y: 100
  },
  velocity: {
      x: 0,
      y: 0
  },
  offset: {
      x:-100, // Adjust these values as needed
      y: 0
  },
  color: "blue",
  // Add width and height properties
    width: 50, 
    height: 150,
    imageSrc:'/img/misc/wow.png',
      //global limit to player instance framerate
      framesMax:8,
      scale: 4,
      //adjust sprite position
      offset:{
          x:92,
          y:50
      },

      sprites:{
          idle: {
            imageSrc: '/img/misc/eIdle.png',
            framesMax: 8
          }
     

      },
      attackBox: {
          offset: {
            x: 0,
           y: 0 
          },
          width: 160,
          height: 50
        }

    });


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    }
};
//GAME OBJECTS//












//main functions and game loop 
function updateGameState() {
    // Reset player velocity
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //garbage state management that need to be refactored
         //handle user input and sprite state//
    if (player.isDodging) {
      player.velocity.x = 0;
      player.switchSprite('roll')
    } else if(player.isAttacking){
        player.velocity.x = 0;
        player.switchSprite('attack1')
    }
    else if (keys.a.pressed && lastKey === 'a') {
      player.velocity.x = -1;
      player.facingRight = false; // Player is facing left
      player.offsetRight();
      player.switchSprite('runNeg');
    } else if (keys.d.pressed && lastKey === 'd') {
      player.velocity.x = 1;
      player.facingRight = true; // Player is facing right
      player.offsetLeft();
      player.switchSprite('run');
    }else if(player.isParry){
      player.switchSprite('parry')
    } else {
      player.switchSprite('idle');
    } 

  

    // Apply gravity to player
    if (player.position.y + player.height + player.velocity.y >= canvas.height - 50) {
      player.velocity.y = 0;
    } else {
      player.velocity.y += gravity;
    }
  

    // Update enemy attack box and parry box positions

  
    // Handle player and enemy collisions
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy,
      }) &&
      player.isAttacking
    ) {
      player.isAttacking = false;
      console.log('player hit successful');
      enemy.health -= 20;
      enemyHealth.style.width = enemy.health + '%';
      console.log(enemy.health);
    }
  
    if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player,
      }) &&
      enemy.isAttacking
    ) {
      console.log('enemy attack successful');
      enemy.isAttacking = false;
      player.health -= 20;
      playerHealth.style.width = player.health + '%';
      console.log(player.health);
    }
  
    // Handle player and enemy parry
    if (
      parryDetection({
        weaponHitBox1: player.parryBox,
        weaponHitBox2: enemy.specialParryMoveBox,
      }) &&
      player.isParry &&
      enemy.isEnemyParry
    ) {
      player.isParry = false;
      enemy.isEnemyParry = false;
      console.log('parry successful');
    }
  }





//ANIMATION LOOP(real time event loop)
function animate() {
    debug.textContent = `||Player X: ${player.position.x}
     Enemy X: ${enemy.position.x} 
     || Enemy Weapon/ParryBox Offset X: ${enemy.specialParryMoveBox.offset.x}
     ||Player X velocity: ${player.velocity.x}
     ||Direction To Player: ${calculateDirection(player, enemy)}||`;
    window.requestAnimationFrame(animate);
    // Clear canvas and draw background
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    updateGameState();
    // Update game state
    // Draw game objects
    backgroundlayer0.update()
    backgroundlayer1.update();
    backgroundLayer2.update();
    campFire.update();
    player.update();
    enemy.update();
  }
  //recursive game loop
  animate();

//event listeners + controls
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = true;
            lastKey = "d";
            break;
        case "a":
            keys.a.pressed = true;
            lastKey = "a";
            break;
        case " ":
            player.velocity.y = -10;
            break;
        case "f":                         
            player.attack(400);                         
            break;                         
        
        case "e":
            player.parry();
            break
        case "q":
          player.dodge()
          setTimeout(() => {
            player.velocity.x += 0
            player.position.x += 150
          }, "400");
            break

        case 'o':
            enemy.attack(1000);
            break
        case 'p':
            enemy.enemyParry()
            break
    }




});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "w":
            keys.w.pressed = false;
            lastKey = "w";
            break;
        case "e":
              player.isParryKeyHeld = false; // Set the flag to false when the key is released
            break;
    } 
});



  
function assembleLevel(SpriteBackground,SpriteAssets,player,enemies){
  //returns all objects and functions assembled for that specifc level
}



