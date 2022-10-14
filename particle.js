const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//set canvas size to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});


const mouse = {
    x: undefined,
    y: undefined,
    radius: 100
}

//find the cursor position on the canvas from mouse and touch events
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('touchmove', function(event){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

window.addEventListener('touchstart', function(event){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

window.addEventListener('touchend', function(){
    mouse.x = undefined;
    mouse.y = undefined;
});

window.addEventListener('mouseout', function(){
    mouse.x = undefined;
    mouse.y = undefined;
});


const particles = [];
const particleCount = 50;


function generatePosition(size){
    const x = Math.random() * (canvas.width - size * 2) + size;
    const y = Math.random() * (canvas.height - size * 2) + size;
    let dx = mouse.x - x;
    let dy = mouse.y - y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if(distance < mouse.radius){
        //console.log('too close');
        return generatePosition(size);
    }

    return {x, y};
}


class Particle{
    constructor(x, y, size, color, speed){
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = size;
        this.color = color;
        this.speed = {x: speed.x, y: speed.y};
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(){

        
        this.x += this.speed.x;
        this.y += this.speed.y;
        

        //check mouse position and move the particle
        if(mouse.x && mouse.y){
            //draw circle around the mouse

            /*
            //set color to transparent white
            ctx.fillStyle = 'rgba(255, 255, 255, 0.002)';

            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'white';

            */

            //distance between mouse and particle
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            //if the distance is less than the mouse radius, move the particle
            if(distance <= mouse.radius){
                //x, y position required to have a distance of mouse.radius from the mouse
                let angle = Math.atan2(dy, dx);
                let x = mouse.x + Math.cos(angle) * mouse.radius;
                let y = mouse.y + Math.sin(angle) * mouse.radius;

                //if particle is inside the mouse radius, move it to the edge of the mouse radius
                if(distance < mouse.radius - 10){
                    this.x -= (x - this.x) * 0.1;
                    this.y -= (y - this.y) * 0.1;
                }else{
                
                    //move the particle along the curve
                    this.x -= (x - this.x) * 0.005;
                    this.y -= (y - this.y) * 0.005;
                }
            }
        }

        if(this.x + this.size > canvas.width || this.x - this.size < 0){
            //this will reverse the speed of the particle
            //this.speed.x *= -1;

            //this will make the particle disappear and reappear on a random x position
            this.x = generatePosition(this.size).x;
            const directionX = (Math.random() * 2 - 1);
            this.speed.x = (2/this.size) * directionX;
        }

        if(this.y + this.size > canvas.height || this.y - this.size < 0){
            //this will reverse the speed of the particle
            //this.speed.y *= -1;

            //this will make the particle disappear and reappear on a random x position
            this.y = generatePosition(this.size).y;
            const directionY = (Math.random() * 2 - 1);
            this.speed.y = (2/this.size) * directionY;
        }

    }
}

function init(){
    //clear particles array

    particles.length = 0;

    for(let i = 0; i < particleCount; i++){

        const size = Math.random() * 2 + 1;
        const {x, y} = generatePosition(size);
        //randomly choose -1 or 1
        const directionX = (Math.random() * 2 - 1);
        const directionY = (Math.random() * 2 - 1);
        const color = 'white';

        particles.push(new Particle(x, y, size, color, { x: (2/size) * directionX, y: (2/size) * directionY}));
    }
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < particles.length; i++){
        particles[i].update();
        particles[i].draw();
    }

    
    //connect closer particles with lines
    for(let i = 0; i < particles.length; i++){
        for(let j = i; j < particles.length; j++){
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 100){
                ctx.beginPath();
                ctx.strokeStyle = `rgba(55, 200, 255, ${1 - distance / 100})`;
                ctx.lineWidth = 1 - (distance / 100);
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    

    requestAnimationFrame(animate);
}

init();
animate();

// Language: javascript
