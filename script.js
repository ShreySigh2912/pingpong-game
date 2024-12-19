// ... (previous game code remains)

// Analytics tracking
function trackGameEvent(eventName, eventData = {}) {
    try {
        // Send data to analytics endpoint
        fetch('https://api.pingponggame.com/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventName,
                timestamp: new Date().toISOString(),
                data: eventData
            })
        });
    } catch (error) {
        console.error('Analytics error:', error);
    }
}

// Track game start
function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    startButton.style.display = 'none';
    resetBall();
    animate();
    
    // Track game start
    trackGameEvent('game_start');
}

// Track scoring
function updateGame() {
    // ... (previous update code)
    
    // Scoring
    if (ball.x <= 0) {
        rightPaddle.score++;
        trackGameEvent('score', { player: 'ai', score: rightPaddle.score });
        resetBall();
    } else if (ball.x + ballSize >= canvas.width) {
        leftPaddle.score++;
        trackGameEvent('score', { player: 'human', score: leftPaddle.score });
        resetBall();
    }
    
    // ... (rest of update code)
}

// Track game end
window.addEventListener('beforeunload', () => {
    if (gameStarted) {
        trackGameEvent('game_end', {
            duration: (Date.now() - gameStartTime) / 1000,
            finalScore: {
                player: leftPaddle.score,
                ai: rightPaddle.score
            }
        });
    }
});