import Block from "./Block.js";
import { backgroundColor, blockSize, blockSpacing, gameScreenBorderWeight, gameScreenHeight, gameScreenPadding, gameScreenWidth, padding } from "./conf.js";

class GameHud {
    // GameHud manages the game's heads-up display (HUD), including score, level, speed, and visual elements.
    p5;
    boxWidth; // Width of the game screen boundary box
    boxHeight; // Height of the game screen boundary box
    scoreDisplayX; // X-coordinate for score display
    nextBrick; // The next brick to be displayed on the HUD

    level; // Current game level
    speed; // Current game speed
    score; // Current score
    hiScore; // Highest score
    paused; // Boolean to indicate if the game is paused

    constructor(p5) {
        // Initialize the GameHud instance with a p5.js reference
        this.p5 = p5;

        // Calculate the dimensions of the game screen box
        this.boxWidth = gameScreenWidth * (blockSize + blockSpacing) + gameScreenPadding + gameScreenBorderWeight;
        this.boxHeight = gameScreenHeight * (blockSize + blockSpacing) + gameScreenPadding + gameScreenBorderWeight;

        // Set X position for score display
        this.scoreDisplayX = this.boxWidth + padding + 8;
    }

    /**
     * Draw the game screen boundary and the grid of blocks
     */
    draw() {
        this.p5.stroke(0);
        this.p5.strokeWeight(gameScreenBorderWeight);
        this.p5.noFill();

        const x = padding;
        const y = padding;

        // Draw the main game boundary
        this.p5.rect(x, y, this.boxWidth, this.boxHeight);

        // Draw the grid of empty blocks as a visual aid
        for (let i = 0; i < gameScreenHeight; i++) {
            for (let j = 0; j < gameScreenWidth; j++) {
                const block = new Block(this.p5, j, i, true); // 'true' for disabled blocks
                block.draw();
            }
        }
    }
    
    /**
     * Draws the score, high score, level, and speed on the HUD
     */
    drawScore() {
        // Display the current score
        this.drawPixelFont(this.scoreDisplayX, 60, 'SCORE');
        this.drawLCDFont(this.p5.width - 10, 80, this.score, 6);

        // Display the high score
        this.drawPixelFont(320, 120, 'HI-SCORE');
        this.drawLCDFont(this.p5.width - 10, 140, this.hiScore, 6);

        // Display the current speed
        this.drawPixelFont(this.scoreDisplayX, 350, 'SPEED');
        this.drawLCDFont(this.scoreDisplayX + 38, 320, this.speed, 2, 28);

        // Display the current level
        this.drawPixelFont(this.scoreDisplayX + 55, 350, 'LEVEL');
        this.drawLCDFont(this.p5.width - 16, 320, this.level, 2, 28);

        // Show a pause message if the game is paused
        if (this.paused) {
            this.drawPixelFont(this.scoreDisplayX + 20, 460, 'PAUSE', 16);
        }
    }

    /**
     * Updates the next brick to be displayed
     * @param {Array} nextBrick - The next brick's matrix representation
     */
    setNextBrick(nextBrick) {
        this.nextBrick = nextBrick;
    }

    /**
     * Draws the preview of the next brick on the HUD
     */
    drawNextBrick() {
        this.p5.push();

        // Translate and scale for positioning and size adjustment
        this.p5.translate(308, 170);
        this.p5.scale(0.8);

        // Loop through the next brick matrix and draw each block
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                const visible = this.nextBrick[i] && this.nextBrick[i][j]; // Check if the block exists
                const block = new Block(this.p5, j, i, !visible); // Disable blocks that aren't part of the brick
                block.draw();
            }
        }

        this.p5.pop();
    }

    /**
     * Displays the game over screen overlay
     */
    showGameOverScreen() {
        const color = this.p5.color(backgroundColor);
        color.setAlpha(150); // Semi-transparent background
        this.p5.fill(color);
        this.p5.rect(0, 0, this.p5.width, this.p5.height);

        // Draw 'GAME OVER' text
        this.p5.fill(0);
        this.p5.textSize(80);
        this.p5.textFont(pixelFont); // Assumes 'pixelFont' is globally defined
        this.p5.textAlign(this.p5.CENTER);
        this.p5.textLeading(100);
        this.p5.text('GAME\nOVER', this.p5.width / 2, this.p5.height / 2);

        // Shadow effect for the text
        this.p5.fill(0, 0, 0, 50);
        this.p5.textSize(80);
        this.p5.textFont(pixelFont);
        this.p5.textAlign(this.p5.CENTER);
        this.p5.textLeading(100);
        this.p5.text('GAME\nOVER', this.p5.width / 2 + 5, this.p5.height / 2 + 5);
    }

    /**
     * Draws text using a pixel-style font
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} text - Text to display
     * @param {number} size - Font size
     */
    drawPixelFont(x, y, text, size = 11) {
        this.p5.fill(0);
        this.p5.textSize(size);
        this.p5.textFont(pixelFont); // Assumes 'pixelFont' is globally defined
        this.p5.textAlign(this.p5.LEFT);
        this.p5.text(text, x, y);
    }

    /**
     * Draws text using an LCD-style font
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} score - Number to display
     * @param {number} size - Total number of digits to display
     * @param {number} textSize - Font size for the text
     */
    drawLCDFont(x, y, score, size, textSize = 25) {
        const scoreText = score?.toString();

        this.p5.textSize(textSize);
        this.p5.textFont(lcdFont); // Assumes 'lcdFont' is globally defined
        this.p5.textAlign(this.p5.RIGHT);

        // Draw the background digits as dimmed
        const color = this.p5.color(0);
        color.setAlpha(20); // Dim color
        this.p5.fill(color);
        this.p5.text('0'.repeat(size), x, y);

        // Draw the actual score
        this.p5.fill(0);
        this.p5.text(scoreText, x, y);
    }
}

export default GameHud;
