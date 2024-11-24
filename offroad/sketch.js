import Block from '../elements/Block.js';
import { width, height, backgroundColor, gameScreenHeight, gameScreenWidth } from '../elements/conf.js';
import GameHud from '../elements/GameHud.js';
import { circularShift, maxContinuousOccorrence, preventKeyboard } from '../elements/helpers.js';
import preload from '../elements/preload.js';
import Car from './elements/Car.js';
import { gameName, levelThreshold, spawnAreaAboveScreen, speedThreshold } from './elements/conf.js';

function sketch(p) {
    // Variables for game status and HUD
    let gameHud; // Manages the display of game information
    let isGamePaused = false; // Tracks whether the game is currently paused
    let isGameOver = false; // Indicates whether the game has ended

    let playerCar; // Represents the player's car in the game

    // Game mechanics variables
    let lastExecutionTime = 0; // Tracks time for interval-based updates
    let speed = 1; // Current game speed
    let level = 1; // Current game level
    let score = 0; // Player's current score
    let hiScore = 0; // Player's highest score
    let frame = 0; // Frame counter

    let gapArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]; // Defines the initial gap pattern
    let gapSize = gameScreenWidth - level; // Determines the gap size for the car

    let acceleration = 1; // Boost factor for increased speed

    let terrain = []; // Stores terrain blocks on the screen

    // Preloads assets such as images or sounds
    p.preload = () => preload(p);

    // Initializes the game environment and setups the canvas
    p.setup = () => {
        const canvas = p.createCanvas(width, height); // Create a canvas for the game
        canvas.parent('canvas'); // Attach canvas to the HTML element

        gameHud = new GameHud(p); // Create the HUD for displaying game stats
        hiScore = window.localStorage.getItem(`${gameName}-hiscore`) ?? 0; // Load high score from local storage

        spawnPlayerCar(); // Initialize the player's car
    };

    // Main game loop to handle updates and rendering
    p.draw = () => {
        p.background(backgroundColor); // Clear the screen with the background color

        // Update and draw the HUD with current game stats
        gameHud.speed = speed;
        gameHud.level = level;
        gameHud.score = score;
        gameHud.hiScore = hiScore;
        gameHud.draw();
        gameHud.drawScore();

        // Draw the player's car
        playerCar.draw();
        drawTerrain(); // Render the terrain blocks

        // Manage game updates at fixed intervals
        let currentTime = p.millis();
        const tick = (200 - 200 * 0.08 * (speed - 1)); // Calculate the interval between updates
        if (currentTime - lastExecutionTime >= tick / acceleration) {
            if (!isGamePaused) {
                moveRace(); // Update the position of game elements
            }
            lastExecutionTime = currentTime;
        }

        // Display the game over screen if the game has ended
        if (isGameOver) {
            gameHud.showGameOverScreen();
        }
    };

    // Handles player input for movement and controls
    p.keyPressed = () => {
        if (!isGamePaused) {
            if (p.keyCode === p.RIGHT_ARROW) {
                playerCar.move(1); // Move car to the right
            }
            if (p.keyCode === p.LEFT_ARROW) {
                playerCar.move(-1); // Move car to the left
            }
            if (p.key === ' ') {
                acceleration = 2; // Activate speed boost
            }
        }

        if (p.keyCode === p.ENTER) {
            if (isGameOver) {
                resetGame(); // Restart the game
            } else {
                isGamePaused = !isGamePaused; // Toggle pause state
                gameHud.paused = isGamePaused; // Update HUD for pause
            }
        }
    };

    // Handles key releases for controls
    p.keyReleased = () => {
        if (p.key === ' ') {
            acceleration = 1; // Deactivate speed boost
        }

        if (p.keyCode === p.ESCAPE) {
            location.href = '/'; // Return to main menu
        }
    };

    // Creates the player's car at the start of the game
    function spawnPlayerCar() {
        playerCar = new Car(p, 3, 16); // Initialize car with default position
    }

    // Updates game elements for each "tick"
    function moveRace() {
        if (isGamePaused || isGameOver) {
            return;
        }

        moveTerrain(); // Shift terrain blocks downward
        frame++; // Increment frame count

        if (frame % 5 === 0) {
            spawnTerrain(); // Add new terrain above the screen
        }

        score += 10; // Increase player score

        // Update high score if the current score exceeds it
        if (score >= hiScore) {
            hiScore = score;
            window.localStorage.setItem(`${gameName}-hiscore`, hiScore);
        }

        // Adjust game level and speed based on score
        level = Math.floor(score / levelThreshold) + 1;
        speed = Math.min(Math.floor(level / speedThreshold) + 1, 10); // Cap speed at 10

        gapSize = Math.max(gameScreenWidth - level, 4); // Recalculate gap size

        // Adjust gap array to maintain a minimum gap size
        if (maxContinuousOccorrence(gapArray, 0) > gapSize) {
            for (let i = 0; i < gapArray.length; i++) {
                if (gapArray[i] === 0) {
                    gapArray[i] = 1;
                    break;
                }
            }
        }

        checkGameOver(); // Determine if the game is over
    }

    // Spawns a new section of terrain above the screen
    function spawnTerrain() {
        const gapMovementDirection = Math.floor(Math.random() * 3) - 1; // Determine gap movement direction

        let newGapArray = circularShift(gapArray, gapMovementDirection); // Shift the gap

        // Ensure the gap array adheres to the required gap size
        if (maxContinuousOccorrence(newGapArray, 0) < gapSize) {
            newGapArray = circularShift(gapArray, gapMovementDirection * -1);
        }

        gapArray = newGapArray; // Update the gap array

        // Create blocks for the new terrain section
        for (let j = 0; j < spawnAreaAboveScreen; j++) {
            for (let i = 0; i < gapArray.length; i++) {
                if (gapArray[i] === 1) {
                    terrain[j][i] = new Block(p, 0, 0);
                }
            }
        }
    }

    // Moves terrain blocks downward on the screen
    function moveTerrain() {
        terrain.unshift(Array.from({ length: gameScreenWidth }).fill(null)); // Add a new row at the top

        terrain = terrain.slice(0, gameScreenHeight + spawnAreaAboveScreen); // Remove excess rows
    }

    // Draws the terrain blocks on the canvas
    function drawTerrain() {
        for (let y = 0; y < terrain.length; y++) {
            for (let x = 0; x < terrain[y].length; x++) {
                const block = terrain[y][x];
                if (!!block) {
                    block.x = x;
                    block.y = y - spawnAreaAboveScreen;

                    if (block.y >= 0) { // Prevent draw of the block outside the screen boundaries
                        block.draw(); // Render the block
                    }
                }
            }
        }
    }

    // Checks if the game is over due to a collision
    function checkGameOver() {
        for (let yT = 15 + spawnAreaAboveScreen; yT < terrain.length; yT++) {
            for (let xT = 0; xT < terrain[yT].length; xT++) {
                const blockTerrain = terrain[yT][xT];

                if (!!blockTerrain) {
                    for (let y = 0; y < playerCar.blocks.length; y++) {
                        for (let x = 0; x < playerCar.blocks[y].length; x++) {
                            const carBlock = playerCar.blocks[y][x];

                            if (carBlock === 1) {
                                if (playerCar.x + x === xT && playerCar.y + y === yT - spawnAreaAboveScreen) {
                                    gameOver(); // Trigger game over
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Ends the game and sets the game over state
    function gameOver() {
        console.log('GameOver'); // Log game over event
        isGameOver = true;
        isGamePaused = true; // Pause the game
    }

    // Resets the game to its initial state
    function resetGame() {
        isGameOver = false;
        isGamePaused = false;
        spawnPlayerCar(); // Reset player's car
        terrain = []; // Clear terrain
        score = 0; // Reset score
        frame = 0; // Reset frame counter
        gapArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]; // Reset gap array
        gapSize = gameScreenWidth - level; // Recalculate gap size
    }
}

// Starts the game by initializing a p5 instance
new p5(sketch);

// Prevents default browser key actions during gameplay
preventKeyboard();
