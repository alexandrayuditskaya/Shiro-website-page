document.addEventListener("DOMContentLoaded", function () {
    const playGameBtn = document.getElementById("play-game-btn");
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");

    gameCanvas.width = 500;
    gameCanvas.height = 400;

    let catImg = new Image();
    catImg.src = "img/gamepfp.jpeg"; 

    let bird = { x: 50, y: 150, width: 25, height: 25, velocity: 0, gravity: 0.6 };
    let pipes = [];
    let gameRunning = false;
    let score = 0;

    function startGame() {
        gameCanvas.style.display = "block";
        playGameBtn.style.visibility = "hidden";  
        bird.y = 150;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        gameRunning = true;
        spawnPipes();
        gameLoop();
    }

    function spawnPipes() {
        setInterval(() => {
            if (gameRunning) {
                let pipeHeight = Math.floor(Math.random() * (200 - 100) + 100);
                let gapSize = 150;

                pipes.push({ x: gameCanvas.width, y: 0, width: 50, height: pipeHeight, passed: false }); 
                pipes.push({ x: gameCanvas.width, y: pipeHeight + gapSize, width: 50, height: gameCanvas.height - pipeHeight - gapSize, passed: false });
            }
        }, 2000);
    }

    function update() {
        if (!gameRunning) return;

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        pipes.forEach(pipe => {
            pipe.x -= 3;

            if (!pipe.passed && pipe.x + pipe.width < bird.x) {
                score++;
                pipe.passed = true; 
            }
        });

        pipes = pipes.filter(pipe => pipe.x > -50);

        pipes.forEach(pipe => {
            if (
                bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                bird.y < pipe.y + pipe.height &&
                bird.y + bird.height > pipe.y
            ) {
                gameOver();
            }
        });

        if (bird.y >= gameCanvas.height || bird.y <= 0) {
            gameOver();
        }
    }

    function gameOver() {
        gameRunning = false;
        setTimeout(() => {
            alert(`Game Over! Your Score: ${score}`); 
            playGameBtn.style.visibility = "visible";
            gameCanvas.style.display = "none";
        }, 200);
    }

    function gameLoop() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        ctx.drawImage(catImg, bird.x, bird.y, bird.width, bird.height);

        ctx.fillStyle = "green";
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
        });

        update();
        if (gameRunning) requestAnimationFrame(gameLoop);
    }

    document.addEventListener("keydown", function (event) {
        if (event.code === "ArrowUp") {
            bird.velocity = -7;
        }
    });

    playGameBtn.addEventListener("click", startGame);
});
