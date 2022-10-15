const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//set canvas size to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



const particles = [];
let particleCount = 0;

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});


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
    constructor(x, y, size, color, weight){
        const directionX = (Math.random() * 2 - 1);
        const directionY = (Math.random() * 2 - 1);
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = size;
        this.opacity = 0;
        this.weight = weight;
        this.col = color;
        this.lineCol = '55, 200, 255';
        this.speed = {x: directionX / weight, y: directionY / weight};
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.col},${this.opacity})`;
        ctx.fill();
    }

    update(){

        //gradually increase opacity
        if(this.opacity < 1){
            this.opacity += 0.01;
        }
        
        this.x += this.speed.x;
        this.y += this.speed.y;
        

        //check mouse position and move the particle
        if(mouse.x && mouse.y){

            //show mouse radius
            /*
            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(55, 200, 255, 0.02)`;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
            ctx.stroke();
            */

            //distance between mouse and particle
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            //if the distance is less than the mouse radius, move the particle
            if(distance <= mouse.radius){
                this.col = '255, 255, 0';
                this.lineCol = '255, 255, 0';
            }else{
                this.col = '255, 255, 255';
                this.lineCol = '55, 200, 255';
            }

        }else{
            this.col = '255, 255, 255';
            this.lineCol = '55, 200, 255';
        }

        //if the particle is at the edge of the canvas, reverse the direction

        if(this.x > canvas.width - this.size || this.x < this.size){
            this.speed.x = -this.speed.x;
        }

        if(this.y > canvas.height - this.size || this.y < this.size){
            this.speed.y = -this.speed.y;
        }


        //detect collision with other particles
        for(let i = 0; i < particles.length; i++){
            if(this === particles[i]) continue;

            if(distance(this.x, this.y, particles[i].x, particles[i].y) < this.size + particles[i].size){
                resolveCollision(this, particles[i]);
            }
        }
    }
}


function resolveCollision(particle, otherParticle){
    const xVelocityDiff = particle.speed.x - otherParticle.speed.x;
    const yVelocityDiff = particle.speed.y - otherParticle.speed.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    //prevent accidental overlap of particles
    if(xVelocityDiff * xDist + yVelocityDiff * yDist >= 0){

        //get the angle between the two particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        //store mass in var for better readability in collision equation
        const m1 = particle.weight;
        const m2 = otherParticle.weight;

        //velocity before equation
        const u1 = rotate(particle.speed.x, particle.speed.y, angle);
        const u2 = rotate(otherParticle.speed.x, otherParticle.speed.y, angle);

        //velocity after 1d collision equation
        const v1 = {x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y};
        const v2 = {x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y};

        //final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1.x, v1.y, -angle);
        const vFinal2 = rotate(v2.x, v2.y, -angle);

        //swap particle velocities for realistic bounce effect
        particle.speed.x = vFinal1.x;
        particle.speed.y = vFinal1.y;

        otherParticle.speed.x = vFinal2.x;
        otherParticle.speed.y = vFinal2.y;
    }
}


function rotate(x, y, angle){
    const rotatedVelocities = {
        x: x * Math.cos(angle) - y * Math.sin(angle),
        y: x * Math.sin(angle) + y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function distance(x1, y1, x2, y2){
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;

    return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}

function init(){
    //clear particles array

    let screenSize = (canvas.width * canvas.height / 200);
    let particleDensity = 0.05;
    
    particleCount = Math.floor(screenSize * particleDensity);
    
    particles.length = 0;
    
    for(let i = 0; i < particleCount; i++){
        
        const size = Math.random() * 3 + 1;
        const {x, y} = generatePosition(size);

        const color = '255, 255, 255';
        const weight = 2/size;

        particles.push(new Particle(x, y, size, color, weight));
    }
}

const mouse = {
    x: null,
    y: null,
    radius: 100,
    speed: {x: 0, y: 0},
    weight: 0.1
}



function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //connect closer particles with lines
    for(let i = 0; i < particles.length; i++){
        for(let j = i; j < particles.length; j++){
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 200){
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${particles[i].lineCol}, ${2 - distance / 50})`;
                ctx.lineWidth = 2 - (distance / 50);
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    particles.forEach(particle => {
        particle.draw();
        particle.update();
    });
    requestAnimationFrame(animate);
}


document.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

document.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

document.addEventListener('touchstart', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

//unset mouse position when mouse leaves canvas
document.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

//unset mouse position when touch ends
document.addEventListener('touchend', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});




init();
animate();

// Language: javascript
