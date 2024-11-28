import Block from "../../elements/Block.js";
import { gameScreenHeight, gameScreenWidth } from "../../elements/conf.js";

// Definitions for various brick types, each represented as a 2D array of 1s and 0s
// The Car class represents a movable car made of blocks
class Pad {
    x; // Current X position
    padSize = 3 // Size of the pad
    direction = 0 // last direction pad moved

    /**
     * Constructs a Car instance
     * @param {Object} p5 - p5.js instance
     * @param {number} x - Initial x position
     */
    constructor(p5, x) {
        this.p5 = p5;
        this.x = x;
    }

    /**
     * Draws the brick on the canvas
     */
    draw() {
        for (let i = 0; i < this.padSize; i++) {
            const block = new Block(this.p5, this.x + i, gameScreenHeight-1);
            block.draw();
        }
    }

    // Receive the keyboard input and move the car side to side
    move(dir) {
        if ((dir < 0 && this.x > 0) || (dir > 0 && this.x + this.padSize < gameScreenWidth)) {
            this.x += dir
            this.direction = dir;
        }

        setTimeout(() => {
            this.direction = 0;
        }, 1000)
    }
}

export default Pad;