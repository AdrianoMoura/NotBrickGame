import Block from "../../elements/Block.js";
import { gameScreenHeight, gameScreenWidth } from "../../elements/conf.js";
import { acceleratedSpeed } from "./conf.js";

// Definitions for various brick types, each represented as a 2D array of 1s and 0s
export const brickTypes = {
    orangeRicky: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ],
    blueRicky: [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    clevelandZ: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    rhodeIslandZ: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    hero: [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ],
    teewee: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    smashBoy: [
        [1, 1],
        [1, 1],
    ],
};

// The Brick class represents a movable and rotatable piece composed of blocks
class Brick {
    p5; // p5.js instance for rendering
    x; // Current X position of the brick
    y; // Current Y position of the brick
    blockEnd; // Callback for when the brick is disabled
    getRestedBlocks; // Function to retrieve the resting blocks on the game screen
    detectGameOver; // Callback to trigger game over condition

    brickEnabled; // Boolean indicating if the brick is active
    blocks; // 2D array representing the brick's structure
    directionXHolded = 0; // Direction of X-axis movement when holding a key
    directionYHolded = 0; // Direction of Y-axis movement when holding a key
    intervalKeepHoldingX; // Interval ID for holding X movement
    intervalKeepHoldingY; // Interval ID for holding Y movement

    /**
     * Constructs a Brick instance
     * @param {Object} p5 - p5.js instance
     * @param {number} x - Initial X position
     * @param {number} y - Initial Y position
     * @param {function} blockEnd - Callback for when the brick is disabled
     * @param {function} getRestedBlocks - Function to retrieve resting blocks
     * @param {function} detectGameOver - Callback to detect game over
     * @param {Array} blocks - 2D array representing the brick's structure
     */
    constructor(p5, x, y, blockEnd, getRestedBlocks, detectGameOver, blocks) {
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.blockEnd = blockEnd;
        this.brickEnabled = true;
        this.getRestedBlocks = getRestedBlocks;
        this.detectGameOver = detectGameOver;

        this.blocks = blocks;

        // Center the brick horizontally on initialization
        this.x -= Math.floor(this.blocks[0].length / 2);
    }

