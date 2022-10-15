const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//set canvas size to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//solar system simulation

class SUN{
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