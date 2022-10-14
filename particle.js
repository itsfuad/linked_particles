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
    radius: 80,
    speed: 0,
    weight: 1
}

//find the cursor position on the canvas from mouse and touch events
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;

    mouse.speed = {
        x: event.movementX,
        y: event.movementY
    }

    particles.forEach(particle => {
            //distance between mouse and particle
            let dx = mouse.x - particle.x;
            let dy = mouse.y - particle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            //if the distance is less than the mouse radius, move the particle
            if(distance <= mouse.radius){
                //x, y position required to have a distance of mouse.radius from the mouse
                let angle = Math.atan2(dy, dx);
                let x = mouse.x + Math.cos(angle) * mouse.radius;
                let y = mouse.y + Math.sin(angle) * mouse.radius;

                particle.x += (particle.x - x) * 0.01;
                particle.y += (particle.y - y) * 0.01;
            }
    });
});

window.addEventListener('touchmove', function(event){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;

    mouse.speed = {
        x: event.movementX,
        y: event.movementY
    }
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
            
            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(55, 200, 255, 0.02)`;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
            ctx.stroke();

            //distance between mouse and particle
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            //if the distance is less than the mouse radius, move the particle
            if(distance <= mouse.radius){
                //x, y position required to have a distance of mouse.radius from the mouse
                let angle = Math.atan2(dy, dx);
                const speed = mouse.speed.x ** 2 + mouse.speed.y ** 2;
                const force = (mouse.radius - distance) * mouse.weight * speed;
                const x = Math.cos(angle) * force;
                const y = Math.sin(angle) * force;

                this.x -= x;
                this.y -= y;
            }

        }

        //if particle is out of canvas, randomize its position
        if(this.x - this.size > canvas.width || this.x + this.size < 0){
            this.opacity = 0;

            this.x = generatePosition(this.size).x;
            this.speed.x = (Math.random() * 2 - 1) / this.weight;
            return;
        }
        
        if(this.y - this.size > canvas.height || this.y + this.size < 0){
            this.opacity = 0;

            this.y = generatePosition(this.size).y;
            this.speed.y = (Math.random() * 2 - 1) / this.weight;
            return;
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

    particles.length = 0;

    for(let i = 0; i < particleCount; i++){

        const size = Math.random() * 3 + 1;
        const {x, y} = generatePosition(size);

        const color = '255,255,255';
        const weight = 2/size;

        particles.push(new Particle(x, y, size, color, weight));
    }
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    particles.forEach(particle => {
        particle.draw();
        particle.update();
    });
    requestAnimationFrame(animate);
}

init();
animate();

// Language: javascript
