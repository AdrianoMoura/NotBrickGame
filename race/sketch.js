import Block from '../elements/Block.js';
import { width, height, backgroundColor, gameScreenWidth, gameScreenHeight } from '../elements/conf.js';
import GameHud from '../elements/GameHud.js';
import { deepCopyMatrix, preventKeyboard } from '../elements/helpers.js';
import preload from '../elements/preload.js';
import Car from './elements/Car.js';
import { gameName, levelThreshold, speedThreshold } from './elements/conf.js';

function sketch(p) {
    // HUD and game state variables
    let gameHud; // Heads-up display for the game
    let isGamePaused = false; // Flag to track if the game is paused
    let isGameOver = false; // Flag to track if the game is over

    let playerCar; // The player's car instance

    // Game dynamics
    let lastExecutionTime = 0; // Time tracking for screen move interval
    let speed = 1; // Initial speed of the game
    let level = 1; // Initial game level
    let score = 0; // Player's current score
    let hiScore = 0; // Highest score achieved by the player

    let acceleration = 1; // Acceleration factor for boosting speed

    let frame = 0; // Frame counter for game timing

    const enemyCars = []; // Array to hold enemy car instances
    let rail = [1, 1, 1, 0, 0]; // Pattern for the road's dashed line

    // Preload assets such as images, fonts, etc.
    p.preload = () => preload(p);

    // Setup function initializes the game environment
    p.setup = () => {
        const canvas = p.createCanvas(width, height); // Create the game canvas
        canvas.parent('canvas'); // Attach canvas to DOM

        gameHud = new GameHud(p); // Initialize the game HUD
        hiScore = window.localStorage.getItem(`${gameName}-hiscore`) ?? 0; // Load the high score from local storage

        playerCar = new Car(p, 1, 16); // Initialize the player's car

        spawnEnemy(); // Spawn initial enemy cars
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

        playerCar.draw(); // Render the player's car
        drawEnemyCars(); // Render all enemy cars
        drawRail(); // Render the road's dashed line

        // Control game speed using a time-based tick
        let currentTime = p.millis();
        const tick = (200 - 200 * 0.08 * (speed - 1)); // Calculate tick interval
        if (currentTime - lastExecutionTime >= tick / acceleration) {
            if (!isGamePaused) {
                moveRace(); // Move race elements down
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
            if (p.keyCode === p.RIGHT_ARROW) {
                playerCar.move(1); // Move the car to the right
            }
            if (p.keyCode === p.LEFT_ARROW) {
                playerCar.move(-1); // Move the car to the left
            }
            if (p.key === ' ') {
                acceleration = 2; // Enable speed boost
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
        if (p.key === ' ') {
            acceleration = 1; // Disable speed boost
        }

        if (p.keyCode === p.ESCAPE) {
            location.href = '/'; // Navigate back to the menu
        }
    };

    // Move the race forward by updating positions and logic
    function moveRace() {
        if (isGamePaused || isGameOver) {
            return;
        }

        frame++; // Increment frame counter

        enemyCars.forEach(e => {
            e.moveDown(); // Move enemy cars down
        });

        if (frame % 9 === 0) {
            spawnEnemy(); // Spawn a new enemy car every 9 frames
        }

        for (let i = 0; i < enemyCars.length; i++) {
            if (enemyCars[i] && enemyCars[i].y >= 20) {
                enemyCars.shift(); // Remove cars that move out of bounds
            }

            if (enemyCars[i] && enemyCars[i].y === 17) {
                score += 100; // Increment score when passing an enemy car

                if (score >= hiScore) {
                    hiScore = score; // Update high score
                    window.localStorage.setItem(`${gameName}-hiscore`, hiScore);
                }
            }
        }

        level = Math.floor(score / levelThreshold) + 1; // Update game level
        speed = Math.min(Math.floor(level / speedThreshold) + 1, 10); // Adjust game speed, and cap at the speed 10

        rail.unshift(rail.pop()); // Shift the road's dashed line pattern

        checkGameOver(); // Check if the game is over
    }

    // Spawn enemy cars in random positions
    function spawnEnemy() {
        const rand = Math.floor(Math.random() * 30); // Random number to decide spawning logic
        const spawnTwoCars = rand < Math.min(level, 25); // Decide if two cars should spawn, the odds increases as the level passes and cap at the level 25

        const positions = [Math.floor(Math.random() * 3)]; // Random lane for the first car

        if (spawnTwoCars) {
            let pos2 = Math.floor(Math.random() * 3); // Random lane for the second car
            while (pos2 === positions[0]) {
                pos2 = Math.floor(Math.random() * 3); // Ensure different lanes
            }
            positions.push(pos2);
        }

        for (let pos of positions) {
            const enemyCar = new Car(p, pos, -4); // Create enemy car
            enemyCars.push(enemyCar); // Add to the enemy car list
        }
    }

    // Render all enemy cars
    function drawEnemyCars() {
        enemyCars.forEach(e => {
            e.draw(); // Draw each enemy car
        });
    }

    // Render the road's dashed line
    function drawRail() {
        for (let i = 0; i < gameScreenHeight; i++) {
            if (rail[i % 5] === 1) {
                const block = new Block(p, 9, i); // Create a road block
                block.draw(); // Render the block
            }
        }
    }

    // Check if the game is over due to collision
    function checkGameOver() {
        enemyCars.forEach(e => {
            if (e.y + 3 >= playerCar.y && e.y - 2 <= playerCar.y && playerCar.pos === e.pos) {
                gameOver(); // End the game if collision occurs
            }
        });
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
        enemyCars.length = 0; // Clear enemy cars
        playerCar.pos = 1; // Reset player position
        score = 0; // Reset score
    }
}

// Initialize the game
new p5(sketch);

// Prevent default browser behavior during gameplay
preventKeyboard();
