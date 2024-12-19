const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game objects
const paddleWidth = 10;
const paddleHeight = 60;
const ballSize = 8;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 3,
    speed: 7
};

let leftPaddle = {
    x: 50,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0
};

let rightPaddle = {
    x: canvas.width - 50 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0
};

let gameStarted = false;
let animationId;

// Event listeners
startButton.addEventListener('click', startGame);

document.addEventListener('mousemove', (e) => {
    if (!gameStarted) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Move left paddle with mouse
    leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, mouseY - paddleHeight / 2));
});

// AI for right paddle
function updateAIPaddle() {
    const paddleCenter = rightPaddle.y + paddleHeight / 2;
    const ballCenter = ball.y;
    
    if (paddleCenter < ballCenter - 10) {
        rightPaddle.y += 5;
    } else if (paddleCenter > ballCenter + 10) {
        rightPaddle.y -= 5;
    }
    
    rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y));
}

// Game functions
function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    startButton.style.display = 'none';
    resetBall();
    animate();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ball.speed * (Math.random() * 2 - 1);
}

function checkCollision(paddle) {
    return ball.x + ballSize > paddle.x && 
           ball.x < paddle.x + paddleWidth &&
           ball.y + ballSize > paddle.y && 
           ball.y < paddle.y + paddleHeight;
}

function updateGame() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
        ball.dy *= -1;
    }
    
    // Ball collision with paddles
    if (checkCollision(leftPaddle) || checkCollision(rightPaddle)) {
        ball.dx *= -1.1; // Increase speed slightly
        ball.dy = (Math.random() * 10 - 5); // Add some randomness
    }
    
    // Scoring
    if (ball.x <= 0) {
        rightPaddle.score++;
        resetBall();
    } else if (ball.x + ballSize >= canvas.width) {
        leftPaddle.score++;
        resetBall();
    }
    
    // Update score display
    scoreElement.textContent = `${leftPaddle.score} - ${rightPaddle.score}`;
    
    // Update AI paddle
    updateAIPaddle();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
    
    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.setLineDash([]);
}

function animate() {
    updateGame();
    draw();
    animationId = requestAnimationFrame(animate);
}