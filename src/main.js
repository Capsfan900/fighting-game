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
        if (event.key === 'e') { 
          player.resumeAnimation();
          player.parry(); // Start or resume the animation
        }
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
          player.isParry = false
          break;

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
},
e:  {
   pressed: false
}

};




//main functions and game loop 
function collisionHandling() {
    // Reset player velocity
    player.velocity.x = 0;
    enemy.velocity.x = 0;
  
    // Apply gravity to player
    if (player.position.y + player.height + player.velocity.y >= canvas.height - 50) {
      player.velocity.y = 0;
    } else {
      player.velocity.y += gravity;
    }
  


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

  function stateManagementPlayer() {
    if (!player.animationLocked) { // Only change states if not in locked animation
        if (player.isDodging) {
            player.velocity.x = 0;
            player.switchSprite('roll');
        } else if (player.isAttacking) {
            player.velocity.x = 0;
            player.switchSprite('attack1');
        } else if (player.isParry) {
            player.switchSprite('parry');
        } else if (keys.a.pressed && lastKey === 'a') {
            player.velocity.x = -1;
            player.offsetLeft();
            player.switchSprite('runNeg');
        } else if (keys.d.pressed && lastKey === 'd') {
            player.velocity.x = 1;
            player.offsetRight();
            player.switchSprite('run');
        } else {
            player.switchSprite('idle');
        }
    }
}



//ANIMATION LOOP(real time event loop)
function animate() {
    stateManagementPlayer()
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
    // Draw game objects
    backgroundlayer0.update()
    backgroundlayer1.update();
    backgroundLayer2.update();
    campFire.update();
    player.update();
    enemy.update();

    collisionHandling();
  }
  //recursive game loop
  animate();





  


