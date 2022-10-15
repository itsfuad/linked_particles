//get canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//set canvas size to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//player sprite
const enemySprite = new Image();
enemySprite.src = './bug.png';

enemySprite.addEventListener('load', () =>{

    const spriteWidth = enemySprite.width/14;
    const spriteHeight = enemySprite.height/18;
    
    let ROW = 12;
    let COL = 0;
    let colCount = 9;
    let counter = 0;
    
    class Player{
        constructor(sprite, n_cols, n_rows, x = 0, y = 0){
            this.sprite = new Image();
            this.sprite.src = sprite;
            this.spriteWidth = this.sprite.width/n_cols;
            this.spriteHeight = this.sprite.height/n_rows;
            this.SPRITE_NO = 12;
            this.CURRENT_FRAME = 0;
            this.frames = 9;
            this.counter = 0;
            this.idle = true;
            this.spriteMap = {
                'up': 0,
                'down': 4,
                'left': 6,
                'right': 2,
                'up-left': 7,
                'up-right': 1,
                'down-left': 5,
                'down-right': 3,
                'idle': 12
            }
            this.speed = {x: 0, y: 0};
            this.x = canvas.width/2 - this.spriteWidth/2 + x;
            this.y = canvas.height/2 - this.spriteHeight/2 + y;
            this.fps = 2;
        }
    
        update(){
    
            if (!this.idle){
                //go to mouse position
                const dx = this.x - mouse2.x;
                const dy = this.y - mouse2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                //angle to degrees
                const angle2 = angle * 180 / Math.PI;
                //console.log(angle2);
    
                //set sprite direction
                if (angle2 >= 0 && angle2 <= 22.5){
                    this.SPRITE_NO = this.spriteMap['left'];
                    this.frames = 7;
                } else if (angle2 > 22.5 && angle2 <= 67.5){    
                    this.SPRITE_NO = this.spriteMap['up-left'];
                    this.frames = 7;
                } else if (angle2 > 67.5 && angle2 <= 112.5){
                    this.SPRITE_NO = this.spriteMap['up'];
                    this.frames = 7;
                } else if (angle2 > 112.5 && angle2 <= 157.5){
                    this.SPRITE_NO = this.spriteMap['up-right'];
                    this.frames = 7;
                } else if (angle2 > 157.5 && angle2 <= 180){
                    this.SPRITE_NO = this.spriteMap['right'];
                    this.frames = 7;
                } else if (angle2 > -180 && angle2 <= -157.5){
                    this.SPRITE_NO = this.spriteMap['right'];
                    this.frames = 7;
                } else if (angle2 > -157.5 && angle2 <= -112.5){
                    this.SPRITE_NO = this.spriteMap['down-right'];
                    this.frames = 7;
                } else if (angle2 > -112.5 && angle2 <= -67.5){
                    this.SPRITE_NO = this.spriteMap['down'];
                    this.frames = 7;
                } else if (angle2 > -67.5 && angle2 <= -22.5){
                    this.SPRITE_NO = this.spriteMap['down-left'];
                    this.frames = 7;
                } else if (angle2 > -22.5 && angle2 <= 0){
                    this.SPRITE_NO = this.spriteMap['left'];
                    this.frames = 7;
                }
    
    
    
                this.speed.x = Math.cos(angle) * 5;
                this.speed.y = Math.sin(angle) * 5;
    
                this.x -= this.speed.x;
                this.y -= this.speed.y;
                
                this.fps = 6;
                
                //check if player is close to mouse
                if (distance < 10){
                    this.speed.x = 0;
                    this.speed.y = 0;
                    this.idle = true;
                    this.SPRITE_NO = this.spriteMap['idle'];
                    //console.log('idle');
                    this.fps = 2;
                }
                //this.x += this.speed.x / 5;
                //this.y += this.speed.y / 5;
    
            }else{
                this.SPRITE_NO = this.spriteMap['idle'];
                this.fps = 2;
            }
    
            this.CURRENT_FRAME = Math.floor(this.counter++ * (this.fps / 10) ) % this.frames;
            //translate to center of sprite
            
            ctx.drawImage(this.sprite, this.CURRENT_FRAME * this.spriteWidth, this.SPRITE_NO * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y - this.spriteHeight/2, this.spriteWidth, this.spriteHeight);
        }
        
    
    }
    
    const mouse2 = {
        x: null,
        y: null
    }
    
    //get mouse click or touch
    window.addEventListener('click', function(event){
    
        mouse2.x = event.x - Enemy.spriteWidth/2;
        mouse2.y = event.y - Enemy.spriteHeight/2;
    
        Enemy.idle = false;
    });
    
    document.addEventListener('mousemove', (e) => {
        mouse2.x = e.x - Enemy.spriteWidth/2;
        mouse2.y = e.y - Enemy.spriteHeight/2;
    
        Enemy.idle = false;
    });
    
    document.addEventListener('touchmove', (e) => {
        mouse2.x = e.touches[0].clientX - Enemy.spriteWidth/2;
        mouse2.y = e.touches[0].clientY - Enemy.spriteHeight/2;
    
        Enemy.idle = false;
    });
    
    document.addEventListener('touchstart', (e) => {
        mouse2.x = e.touches[0].clientX - Enemy.spriteWidth/2;
        mouse2.y = e.touches[0].clientY - Enemy.spriteHeight/2;
    
        Enemy.idle = false;
    });
    
    //unset mouse position when mouse leaves canvas
    document.addEventListener('mouseleave', () => {
        mouse2.x = undefined;
        mouse2.y = undefined;
    
        Enemy.idle = true;
    });
    
    //unset mouse position when touch ends
    document.addEventListener('touchend', () => {
        mouse2.x = undefined;
        mouse2.y = undefined;
    
        Enemy.idle = true;
    });
    
    
    const Rotation = {
        x: 0,
        y: 0,
        z: 0
    }
    
    
    
    //if has x, y, z sensor
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
    
            console.log(event.alpha);
            console.log(event.beta);
            console.log(event.gamma);
            Rotation.x = event.alpha;
            Rotation.y = event.beta;
            Rotation.z = event.gamma;
    
        }
        , false);
    }
    
    
    
    //resize
    window.addEventListener('resize', function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        //reposition player
        Enemy.x = canvas.width/2 - Enemy.spriteWidth/2;
        Enemy.y = canvas.height/2 - Enemy.spriteHeight/2;
    
    });
    
    
    
    
    const Enemy = new Player('./bug.png', 14, 18);
    
    
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //COL = Math.floor(counter++/10)%colCount;
        
        //ctx.drawImage(enemySprite, COL * spriteWidth, ROW * spriteHeight, spriteWidth, spriteHeight, canvas.width/2 - spriteWidth/2, canvas.height/2 - spriteHeight/2, spriteWidth, spriteHeight);
        Enemy.update();
        requestAnimationFrame(animate);
    }
    
    animate();
});
