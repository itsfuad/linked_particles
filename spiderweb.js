const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//set canvas size to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//create a point object
class Point{
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

function init(){
    //create a point at the center of the canvas
    let x = canvas.width/2;
    let y = canvas.height/2;
    let radius = 1;
    let color = 'white';
    let weight = 1;
    let point = new Point(x, y, radius, color, weight);
    point.draw();

    //create 7 corners of a regular polygon
    let corners = 7;
    let angle = 360/corners;
    let radius2 = 150;
    let points = [];
    for(let i = 0; i < corners; i++){
        let x2 = x + radius2 * Math.cos(angle * i * Math.PI/180) + Math.random() * 30;
        let y2 = y + radius2 * Math.sin(angle * i * Math.PI/180) + Math.random() * 30;
        let point = new Point(x2, y2, radius, color, weight);
        point.draw();
        points.push(point);
    }

    //create a line between each point
    for(let i = 0; i < points.length; i++){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(points[i].x, points[i].y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
        ctx.closePath();
    }

    let subPoints = [];
    //create 20 points between each point and center
    for(let i = 0; i < points.length; i++){
        //create 20 points between each point and center

        let subPoints2 = [];
        for(let j = 0; j < 20; j++){
            let x3 = x + (points[i].x - x) * j/20;
            let y3 = y + (points[i].y - y) * j/20;
            let point = new Point(x3, y3, radius, color, weight);
            subPoints2.push(point);
            point.draw();
        }
        subPoints.push(subPoints2);
    }

    //filter all same points
    let filteredPoints = [];
    for(let i = 0; i < subPoints.length; i++){
        for(let j = 0; j < subPoints[i].length; j++){
            let x = subPoints[i][j].x;
            let y = subPoints[i][j].y;
            let point = new Point(x, y, radius, color, weight);
            filteredPoints.push(point);
        }
    }

    connect(filteredPoints);

}

function connect(points){
    for (let i = 0; i < points.length; i++) {
        //create curved lines between left and right points
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        
        //cPx and cPy towards the center
        let cPx = (points[i].x + points[(i+1)%points.length].x)/2;
        let cPy = (points[i].y + points[(i+1)%points.length].y)/2;

        ctx.quadraticCurveTo(cPx, cPy, points[(i+1)%points.length].x, points[(i+1)%points.length].y);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
        ctx.closePath();
    }
}

init();