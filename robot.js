//get canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//set canvas size to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//player sprite
const enemySprite = new Image();
enemySprite.src = './bug.png';

// Event listener to initialize the game when the enemy sprite loads
enemySprite.addEventListener('load', () => {

    const spriteWidth = enemySprite.width / 14;
    const spriteHeight = enemySprite.height / 18;

    // Initialize the player object
    const enemy = new Player('./bug.png', spriteWidth, spriteHeight, 14, 18);

    // Mouse position object
    const mouse = { x: null, y: null };

    // Rotation object for device orientation
    const rotation = { x: 0, y: 0, z: 0 };

    // Event listeners for mouse and touch interactions
    addMouseTouchListeners(mouse, enemy);
    
    // Event listener for device orientation
    addDeviceOrientationListener(rotation);

    // Event listener for window resize
    addResizeListener(enemy);

    // Start the animation loop
    animate(enemy);
});

// Player class to represent the player sprite
class Player {
    constructor(sprite, spriteWidth, spriteHeight, n_cols, n_rows, x = 0, y = 0) {
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.spriteWidth = spriteWidth / n_cols;
        this.spriteHeight = spriteHeight / n_rows;
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
        };
        this.speed = { x: 0, y: 0 };
        this.x = canvas.width / 2 - this.spriteWidth / 2 + x;
        this.y = canvas.height / 2 - this.spriteHeight / 2 + y;
        this.fps = 2;
    }

    update(mouse) {
        if (!this.idle) {
            this.moveTowardsMouse(mouse);
        } else {
            this.SPRITE_NO = this.spriteMap['idle'];
            this.fps = 2;
        }

        this.animateSprite();
        this.draw();
    }

    moveTowardsMouse(mouse) {
        const { dx, dy, distance, angle, angle2 } = this.calculateMovement(mouse);

        this.setSpriteDirection(angle2);
        this.setSpeed(angle);

        this.x -= this.speed.x;
        this.y -= this.speed.y;

        if (distance < 10) {
            this.stopMoving();
        }
    }

    calculateMovement(mouse) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const angle2 = angle * 180 / Math.PI;

        return { dx, dy, distance, angle, angle2 };
    }

    setSpriteDirection(angle2) {
        if (angle2 >= 0 && angle2 <= 22.5 || angle2 > -22.5 && angle2 <= 0) {
            this.SPRITE_NO = this.spriteMap['left'];
        } else if (angle2 > 22.5 && angle2 <= 67.5) {
            this.SPRITE_NO = this.spriteMap['up-left'];
        } else if (angle2 > 67.5 && angle2 <= 112.5) {
            this.SPRITE_NO = this.spriteMap['up'];
        } else if (angle2 > 112.5 && angle2 <= 157.5) {
            this.SPRITE_NO = this.spriteMap['up-right'];
        } else if (angle2 > 157.5 && angle2 <= 180 || angle2 > -180 && angle2 <= -157.5) {
            this.SPRITE_NO = this.spriteMap['right'];
        } else if (angle2 > -157.5 && angle2 <= -112.5) {
            this.SPRITE_NO = this.spriteMap['down-right'];
        } else if (angle2 > -112.5 && angle2 <= -67.5) {
            this.SPRITE_NO = this.spriteMap['down'];
        } else if (angle2 > -67.5 && angle2 <= -22.5) {
            this.SPRITE_NO = this.spriteMap['down-left'];
        }

        this.frames = 7;
    }

    setSpeed(angle) {
        this.speed.x = Math.cos(angle) * 5;
        this.speed.y = Math.sin(angle) * 5;
        this.fps = 6;
    }

    stopMoving() {
        this.speed.x = 0;
        this.speed.y = 0;
        this.idle = true;
        this.SPRITE_NO = this.spriteMap['idle'];
        this.fps = 2;
    }

    animateSprite() {
        this.CURRENT_FRAME = Math.floor(this.counter++ * (this.fps / 10)) % this.frames;
    }

    draw() {
        ctx.drawImage(
            this.sprite,
            this.CURRENT_FRAME * this.spriteWidth,
            this.SPRITE_NO * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y - this.spriteHeight / 2,
            this.spriteWidth,
            this.spriteHeight
        );
    }
}

// Function to add mouse and touch event listeners
function addMouseTouchListeners(mouse, player) {
    const setMousePosition = (event) => {
        mouse.x = event.x - player.spriteWidth / 2;
        mouse.y = event.y - player.spriteHeight / 2;
        player.idle = false;
    };

    window.addEventListener('click', setMousePosition);
    document.addEventListener('mousemove', setMousePosition);
    document.addEventListener('touchmove', (e) => {
        setMousePosition(e.touches[0]);
    });
    document.addEventListener('touchstart', (e) => {
        setMousePosition(e.touches[0]);
    });

    const resetMousePosition = () => {
        mouse.x = undefined;
        mouse.y = undefined;
        player.idle = true;
    };

    document.addEventListener('mouseleave', resetMousePosition);
    document.addEventListener('touchend', resetMousePosition);
}

// Function to add device orientation event listener
function addDeviceOrientationListener(rotation) {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            rotation.x = event.alpha;
            rotation.y = event.beta;
            rotation.z = event.gamma;
        }, false);
    }
}

// Function to add window resize event listener
function addResizeListener(player) {
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        player.x = canvas.width / 2 - player.spriteWidth / 2;
        player.y = canvas.height / 2 - player.spriteHeight / 2;
    });
}

// Function to animate the player sprite
function animate(player) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update(mouse);
    requestAnimationFrame(() => animate(player));
}

