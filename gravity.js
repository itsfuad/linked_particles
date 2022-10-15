const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//set canvas size to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});

class object{
    constructor(x, y, radius, color, weight){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = 10/weight;
        this.weight = weight;
        this.gravity = 1 * weight;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Planet extends object{
    constructor(x, y, radius, color, weight, velocity){
        super(x, y, radius, color, weight);
        this.speed = {x: velocity/100, y: velocity/100};
    }
    update(){
        //orbit around the sun
        this.x += this.speed.x;
        this.y += this.speed.y;
    }
}

class Star extends object{
    constructor(x, y, radius, color, weight){
        super(x, y, radius, color, weight);
        this.opacity = 0.004;
    }
    draw(){
        //draw light source
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        super.draw();
    }
    update(){
        //blinking effect
        if(this.opacity < 0.1){
            this.opacity += 0.02;
        }
        else{
            this.opacity -= 0.001;
        }
    }
}

function generatePosition(size){
    //do not generate planets on the star
    let x = Math.random() * (canvas.width - size * 2) + size;
    let y = Math.random() * (canvas.height - size * 2) + size;
    if(x > star.x - star.radius && x < star.x + star.radius && y > star.y - star.radius && y < star.y + star.radius){
        return generatePosition(size);
    }
    else{
        return {x, y};
    }
}

//create a sun
let x = canvas.width/2;
let y = canvas.height/2;
let radius = 30;
let color = 'rgb(252, 211, 3)';
let weight = 333000;

const sun = new Star(canvas.width/2, canvas.height/2, radius, color, weight);

const planets = [];

//create planets
const mercury = new Planet(sun.x + 80, sun.y + 80, 10, 'grey', 0.0553, 47.9);
const venus = new Planet(sun.x + 130, sun.y - 130, 15, 'orange', 0.815, 35.0);
const earth = new Planet(sun.x + 190, sun.y + 190, 20, 'blue', 1, 29.8);
const mars = new Planet(sun.x + 240, sun.y + 240, 15, 'red', 0.1075, 24.1);
const jupiter = new Planet(sun.x + 300, sun.y - 300, 30, 'brown', 317.8, 13.1);
const saturn = new Planet(sun.x + 350, sun.y + 350, 25, 'pink', 95.2, 9.7);
const uranus = new Planet(sun.x + 400, sun.y - 400, 20, 'lightblue', 14.6, 6.8);
const neptune = new Planet(sun.x + 450, sun.y + 450, 15, 'darkblue', 17.2, 5.4);

planets.push(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

function orbit(target, object){
    //calculate distance between the two objects
    let distanceX = target.x - object.x;
    let distanceY = target.y - object.y;
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    //calculate gravity force
    let force = target.gravity / (distance * distance);
    let forceX = force * distanceX / distance;
    let forceY = force * distanceY / distance;

    //apply force to the object
    object.speed.x += forceX / object.weight;
    object.speed.y += forceY / object.weight;
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sun.draw();
    sun.update();
    
    planets.forEach(planet => {

        //orbit(sun, planet);

        planet.draw();
        planet.update();
    });
    requestAnimationFrame(animate);
}

animate();