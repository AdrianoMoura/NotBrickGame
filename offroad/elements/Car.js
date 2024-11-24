import Block from "../../elements/Block.js";
import { gameScreenHeight, gameScreenWidth } from "../../elements/conf.js";
import { acceleratedSpeed } from "./conf.js";

// Definitions for various brick types, each represented as a 2D array of 1s and 0s
// The Car class represents a movable car made of blocks
class Car {
    p5; // p5.js instance for rendering
    y; // Current Y position of the brick
    x; // Current X position
    blocks = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1],
    ]

    /**
     * Constructs a Car instance
     * @param {Object} p5 - p5.js instance
     * @param {number} x - Initial x position
     * @param {number} y - Initial Y position
     */
    constructor(p5, x, y) {
        this.p5 = p5;
        this.x = x;
        this.y = y;
    }

    /**
     * Draws the brick on the canvas
     */
    draw() {
        const blocks = this.blocks;

        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                const x = this.x + j;
                const y = this.y + i;

                // Draw only active blocks (1s in the array)
                if (blocks[i][j] === 1) {
                    if (y < gameScreenHeight && y >= 0) {
                        const block = new Block(this.p5, x, y);
                        block.draw();
                    }
                }
            }
        }
    }

    // Receive the keyboard input and move the car side to side
    move(dir) {
        this.x += dir

    }
}

export default Car;