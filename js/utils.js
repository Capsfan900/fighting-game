
function calculateDirection(player,enemy){
    const dx = player.position.x - enemy.position.x;
    const dy = player.position.y - enemy.position.y;
    const directionToPlayer = dx >= 0 ? 0: 1;
    return directionToPlayer;
}



//player + normal object collision detection
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}



//parry hit detection
function parryDetection({ weaponHitBox1, weaponHitBox2 }) {
    return (
        weaponHitBox1.position.x + weaponHitBox1.width >= weaponHitBox2.position.x &&
        weaponHitBox1.position.x <= weaponHitBox2.position.x + weaponHitBox2.width &&
        weaponHitBox1.position.y + weaponHitBox1.height >= weaponHitBox2.position.y &&
        weaponHitBox1.position.y <= weaponHitBox2.position.y + weaponHitBox2.height
    );
}



