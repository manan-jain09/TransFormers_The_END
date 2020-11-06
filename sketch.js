var PLAY = 1;
var END = 0;
var gameState = PLAY;
var optimus, optimusImg, optimusImg1, autobot, autobotImg;
var sound, sound1;
var megatron, megatron1, megatron2;
var soundWave, soundImg, soundImg1, back, backImg, invisibleGround, ground, groundImg;
var gameOver, restart, gameOverImg, restartImg, score, survival;
var megaGroup, soundGroup, drived;
var missles, misslesImg, misslesGroup;
var spawner;

function preload(){
  optimusImg = loadAnimation("opt1.jpg");
  optimusImg1 = loadAnimation("opt.jpg");
  
  autobotImg = loadImage("download.jpg");
  backImg = loadImage("back.jpg");
  
  sound = loadSound("Megatron.mp3");
  sound1 = loadSound("Transformers.mp3");

  megatron1 = loadImage("mega.jpg");
  megatron2 = loadImage("mega1.jpg");
  
  soundImg = loadImage("Sound.jpg");
  soundImg1 = loadImage("SoundWaVE.jpg");
  
  groundImg = loadImage("ground.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  misslesImg = loadImage("sprite0.png");
}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  
  sound1.play(true);
  
  autobot = createSprite(width-50,100,10,10);
  autobot.addAnimation("autobot", autobotImg);
  autobot.scale = 0.3;
  
  optimus = createSprite(width/2 - 100,height-70,20,50);
  optimus.addAnimation("optimus", optimusImg);
  optimus.addAnimation("optimus1", optimusImg1);
  //optimus.setCollider('circle',0,0,350)
  optimus.scale = 0.7;
  //optimus.debug=true
  
  missles = createSprite(optimus.x + 50, optimus.y - 50);
  missles.addAnimation( "missles", misslesImg);
  missles.scale = 0.3;
  missles.visible = false;
  //missles.depth = optimus.depth;
  //optimus.depth = optimus.depth + 1;
  
  invisibleGround = createSprite(width/2,height-10,width,125); 
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImg);
  ground.x = width / 2;
  
  back = createSprite(width/2,height/2 - 150);
  back.addImage("back",backImg);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage("gameOver",gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage("restrat",restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  //invisibleGround.visible =false

  megaGroup = new Group();
  soundGroup = new Group();
  misslesGroup = new Group();
  
  survival = 0;
  score = 0;
  drived = 0;

}

function draw() {
  //optimus.debug = true;
  
  

  background("white");
  textSize(20);
  fill("black")
  text("Survival Time: "+ survival,30,80);
  text("Score: "+ score,30,50);
  text("Drived: " + drived + "m", 30, 110);
  
  restart.depth = optimus.depth + 1;
  gameOver.depth = optimus.depth + 1;
  restart.depth = back.depth + 1;
  gameOver.depth = back.depth + 1;
  
  if (gameState===PLAY){
    survival = survival + Math.round(getFrameRate()/60);   
    spawner = Math.round(random(8, 9));
    if(spawner === 8){
       spawnMega();
      }else if(spawner === 9){
          spawnSound();
      }
    
  if(keyDown("right_arrow")){
    drived = drived + Math.round(getFrameRate()/60);
    optimus.changeAnimation("optimus1", optimusImg1);
    camera.velocityX = -50;
    ground.velocityX = -6;
    optimus.x = width/2;
    }
    
    if(keyWentUp("right_arrow")){
    optimus.changeAnimation("optimus", optimusImg);
    camera.velocityX = 0;
    ground.velocityX = 0; 
    optimus.x = width/2 - 100;
    }
    
    if((touches.length > 0 || keyDown("SPACE"))) {
      spawnMissles();
      touches = [];
      optimus.changeAnimation("optimus", optimusImg);
    }
    
    optimus.velocityY = optimus.velocityY + 0.8;

    if((touches.length > 0 || keyWentUp("SPACE"))) {
      spawnMisslesReset();
       touches = [];
    }
    
    if(misslesGroup.isTouching(megaGroup) || misslesGroup.isTouching(soundGroup)){
       megaGroup.destroyEach();
       soundGroup.destroyEach();
       score = score + 1;
       misslesGroup.destroyEach();
       }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    optimus.collide(invisibleGround);
    
  
    if(megaGroup.isTouching(optimus) || soundGroup.isTouching(optimus)){
        sound.play();
        gameState = END;
      sound1.stop();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    optimus.velocityY = 0;
    megaGroup.setVelocityXEach(0);
    soundGroup.setVelocityXEach(0);
    

    
    //set lifetime of the game objects so that they are never destroyed
    megaGroup.setLifetimeEach(-1);
    soundGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {     
      reset();
      touches = [];
    }
  }
  drawSprites();
  
}

function spawnMega() {
  if(camera.position === 300) {
    megatron = createSprite(optimus.x + width - 100,optimus.y - 60,20,30);
    megatron.setCollider('rectangle',0,0,45, 200)
    //megatron.debug = true
   
    megatron.velocityX = -(6 + 3 * score / 100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: megatron.addImage(megatron1);
              break;
      case 2: megatron.addImage(megatron2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    megatron.scale = 0.3;
    megatron.lifetime = 300;
    optimus.depth = megatron.depth;
    megatron.depth = megatron.depth + 1;
    //add each megatrons to the group
    megaGroup.add(megatron);
  }
}
function spawnSound() {
  if(camera.position === 300) {
    soundWave = createSprite(optimus.x + width - 100,optimus.y - 60,20,30);
    soundWave.setCollider('rectangle',0,0,45, 200)
    //soundWave.debug = true
   
    soundWave.velocityX = Math.round(-(6 + score / 100));
    
    //generate random obstacles
    var rand1 = Math.round(random(1,2));
    switch(rand1) {
      case 1: soundWave.addImage(soundImg);
              break;
      case 2: soundWave.addImage(soundImg1);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    soundWave.scale = 0.3;
    soundWave.lifetime = 300;
    optimus.depth = soundWave.depth;
    soundWave.depth = soundWave.depth + 1;
    //add each soundwaves to the group
    soundGroup.add(soundWave);
  }
}

function spawnMissles(){
  missles.velocityX = 10;
  missles.visible = true;
  misslesGroup.add(missles);
}

function spawnMisslesReset(){
  missles = createSprite(optimus.x + 50, optimus.y - 50);
  missles.addImage("missles", misslesImg);
  missles.scale = 0.3;
  missles.visible = false;
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  megaGroup.destroyEach();
  soundGroup.destroyEach();

  survival = 0;
  score = 0;
  drived = 0;
  sound.stop();
  
}
