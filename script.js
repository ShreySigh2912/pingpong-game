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
const WINNING_SCORE = 10;
const SPEED_INCREASE = 0.5;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 3,
    baseSpeed: 7,
    currentSpeed: 7
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
let gameEnded = false;
let animationId;

startButton.addEventListener('click', startGame);

document.addEventListener('mousemove', (e) => {
    if (!gameStarted || gameEnded) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, mouseY - paddleHeight / 2));
});

function updateAIPaddle() {
    const paddleCenter = rightPaddle.y + paddleHeight / 2;
    const ballCenter = ball.y;
    const aiSpeed = 5 + (ball.currentSpeed - ball.baseSpeed);
    
    if (paddleCenter < ballCenter - 10) {
        rightPaddle.y += aiSpeed;
    } else if (paddleCenter > ballCenter + 10) {
        rightPaddle.y -= aiSpeed;
    }
    
    rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y));
}

function startGame() {
    gameStarted = true;
    gameEnded = false;
    leftPaddle.score = 0;
    rightPaddle.score = 0;
    ball.currentSpeed = ball.baseSpeed;
    
    startButton.style.display = 'none';
    resetBall();
    animate();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ball.currentSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ball.currentSpeed * (Math.random() * 2 - 1);
}

function checkCollision(paddle) {
    return ball.x + ballSize > paddle.x && 
           ball.x < paddle.x + paddleWidth &&
           ball.y + ballSize > paddle.y && 
           ball.y < paddle.y + paddleHeight;
}

function checkWinner() {
    if (leftPaddle.score >= WINNING_SCORE || rightPaddle.score >= WINNING_SCORE) {
        gameEnded = true;
        startButton.style.display = 'block';
        startButton.textContent = 'Play Again';
        
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        const winner = leftPaddle.score >= WINNING_SCORE ? 'Player Wins!' : 'AI Wins!';
        ctx.fillText(winner, canvas.width / 2 - 100, canvas.height / 2);
        
        cancelAnimationFrame(animationId);
    }
}

function updateGame() {
    if (gameEnded) return;
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
        ball.dy *= -1;
    }
    
    if (checkCollision(leftPaddle) || checkCollision(rightPaddle)) {
        ball.dx *= -1.1;
        ball.dy = (Math.random() * 10 - 5);
    }
    
    if (ball.x <= 0) {
        rightPaddle.score++;
        ball.currentSpeed += SPEED_INCREASE;
        resetBall();
        checkWinner();
    } else if (ball.x + ballSize >= canvas.width) {
        leftPaddle.score++;
        ball.currentSpeed += SPEED_INCREASE;
        resetBall();
        checkWinner();
    }
    
    scoreElement.textContent = `${leftPaddle.score} - ${rightPaddle.score}`;
    updateAIPaddle();
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
    
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Speed: ${ball.currentSpeed.toFixed(1)}`, 10, 20);
}

function animate() {
    if (!gameEnded) {
        updateGame();
        draw();
        animationId = requestAnimationFrame(animate);
    }
}