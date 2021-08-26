
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var coinGroup, coinImage;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bg,bg1;
var score=0;
var trex_rope;

var gameOver, restart;
var a1,birdgroup,mango_image,pin;



function preload()
{
  
  trex_running =   loadAnimation("dora1.png","dora2.png","dora3.png","dora4.png");
 
  trex_collided = loadAnimation("dora4.png");
  trex_rope= loadImage("dorarope.png");
  a1=loadAnimation("b1.png","b2.png");
  coinImage = loadImage("apple.png");
  bg=loadAnimation("2Ct5-0.png","2Ct5-1.png","2Ct5-2.png","2Ct5-3.png","2Ct5-4.png","2Ct5-5.png","2Ct5-6.png","2Ct5-7.png","2Ct5-8.png","2Ct5-9.png","2Ct5-10.png","2Ct5-11.png",
  "2Ct5-12.png","2Ct5-13.png","2Ct5-14.png","2Ct5-15.png","2Ct5-16.png","2Ct5-17.png","2Ct5-0.png","2Ct5-1.png","2Ct5-2.png","2Ct5-3.png","2Ct5-4.png","2Ct5-5.png","2Ct5-6.png","2Ct5-7.png","2Ct5-8.png","2Ct5-9.png","2Ct5-10.png","2Ct5-11.png",
  "2Ct5-12.png","2Ct5-13.png","2Ct5-14.png","2Ct5-15.png","2Ct5-16.png","2Ct5-17.png")
    jump= loadSound("jump.wav");
    fail= loadSound("fail.wav");

  mango_image=loadImage("mango.png")
   

  pin=loadImage("pin.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadAnimation("obstacl1.png","obstacl12.png","obstacl13.png","obstacl14.png");
  obstacle2 = loadAnimation("e1.png","e2.png","e4.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("game.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth ,windowHeight);
  
  trex = createSprite(70,170,20,50);
 
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;
  //trex.debug=true
 
  trex.setCollider("circle",0,0,40)
  bg1 = createSprite(300,100);
 
  bg1.addAnimation("bg1", bg);
  bg1.scale=1.11
  trex.depth=bg1.depth;
  trex.depth=trex.depth + 1;
  trex.addAnimation("running", trex_running);
  trex.addAnimation("running", trex_running);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,170,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdgroup=new Group();
  coinGroup = new Group();
  score = 0;
}

function draw() {
  //trex.debug = true;
  
  background("white");
  text("Score: "+ score, 200,250);
  
  if (gameState===PLAY){
    //score = score + Math.round(getFrameRate()/60);
    if (coinGroup.isTouching(trex)) {
      score = score +1;
      coinGroup[0].destroy();
      jump.play();
    }
   
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 130) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
   
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    bird();
    spawnCoin();
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        fail.play();
    }
  }
   
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    birdgroup.setVelocityXEach(0);
   
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 180 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(3 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addAnimation("fox",obstacle1);
              break;
      case 2: obstacle.addAnimation("elephant",obstacle2);
            
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 600;
    //obstacle.debug=true
    obstacle.setCollider("circle",0,0,20)
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  coinGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}

function bird()
{
  if(frameCount % 60==0)
  {
    var ap=createSprite(Math.round(random(0,600)),Math.round(random(10,80)),10,40)
    ap.velocityX=-3;
    ap.addAnimation("brd",a1)
     //ap.debug=true
     ap.setCollider("circle",0,0,150)
     ap.scale=0.1
     ap.lifetime=120;
    
  }
}
function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(10,120));
    if(score <=1)
    {
    coin.addImage(coinImage);
    coin.scale = 0.07;
    }
    else if(score >2 && score<=20)
    {
      coin.addImage(mango_image)
      coin.scale=0.04
           
    }
    else
    {
      coin.addImage(pin)
      coin.scale = 0.07;
    }
    
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}


