var boy,boy_running,boy_collided;
var ground,invisibleGround,groundImage;
var background,backgroundImg;
var starGroup,starImage;
var obstaclesGroup,obstacle1,obstacle2,obstacle3;
var score = 0;
var gameOver,restart,gameOverImage,restartImage;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
localStorage["HighestScore"]=0;

function preload()
{
  backgroundImg = loadImage("background0.png");
  boy_running = loadAnimation("preview.png","dora.png");
  boy_collided = loadAnimation("dora3.gif");
  groundImage = loadImage("backg.png");
  starImage = loadImage("trophy.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImage = loadImage("gameover.png");
  restartImage = loadImage("restart.png");
}

function setup()
{
  createCanvas(600,200);
  background = createSprite(300,50);
  background.addImage(backgroundImg);
  background.scale =3;
  boy = createSprite(50,180,20,50);
  boy.addAnimation("running",boy_running);
  boy.scale = 0.2;
  
  ground = createSprite(0,190,1200,10);
  ground.x = ground.width/2;
  ground.velocityX = -(6+3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImage);
  
  restart = createSprite(300,160);
  restart.addImage(restartImage);
  
  gameOver.scale = 0.2;
  restart.scale = 0.2;
  
  gameOver.visible = false;
  restart.visible = false;
  
  starGroup = new Group();
  obstaclesGroup = new Group();
  score = 0;
  
}

function draw()
{
  background.velocityX=-3;
  if(background.x<0)
    {
      background.x=background.width/2;
    }
 
  if(gameState===PLAY)
    {
      score = score+Math.round(getFrameRate()/60);
      if(score>=0)
        {
          ground.velocityX = -6;
        }
      else
        {
          ground.velocityX = -(6+3*score/100);
        }
       if(keyDown("space"))
         {
           boy.velocityY = -12;
           
         }
      boy.velocityY = boy.velocityY+0.8;
      if(ground.x<0)
        {
          ground.x = ground.width/2;
        }
      boy.collide(ground);
      spawnStar();
      spawnObstacles();
      if(obstaclesGroup.isTouching(boy))
        {
          gameState = END;
          
        }
     
    } 
  else if(gameState === END)
    {
      gameOver.visible = true;
      restart.visible = true;
      boy.addAnimation("collided",boy_collided);
      ground.velocityX = 0;
      boy.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      starGroup.setVelocityXEach(0);
      boy.changeAnimation("collided",boy_collided);
      boy.scale = 0.35;
      obstaclesGroup.setLifetimeEach(-1);
      starGroup.setLifetimeEach(-1);
      if(mousePressedOver(restart))
        {
          reset();
        }
    }
    
    drawSprites();
    textSize(20);
    fill(255);
    text("score"+score,500,40);
}

function spawnStar()
{
  if(frameCount%60===0)
    {
      var star = createSprite(600,190,80,10);
      star.y = Math.round(random(80,120));
      star.addImage(starImage);
      star.scale = 0.3;
      star.velocityX = -3;
      star.lifetime = 200;
      star.depth = boy.depth;
      boy.depth = boy.depth+1;
      starGroup.add(star);
    }
  
}
function spawnObstacles()
{
  if(frameCount%60 === 0)
    {
      var obstacle = createSprite(600,165,10,40);
      var rand = Math.round(random(1,3));
      switch(rand)
        {
          case 1:obstacle.addImage(obstacle1);
            break;
          case 2:obstacle.addImage(obstacle2);
            break;
          case 3:obstacle.addImage(obstacle3);
            break;
            
        }
      obstacle.velocityX = -(6+3*score/100);
      obstacle.scale = 0.2;
      obstacle.lifetime = 200;
      obstaclesGroup.add(obstacle);
    }
}
function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  starGroup.destroyEach();
  boy.changeAnimation("running",boy_running);
  boy.scale = 0.2;
  if(localStorage["HighestScore"]<score)
    {
      localStorage["HighestScore"]=score;
    }
  score = 0;
}
