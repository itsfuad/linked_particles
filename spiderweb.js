const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to the size of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Point class definition
class Point {
    constructor(x, y, radius, color, weight) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = 10 / weight;
        this.weight = weight;
        this.gravity = 1 * weight;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

function createPolygonPoints(centerX, centerY, radius, sides) {
    const angle = 360 / sides;
    const points = [];

    for (let i = 0; i < sides; i++) {
        const x = centerX + radius * Math.cos(angle * i * Math.PI / 180) + Math.random() * 30;
        const y = centerY + radius * Math.sin(angle * i * Math.PI / 180) + Math.random() * 30;
        const point = new Point(x, y, 1, 'white', 1);
        points.push(point);
    }

    return points;
}

function drawLinesBetweenPoints(centerX, centerY, points) {
    for (const point of points) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
        ctx.closePath();
    }
}

function createSubPoints(centerX, centerY, points, numSubPoints) {
    const subPoints = [];

    for (const point of points) {
        const subPointsGroup = [];

        for (let j = 0; j < numSubPoints; j++) {
            const x = centerX + (point.x - centerX) * j / numSubPoints;
            const y = centerY + (point.y - centerY) * j / numSubPoints;
            const subPoint = new Point(x, y, 1, 'white', 1);
            subPointsGroup.push(subPoint);
        }

        subPoints.push(subPointsGroup);
    }

    return subPoints.flat();
}

function drawPoints(points) {
    for (const point of points) {
        point.draw();
    }
}

function connectPoints(points) {
    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);

        const nextPoint = points[(i + 1) % points.length];
        const cPx = (points[i].x + nextPoint.x) / 2;
        const cPy = (points[i].y + nextPoint.y) / 2;

        ctx.quadraticCurveTo(cPx, cPy, nextPoint.x, nextPoint.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
        ctx.closePath();
    }
}

function init() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const initialPoint = new Point(centerX, centerY, 1, 'white', 1);
    initialPoint.draw();

    const polygonPoints = createPolygonPoints(centerX, centerY, 150, 7);
    drawPoints(polygonPoints);
    drawLinesBetweenPoints(centerX, centerY, polygonPoints);

    const subPoints = createSubPoints(centerX, centerY, polygonPoints, 20);
    drawPoints(subPoints);

    connectPoints(subPoints);
}

init();
