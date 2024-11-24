import Block from "../../elements/Block.js";
import { gameScreenHeight, gameScreenWidth } from "../../elements/conf.js";
import { acceleratedSpeed } from "./conf.js";

// Definitions for various brick types, each represented as a 2D array of 1s and 0s
export const carShape = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
    [1, 0, 1],
]

// The Car class represents a movable car made of blocks
class Car {
    p5; // p5.js instance for rendering
    y; // Current Y position of the brick

    pos; // Current position left, middle, right (0,1,2)

    /**
     * Constructs a Car instance
     * @param {Object} p5 - p5.js instance
     * @param {number} pos - Initial horizontal position
     * @param {number} y - Initial Y position
     */
    constructor(p5, pos, y) {
        this.p5 = p5;
        this.pos = pos;
        this.y = y;
    }

    /**
     * Draws the brick on the canvas
     */
    draw() {
        const blocks = [...carShape];

        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                const x = this.pos * 3 + j;
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
        if (dir === 1) {
            if (this.pos < 2) {
                this.pos++;
            }
        }
        if (dir === -1) {
            if (this.pos > 0) {
                this.pos--;
            }
        }
    }

    // Move the car 1 step down
    moveDown() {
        this.y++;
    }
}

export default Car;