
//Level One
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
              imageSrc:'/img/misc/mirrorIdle.png',
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
              imageSrc:'/img/misc/leftGood.png',
              framesMax: 1,
          },
  
          attack1:{
            imageSrc:'/img/misc/leftGood.png',
            framesMax: 1
          },
  
          parry:{
            imageSrc:'/img/misc/parryLong.png',
            framesMax: 16
          },
  
          heavyAttack:{
            imageSrc:'/img/misc/LeftGood.png',
            framesMax: 1
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
  



      //Level Two