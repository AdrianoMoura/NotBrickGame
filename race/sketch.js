import Block from '../elements/Block.js';
import { width, height, backgroundColor, gameScreenWidth, gameScreenHeight } from '../elements/conf.js';
import GameHud from '../elements/GameHud.js';
import { deepCopyMatrix, preventKeyboard } from '../elements/helpers.js';
import preload from '../elements/preload.js';
import Car from './elements/Car.js';
import { gameName, levelThreshold, speedThreshold } from './elements/conf.js';

function sketch(p) {
    // HUD and game state variables
    let gameHud;
    let isGamePaused = false;
    let isGameOver = false;

    let playerCar;

    // Game dynamics
    let lastExecutionTime = 0;
    let speed = 1; // Initial speed of the game
    let level = 1;
    let score = 0;
    let hiScore = 0;

    let acceleration = 1;

    let frame = 0;

    const enemyCars = [];
    let rail = [1, 1, 1, 0, 0];

    // Preload assets
    p.preload = () => preload(p);

    // Setup function runs once when the game starts
    p.setup = () => {
        const canvas = p.createCanvas(width, height); // Create the game canvas
        canvas.parent('canvas'); // Attach canvas to DOM

        gameHud = new GameHud(p); // Initialize HUD
        hiScore = window.localStorage.getItem(`${gameName}-hiscore`) ?? 0; // Load high score

        playerCar = new Car(p, 1, 16);

        spawnEnemy();
    };

    // Main game loop
    p.draw = () => {
        p.background(backgroundColor); // Clear the canvas

        // Update HUD information
        gameHud.speed = speed;
        gameHud.level = level;
        gameHud.score = score;
        gameHud.hiScore = hiScore;

        gameHud.score = score;
        gameHud.hiScore = hiScore;

        gameHud.draw(); // Draw the main HUD
        gameHud.drawScore(); // Display the current score

        playerCar.draw();
        drawEnemyCars();
        drawRail();

        // Control the race speed
        let currentTime = p.millis();
        const tick = (200 - 200 * 0.08 * (speed - 1))
        console.log(tick)
        if (currentTime - lastExecutionTime >= tick / acceleration) {
            if (!isGamePaused) {
                moveRace();
            }
            lastExecutionTime = currentTime;
        }

        // Show game over screen if the game is over
        if (isGameOver) {
            gameHud.showGameOverScreen();
        }
    };

    // Handle key presses for car control
    p.keyPressed = () => {
        if (!isGamePaused) {
            if (p.keyCode === p.RIGHT_ARROW) {
                playerCar.move(1);
            }
            if (p.keyCode === p.LEFT_ARROW) {
                playerCar.move(-1);
            }
            if (p.key === ' ') {
                acceleration = 2;
            }
        }

        if (p.keyCode === p.ENTER) {
            if (isGameOver) {
                resetGame(); // Restart the game
            } else {
                isGamePaused = !isGamePaused; // Pause or unpause the game
                gameHud.paused = isGamePaused;
            }
        }
    };

    // Handle key releases
    p.keyReleased = () => {
        if (p.key === ' ') {
            acceleration = 1;
        }

        if (p.keyCode === p.ESCAPE) {
            location.href = '/'; // Return to menu
        }
    };

    function moveRace() {
        if (isGamePaused || isGameOver) {
            return;
        }

        frame++;

        enemyCars.forEach(e => {
            e.moveDown();
        })

        if (frame % 9 === 0) {
            spawnEnemy();
        }

        for (let i = 0; i < enemyCars.length; i++) {

            if (enemyCars[i] && enemyCars[i].y >= 20) {
                enemyCars.shift();
            }

            if (enemyCars[i] && enemyCars[i].y === 17) {
                score += 100;

                if (score >= hiScore) {
                    hiScore = score; // Update high score
                    window.localStorage.setItem(`${gameName}-hiscore`, hiScore);
                }

            }
        }

        level = Math.floor(score / levelThreshold) + 1; // Update level
        speed = Math.min(Math.floor(level / speedThreshold) + 1, 10); // Adjust speed

        rail.unshift(rail.pop());

        checkGameOver();
    }

    function spawnEnemy() {

        const rand = Math.floor(Math.random() * 30);
        const spawnTwoCars = rand < Math.min(level, 25)

        const positions = [Math.floor(Math.random() * 3)]

        if (spawnTwoCars) {
            let pos2 = Math.floor(Math.random() * 3)

            while (pos2 === positions[0]) {
                pos2 = Math.floor(Math.random() * 3)
            }

            positions.push(pos2)
        }

        for (let pos of positions) {
            const enemyCar = new Car(p, pos, -4);
            enemyCars.push(enemyCar);
        }
    }

    function drawEnemyCars() {
        enemyCars.forEach(e => {
            e.draw();
        })
    }

    function drawRail() {
        for (let i = 0; i < gameScreenHeight; i++) {
            if (rail[i % 5] === 1) {
                const block = new Block(p, 9, i);
                block.draw();
            }
        }
    }

    function checkGameOver() {
        enemyCars.forEach(e => {
            if (e.y + 3 >= playerCar.y && e.y - 2 <= playerCar.y && playerCar.pos === e.pos) {
                gameOver();
            }
        })
    }

    // Ends the game
    function gameOver() {
        console.log('GameOver');
        isGameOver = true;
        isGamePaused = true;
    }

    // Resets the game to its initial state
    function resetGame() {
        isGameOver = false;
        isGamePaused = false;
        enemyCars.length = 0
        playerCar.pos = 1;
        score = 0;
    }
}

// Initialize the game
new p5(sketch);

// Prevent keyboard scrolling during gameplay
preventKeyboard();
