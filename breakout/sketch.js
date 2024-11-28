import Block from '../elements/Block.js';
import { width, height, backgroundColor, gameScreenWidth, gameScreenHeight } from '../elements/conf.js';
import GameHud from '../elements/GameHud.js';
import { deepCopyMatrix, preventKeyboard } from '../elements/helpers.js';
import preload from '../elements/preload.js';
import Ball from './elements/Ball.js';
import { gameName, levelThreshold, speedThreshold } from './elements/conf.js';
import Pad from './elements/Pad.js';

const levelShape = [
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],

    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    ], [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
    ]
]

function sketch(p) {
    // HUD and game state variables
    let gameHud; // Heads-up display for the game
    let isGamePaused = false; // Flag to track if the game is paused
    let isGameOver = false; // Flag to track if the game is over

    let pad; // The player's pad instance
    let ball; // Ball instance

    // Game dynamics
    let lastExecutionTime = 0; // Time tracking for screen move interval
    let speed = 1; // Initial speed of the game
    let level = 1; // Initial game level
    let score = 0; // Player's current score
    let hiScore = 0; // Highest score achieved by the player

    let actualLevel = 0;
    let activeLevel;

    // Preload assets such as images, fonts, etc.
    p.preload = () => preload(p);

    // Setup function initializes the game environment
    p.setup = () => {
        const canvas = p.createCanvas(width, height); // Create the game canvas
        canvas.parent('canvas'); // Attach canvas to DOM

        gameHud = new GameHud(p); // Initialize the game HUD
        hiScore = window.localStorage.getItem(`${gameName}-hiscore`) ?? 0; // Load the high score from local storage

        createPad();
        createBall();

        setLevel();
    };

    // Main game loop for rendering and logic updates
    p.draw = () => {
        p.background(backgroundColor); // Clear the canvas with the background color

        console.log(pad.direction);

        // Update and display the HUD
        gameHud.speed = speed; // Update speed in HUD
        gameHud.level = level; // Update level in HUD
        gameHud.score = score; // Update score in HUD
        gameHud.hiScore = hiScore; // Update high score in HUD

        gameHud.draw(); // Draw the main HUD
        gameHud.drawScore(); // Display the current score

        ball.draw(); // Render the ball
        pad.draw(); // Render the pad

        renderLevel(); //Render the level

        // Control game speed using a time-based tick
        let currentTime = p.millis();
        const tick = (200 - 200 * 0.08 * (speed - 1)); // Calculate tick interval
        if (currentTime - lastExecutionTime >= tick) {
            if (!isGamePaused) {
                update();
            }
            lastExecutionTime = currentTime;
        }

        // Show game over screen if the game is over
        if (isGameOver) {
            gameHud.showGameOverScreen();
        }
    };

    // Handle key presses for car movement and game controls
    p.keyPressed = () => {
        if (!isGamePaused) {
            // ChangeDirection Pad Direction
            if (p.keyCode === p.RIGHT_ARROW) {
                pad.move(1);
            }
            if (p.keyCode === p.LEFT_ARROW) {
                pad.move(-1);
            }
        }

        if (p.keyCode === p.ENTER) {
            if (isGameOver) {
                resetGame(); // Restart the game if over
            } else {
                isGamePaused = !isGamePaused; // Toggle pause state
                gameHud.paused = isGamePaused; // Update HUD for pause state
            }
        }
    };

    // Handle key releases
    p.keyReleased = () => {
        if (p.keyCode === p.ESCAPE) {
            location.href = '../hub'; // Return to menu
        }
    };

    function update() {
        ball.update(pad);

        checkCollision(ball);

        let count = 0;
        for (let y = 0; y < activeLevel.length; y++) {
            for (let x = 0; x < activeLevel[y].length; x++) {
                count += activeLevel[y][x];
            }
        }

        if (count === 0) {
            passLevel();
        }

        if (ball.y === gameScreenHeight - 1) {
            gameOver();
        }
    }

    // Returns the situation around the ball to check a collision
    function checkCollision(ball) {
        let hitHorizontally = false;
        let hitVertically = false;

        // Check if hit block horizontally
        if (activeLevel[ball.y]) {
            if (activeLevel[ball.y][ball.x + 1] === 1) {
                activeLevel[ball.y][ball.x + 1] = 0;
                ball.flipX();
                increaseScore();
                hitHorizontally = true;
            }

            if (activeLevel[ball.y][ball.x - 1] === 1) {
                activeLevel[ball.y][ball.x - 1] = 0;
                ball.flipX();
                increaseScore();
                hitHorizontally = true;
            }
        }

        // Check if hit block vertically
        if (activeLevel[ball.y - 1]) {
            if (activeLevel[ball.y - 1][ball.x] === 1) {
                activeLevel[ball.y - 1][ball.x] = 0;
                ball.flipY();
                increaseScore();
                hitVertically = true;
            }
        }

        if (activeLevel[ball.y + 1]) {
            if (activeLevel[ball.y + 1][ball.x] === 1) {
                activeLevel[ball.y + 1][ball.x] = 0;
                ball.flipY();
                increaseScore();
                hitVertically = true;
            }
        }

        // Check if hit block at the corner
        if (hitHorizontally || hitVertically) {
            return
        }

        //Top left
        if (activeLevel[ball.y - 1] && ball.direction[0] === -1 && ball.direction[1] === -1) {
            if (activeLevel[ball.y - 1][ball.x - 1] === 1) {
                activeLevel[ball.y - 1][ball.x - 1] = 0;
                ball.flipY();
                ball.flipX();
                increaseScore();
            }
        }

        // Top right
        if (activeLevel[ball.y - 1] && ball.direction[0] === 1 && ball.direction[1] === -1) {
            if (activeLevel[ball.y - 1][ball.x + 1] === 1) {
                activeLevel[ball.y - 1][ball.x + 1] = 0;
                ball.flipY();
                ball.flipX();
                increaseScore();
            }
        }

        // Bottom left
        if (activeLevel[ball.y + 1] && ball.direction[0] === -1 && ball.direction[1] === 1) {
            if (activeLevel[ball.y + 1][ball.x - 1] === 1) {
                activeLevel[ball.y + 1][ball.x - 1] = 0;
                ball.flipY();
                ball.flipX();
                increaseScore();
            }
        }

        //Bottom right
        if (activeLevel[ball.y + 1] && ball.direction[0] === 1 && ball.direction[1] === 1) {
            if (activeLevel[ball.y + 1][ball.x + 1] === 1) {
                activeLevel[ball.y + 1][ball.x + 1] = 0;
                ball.flipY();
                ball.flipX();
                increaseScore();
            }
        }
    }

    function createPad() {
        pad = new Pad(p, 3); // Initialize the pad
    }

    function createBall() {
        ball = new Ball(p); // Initialize the pad
    }

    function renderLevel() {

        for (let y = 0; y < activeLevel.length; y++) {
            for (let x = 0; x < activeLevel[y].length; x++) {

                if (activeLevel[y][x] === 1) {
                    const block = new Block(p, x, y);
                    block.draw();
                }

            }
        }
    }

    function setLevel() {
        actualLevel = level % (levelShape.length + 1)
        activeLevel = deepCopyMatrix(levelShape[actualLevel - 1]);
    }

    function passLevel() {
        level++;

        ball.reset();

        setLevel();
    }

    function increaseScore() {
        score += 100; // Update score

        if (score >= hiScore) {
            hiScore = score; // Update high score
            window.localStorage.setItem(`${gameName}-hiscore`, hiScore);
        }
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
        createPad();
        createBall();
        setLevel();
        score = 0; // Reset score
        speed = 1;
        level = 1;
    }
}

// Initialize the game
new p5(sketch);

// Prevent default browser behavior during gameplay
preventKeyboard();
