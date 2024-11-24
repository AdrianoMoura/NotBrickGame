// Importing configuration constants for block size, spacing, screen borders, and padding
import { blockSize, blockSpacing, gameScreenBorderWeight, gameScreenPadding, padding } from "./conf.js";

// Define the Block class to represent an individual block in the game
class Block {
    p5; // Reference to the p5.js instance
    x;  // X-coordinate of the block in the grid
    y;  // Y-coordinate of the block in the grid
    disabled; // Boolean indicating if the block is disabled (e.g., inactive or faded)

    // Initial offset values for the grid's starting position, considering padding and borders
    startX = padding + gameScreenBorderWeight + gameScreenPadding;
    startY = padding + gameScreenBorderWeight + gameScreenPadding;

    /**
     * Constructor to initialize a Block instance
     * @param {Object} p5 - Reference to the p5.js instance
     * @param {number} x - X-coordinate in the grid
     * @param {number} y - Y-coordinate in the grid
     * @param {boolean} [disabled=false] - Optional flag to mark the block as disabled
     */
    constructor(p5, x, y, disabled = false) {
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.disabled = disabled;
    }

    /**
     * Draws the block on the canvas
     * @param {number} [xRef=0] - Optional offset for X-axis reference (default: 0)
     * @param {number} [yRef=0] - Optional offset for Y-axis reference (default: 0)
     */
    draw(xRef = 0, yRef = 0) {
        // Set the base color for the block
        const color = this.p5.color(0); // Black color

        // Adjust color transparency if the block is disabled
        if (this.disabled) {
            color.setAlpha(20); // Make the color more transparent
        }

        // Set stroke color and weight for the outer block rectangle
        this.p5.stroke(color);
        this.p5.strokeWeight(2);
        this.p5.noFill(); // No fill color for the outer rectangle

        // Calculate the absolute X and Y positions for the block
        const x = this.startX + (blockSize + blockSpacing) * this.x + (blockSize + blockSpacing) * xRef;
        const y = this.startY + (blockSize + blockSpacing) * this.y + (blockSize + blockSpacing) * yRef;

        // Draw the outer rectangle representing the block
        this.p5.rect(x, y, blockSize, blockSize);

        // Set fill color and disable stroke for the inner rectangle
        this.p5.fill(color);
        this.p5.noStroke();

        // Draw the inner rectangle to create a bordered effect
        this.p5.rect(x + 5, y + 5, blockSize - 10, blockSize - 10);
    }
}

// Export the Block class as a module to be used in other files
export default Block;
