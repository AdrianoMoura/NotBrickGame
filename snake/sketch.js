import Block from '../elements/Block.js';
import { width, height, backgroundColor, gameScreenWidth, gameScreenHeight } from '../elements/conf.js';
import GameHud from '../elements/GameHud.js';
import { deepCopyMatrix, preventKeyboard } from '../elements/helpers.js';
import preload from '../elements/preload.js';
import { gameName, levelThreshold, speedThreshold } from './elements/conf.js';
import Snake from './elements/Snake.js';

function sketch(p) {
    // HUD and game state variables
    let gameHud; // Heads-up display for the game
    let isGamePaused = false; // Flag to track if the game is paused
    let isGameOver = false; // Flag to track if the game is over

    let snake; // The player's car instance

    // Game dynamics
    let lastExecutionTime = 0; // Time tracking for screen move interval
    let speed = 1; // Initial speed of the game
    let level = 1; // Initial game level
    let score = 0; // Player's current score
    let hiScore = 0; // Highest score achieved by the player

    let food;

    // Preload assets such as images, fonts, etc.
    p.preload = () => preload(p);

    // Setup function initializes the game environment
    p.setup = () => {
        const canvas = p.createCanvas(width, height); // Create the game canvas
        canvas.parent('canvas'); // Attach canvas to DOM

        gameHud = new GameHud(p); // Initialize the game HUD
        hiScore = window.localStorage.getItem(`${gameName}-hiscore`) ?? 0; // Load the high score from local storage

        createSnake();
        spawnFood();
    };

    // Main game loop for rendering and logic updates
    p.draw = () => {
        p.background(backgroundColor); // Clear the canvas with the background color

        // Update and display the HUD
        gameHud.speed = speed; // Update speed in HUD
        gameHud.level = level; // Update level in HUD
        gameHud.score = score; // Update score in HUD
        gameHud.hiScore = hiScore; // Update high score in HUD

        gameHud.draw(); // Draw the main HUD
        gameHud.drawScore(); // Display the current score

        snake.draw(); // Render the snake car
        food.draw();

        // Control game speed using a time-based tick
        let currentTime = p.millis();
        const tick = (200 - 200 * 0.08 * (speed - 1)); // Calculate tick interval
        if (currentTime - lastExecutionTime >= tick) {
            if (!isGamePaused) {
                moveSnake(); // Move the snake in the direction
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
            // ChangeDirection Snake Direction
            if (p.keyCode === p.RIGHT_ARROW) {
                snake.changeDirection(1, 0);
            }
            if (p.keyCode === p.LEFT_ARROW) {
                snake.changeDirection(-1, 0);
            }
            if (p.keyCode === p.UP_ARROW) {
                snake.changeDirection(0, -1);
            }
            if (p.keyCode === p.DOWN_ARROW) {
                snake.changeDirection(0, 1);
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

    function spawnFood() {
        let foodCollideWithTail = false;
        let x;
        let y;

        do {
            foodCollideWithTail = false;
            
            x = Math.floor(Math.random() * gameScreenWidth);
            y = Math.floor(Math.random() * gameScreenHeight);

            for (let tail of snake.tail) {
                if (tail.block.x === x && tail.block.y === y) {
                    foodCollideWithTail = true;
                }
            }

            if (snake.x === x && snake.y === y) {
                foodCollideWithTail = true;
            }
        } while (foodCollideWithTail)

        food = new Block(p, x, y, false, true)
    }

    function moveSnake() {
        snake.move();
        detectCollision();
        detectFoodCollision();
    }

    function createSnake() {
        snake = new Snake(p, 3, 3); // Initialize the snake
    }

    function detectCollision() {
        if (snake.x > gameScreenWidth - 1 || snake.x < 0 || snake.y > gameScreenHeight - 1 || snake.y < 0) {
            gameOver();
        }

        if (snake.hitOwnTail()) {
            gameOver();
        }
    }

    function detectFoodCollision() {
        if (snake.x === food.x && snake.y === food.y) {
            snake.grow();
            spawnFood();
            score += 100;

            if (score >= hiScore) {
                hiScore = score; // Update high score
                window.localStorage.setItem(`${gameName}-hiscore`, hiScore);
            }

            level = Math.floor(score / levelThreshold) + 1; // Update game level
            speed = Math.floor(level / speedThreshold) + 1; // Adjust game speed
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
        createSnake();
        score = 0; // Reset score
    }
}

// Initialize the game
new p5(sketch);

// Prevent default browser behavior during gameplay
preventKeyboard();