    /**
     * Draws the brick on the canvas
     */
    draw() {
        const blocks = [...this.blocks];

        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                const x = this.x + j;
                const y = this.y + i;

                // Draw only active blocks (1s in the array)
                if (blocks[i][j] === 1) {
                    const block = new Block(this.p5, x, y);
                    if (y >= 0) { // Avoid drawing above the game screen
                        block.draw();
                    }
                }
            }
        }
    }

    /**
     * Checks and updates the X-axis movement when holding a direction
     */
    checkKeepHoldingX() {
        if (!this.brickEnabled) {
            clearInterval(this.intervalKeepHoldingX);
            return;
        }

        if (!this.willCollideWithWalls(this.directionXHolded)) {
            this.x += this.directionXHolded;
        }
    }

    /**
     * Checks and updates the Y-axis movement when holding a direction
     */
    checkKeepHoldingY() {
        if (!this.brickEnabled) {
            clearInterval(this.intervalKeepHoldingY);
            return;
        }

        if (!this.willCollideOnBottom(this.directionYHolded)) {
            this.y += this.directionYHolded;
        }
    }

    /**
     * Rotates the brick clockwise or counterclockwise
     * @param {boolean} clockwise - Whether to rotate clockwise
     */
    rotate(clockwise = true) {
        if (!this.brickEnabled) return;

        const blocks = this.blocks;

        // Perform matrix transposition and reverse rows/columns based on rotation direction
        const transposed = blocks[0].map((_, colIndex) => blocks.map(row => row[colIndex]));
        this.blocks = clockwise ? transposed.map(row => row.reverse()) : transposed.reverse();

        this.fixRotatedPosition(clockwise);
    }

    /**
     * Moves the brick in the specified direction
     * @param {number} dirX - Direction along the X-axis (-1, 0, 1)
     * @param {number} dirY - Direction along the Y-axis (-1, 0, 1)
     */
    move(dirX, dirY) {
        if (!this.brickEnabled) return;

        if (dirX !== 0) {
            if (!this.willCollideWithWalls(dirX)) {
                this.x += dirX;
            }
            this.intervalKeepHoldingX = setInterval(this.checkKeepHoldingX.bind(this), 250);
        } else {
            clearInterval(this.intervalKeepHoldingX);
        }

        this.directionXHolded = dirX;

        if (dirY !== 0) {
            if (!this.willCollideOnBottom(dirY)) {
                this.y += dirY;
            }
            this.intervalKeepHoldingY = setInterval(this.checkKeepHoldingY.bind(this), acceleratedSpeed);
        } else {
            clearInterval(this.intervalKeepHoldingY);
        }

        this.directionYHolded = dirY;
    }

    /**
     * Drops the brick one step down if possible
     */
    dropOne() {
        if (!this.willCollideOnBottom(1)) {
            this.y += 1;
        }
    }

    willCollideWithWalls(dir) {
        if (!this.brickEnabled) {
            return;
        }
    
        // Loop through each block in the brick
        for (let y = 0; y < this.blocks.length; y++) {
            for (let x = 0; x < this.blocks[y].length; x++) {
                if (this.blocks[y][x] === 1) { // Only consider active blocks (value 1)
                    const nextXPosition = this.x + dir + x; // Calculate the new X position after moving
    
                    // Check if the new position will go out of screen bounds
                    if (nextXPosition < 0 || nextXPosition >= gameScreenWidth) {
                        return true; // Collision with a wall
                    }
    
                    // Check if the block will collide with a resting block
                    const blockCollision = this.willCollideWithBlock(this.x, this.y, dir + x, y);
                    if (blockCollision) {
                        return true; // Collision with another block
                    }
                }
            }
        }
    
        return false; // No collisions detected
    }

    willCollideOnBottom(dir) {
        if (!this.brickEnabled) {
            return;
        }

        // Loop through each block in the brick
        for (let y = 0; y < this.blocks.length; y++) {
            for (let x = 0; x < this.blocks[y].length; x++) {
                if (this.blocks[y][x] === 1) { // Only consider active blocks (value 1)
                    const nextYPosition = this.y + dir + y; // Calculate the new Y position after moving

                    // Check if the new position is below the screen height
                    if (nextYPosition >= gameScreenHeight) {
                        this.disableBlock(); // If out of bounds, disable the brick
                        return true; // Collision with the bottom of the screen
                    }

                    // Check if the block will collide with a resting block
                    if (this.willCollideWithBlock(this.x, this.y, x, dir + y)) {
                        this.disableBlock(); // Disable the brick on collision
                        return true; // Collision detected
                    }
                }
            }
        }

        return false; // No collisions detected
    }

    fixRotatedPosition(clockwise) {
        // Loop through each block in the brick
        for (let y = 0; y < this.blocks.length; y++) {
            for (let x = 0; x < this.blocks[y].length; x++) {
                if (this.blocks[y][x] === 1) { // Only consider active blocks (value 1)
                    let nextXPosition = this.x + x;
    
                    // Adjust X position if it goes out of bounds (left or right walls)
                    while (nextXPosition < 0 || nextXPosition >= gameScreenWidth) {
                        this.x += nextXPosition < 0 ? 1 : -1; // Push brick in opposite direction
                        nextXPosition = this.x + x;
                    }
    
                    let nextYPosition = this.y + y;
    
                    // Adjust Y position if it goes out of bounds (bottom of the screen)
                    while (nextYPosition >= gameScreenHeight) {
                        this.y--; // Push brick upwards
                        nextYPosition = this.y + y;
                    }
    
                    // It must be a better way to detect the conflict when the player try to rotate to a impossible position
                    // But I not gonna bother
                    if (this.willCollideWithBlock(this.x, this.y, x, y)) {
                        this.y--; // Attempt to resolve by moving up
    
                        // Reverse the rotation if collision persists
                        if (this.willCollideWithBlock(this.x, this.y, x, y)) {
                            this.y++;
                            this.rotate(!clockwise); // Undo the rotation
                        }
                    }
                }
            }
        }
    
        return false; // No further adjustments needed
    }

    willCollideWithBlock(xPosition, yPosition, nextXPosition, nextYPosition) {
        if (!this.brickEnabled) {
            return;
        }
    
        const restedBlocks = this.getRestedBlocks(); // Get the current state of resting blocks
    
        // Loop through each block in the resting blocks
        for (let y = 0; y < restedBlocks.length; y++) {
            for (let x = 0; x < restedBlocks[y].length; x++) {
                if (restedBlocks[y][x] === 1) { // Only consider active blocks (value 1)
                    const checkPosY = y;
                    const checkPosX = x;
    
                    // Check if the brick's new position overlaps with a resting block
                    if (yPosition + nextYPosition === checkPosY && xPosition + nextXPosition === checkPosX) {
                        if (yPosition === 0) { // If collision happens at the top row
                            this.detectGameOver(); // Trigger game over
                            this.disableBlock(); // Disable the current brick
                        }
                        return true; // Collision detected
                    }
                }
            }
        }
    
        return false; // No collisions detected
    }

    disableBlock() {
        if (this.brickEnabled) {
            this.brickEnabled = false; // Mark the brick as inactive
            clearInterval(this.intervalKeepHoldingX); // Stop X-axis movement intervals
            clearInterval(this.intervalKeepHoldingY); // Stop Y-axis movement intervals
            this.directionXHolded = 0; // Reset X-axis direction
            this.directionYHolded = 0; // Reset Y-axis direction
            this.blockEnd(); // Trigger the block end callback
        }
    }
}

export default Brick;