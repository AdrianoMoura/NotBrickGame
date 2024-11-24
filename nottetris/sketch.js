import Block from '../elements/Block.js';
import { width, height, backgroundColor, gameScreenWidth, gameScreenHeight } from '../elements/conf.js';
import GameHud from '../elements/GameHud.js';
import { deepCopyMatrix, preventKeyboard } from '../elements/helpers.js';
import preload from '../elements/preload.js';
import Brick, { brickTypes } from './elements/Brick.js';
import { gameName, levelThreshold, speedThreshold } from './elements/conf.js';

function sketch(p) {
    // HUD and game state variables
    let gameHud;
    let actualBrick; // Current active brick
    let restedBlocks = Array.from({ length: gameScreenHeight }, () => Array(gameScreenWidth).fill(0)); // Grid of settled blocks
    let lastExecutionTime = 0; // Time tracking for brick drop interval
    let isGamePaused = false;
    let isGameOver = false;

    // Game dynamics
    let speed = 1; // Initial speed of the game
    let level = 1;
    let nextBrick; // Preview of the next brick
    let score = 0;
    let hiScore = 0;

    // Preload assets
    p.preload = () => preload(p);

    // Setup function runs once when the game starts
    p.setup = () => {
        const canvas = p.createCanvas(width, height); // Create the game canvas
        canvas.parent('canvas'); // Attach canvas to DOM

        gameHud = new GameHud(p); // Initialize HUD
        hiScore = window.localStorage.getItem(`${gameName}-hiscore`) ?? 0; // Load high score

        defineNextBrick(); // Generate the first "next brick"
        newBlock(); // Create the first active brick
    };

    // Main game loop
    p.draw = () => {
        p.background(backgroundColor); // Clear the canvas

        // Update HUD information
        gameHud.speed = speed;
        gameHud.level = level;
        gameHud.score = score;
        gameHud.hiScore = hiScore;

        gameHud.draw(); // Draw the main HUD
        gameHud.drawScore(); // Display the current score
        gameHud.drawNextBrick(); // Show the preview of the next brick

        actualBrick.draw(); // Draw the active brick
        drawRestedBlocks(); // Draw blocks that have settled

        // Control the brick's automatic downward movement
        let currentTime = p.millis();
        if (currentTime - lastExecutionTime >= 1000 / speed) {
            if (!isGamePaused) {
                actualBrick.dropOne(); // Move the brick one step down
            }
            lastExecutionTime = currentTime;
        }

        // Check for completed lines and update game state
        if (!isGamePaused) {
            checkLines();
        }

        // Show game over screen if the game is over
        if (isGameOver) {
            gameHud.showGameOverScreen();
        }
    };

    // Handle key presses for brick control
    p.keyPressed = () => {
        if (!isGamePaused) {
            if (p.keyCode === p.RIGHT_ARROW) {
                actualBrick.move(1, 0); // Move brick right
            }
            if (p.keyCode === p.LEFT_ARROW) {
                actualBrick.move(-1, 0); // Move brick left
            }
            if (p.keyCode === p.DOWN_ARROW) {
                actualBrick.move(0, 1); // Move brick down
            }
            if (p.key === ' ') {
                actualBrick.rotate(); // Rotate brick
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
        if ([p.RIGHT_ARROW, p.LEFT_ARROW, p.DOWN_ARROW].includes(p.keyCode)) {
            actualBrick.move(0, 0); // Stop brick movement
        }
        
        if (p.keyCode === p.ESCAPE) {
            location.href = '../hub'; // Return to menu
        }
    };

    // Creates a new active brick
    function newBlock() {
        actualBrick = new Brick(p, gameScreenWidth / 2, 0, brickRested, getRestedBlocks, gameOver, nextBrick);
        defineNextBrick(); // Update the "next brick"
    }

    // Randomly selects the next brick
    function defineNextBrick() {
        const keys = Object.keys(brickTypes);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        nextBrick = brickTypes[randomKey];
        gameHud.setNextBrick(nextBrick); // Update HUD with new preview
    }

    // Callback when a brick has settled
    function brickRested() {
        if (!isGameOver) {
            addBrickToRestedBlocks(actualBrick); // Add the brick to the grid
            newBlock(); // Spawn a new brick
        }
    }

    // Provides the grid of settled blocks
    function getRestedBlocks() {
        return restedBlocks;
    }

    // Draw all settled blocks on the screen
    function drawRestedBlocks() {
        for (let y = 0; y < restedBlocks.length; y++) {
            for (let x = 0; x < restedBlocks[y].length; x++) {
                if (restedBlocks[y][x] === 1) {
                    const block = new Block(p, x, y);
                    block.draw();
                }
            }
        }
    }

    // Adds a brick to the grid of settled blocks
    function addBrickToRestedBlocks(brick) {
        const blocks = brick.blocks;

        // I dont know why but for some reason the reference of memory for the rested blocks is causing an error when I need to add a new block
        // This bug only happens after some time of playing
        // Making a deep clone of the array, making the addition on then and only copying to the final array seens to solve the issue
        // Gonna keep testing but I dont wanna try to understand
        const newRestedBlocks = deepCopyMatrix(restedBlocks);

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x] === 1) {
                    const restedBlockX = brick.x + x;
                    const restedBlockY = brick.y + y;

                    newRestedBlocks[restedBlockY][restedBlockX] = 1; // Add the block to the grid
                }
            }
        }

        restedBlocks = deepCopyMatrix(newRestedBlocks); // Update the main grid
    }

    // Checks for completed lines and updates the game state
    function checkLines() {
        const linesCompleted = restedBlocks.filter(line => !line.includes(0)); // Full lines

        if (linesCompleted.length > 0) {
            isGamePaused = true; // Pause the game while clearing lines

            const linesRemaining = restedBlocks.filter(line => line.includes(0)); // Incomplete lines

            // Calculate the score, making combos multiplies the received score
            for (let i = 1; i<=linesCompleted.length; i++) {
                score += i * 10; // Update score
            }
            
            if (score >= hiScore) {
                hiScore = score; // Update high score
                window.localStorage.setItem(`${gameName}-hiscore`, hiScore);
            }

            // Clear completed lines after a short delay
            setTimeout(() => {
                restedBlocks = restedBlocks.map(line => (line.includes(0) ? line : Array(gameScreenWidth).fill(0)));
            }, 200);

            // Shift remaining lines down
            setTimeout(() => {
                restedBlocks = [
                    ...Array(linesCompleted.length).fill(Array(gameScreenWidth).fill(0)),
                    ...linesRemaining,
                ];
            }, 500);

            setTimeout(() => {
                isGamePaused = false; // Resume the game
            }, 600);

            level = Math.floor(score / levelThreshold) + 1; // Update level
            speed = Math.floor(level / speedThreshold) + 1; // Adjust speed
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
        restedBlocks = Array.from({ length: gameScreenHeight }, () => Array(gameScreenWidth).fill(0)); // Clear the grid
        isGameOver = false;
        isGamePaused = false;
        score = 0;
        newBlock(); // Spawn a new brick
    }
}

// Initialize the game
new p5(sketch);

// Prevent keyboard scrolling during gameplay
preventKeyboard();
