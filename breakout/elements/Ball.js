import Block from "../../elements/Block.js";
import { gameScreenHeight, gameScreenWidth } from "../../elements/conf.js";
import { acceleratedSpeed } from "./conf.js";

// Definitions for various brick types, each represented as a 2D array of 1s and 0s
// The Car class represents a movable car made of blocks
class Ball {
    x; // Current X position
    y; // Current X position
    direction; // Ball Direction

    /**
     * Constructs a Car instance
     * @param {Object} p5 - p5.js instance
     */
    constructor(p5) {
        this.p5 = p5;

        this.reset();

        const xDirection = [-1, 1][Math.floor(Math.random() * 2)]

        this.direction = [xDirection, 1];
    }

    /**
     * Draws the block on the canvas
     */
    draw() {
        const block = new Block(this.p5, this.x, this.y);
        block.draw();
    }

    reset() {
        this.x = 4;
        this.y = 11;
    }

    update(pad) {
        if (
            this.x + this.direction[0] < 0 ||
            this.x + this.direction[0] > gameScreenWidth - 1
        ) {
            this.flipX();
        }

        if (this.y + this.direction[1] === gameScreenHeight - 1) {
            if (this.x >= pad.x - 1 && this.x < pad.x + pad.padSize + 1) {
                this.flipY();

                if (this.x === pad.x - 1 || this.x === pad.x + pad.padSize) {
                    this.flipX();
                } else {
                    if (pad.direction > 0) {
                        this.direction[0] = 1
                    } else if (pad.direction < 0) {
                        this.direction[0] = -1
                    }
                }

            }

        }

        if (this.y + this.direction[1] < 0) {
            this.flipY();
        }

        this.x += this.direction[0];
        this.y += this.direction[1];
    }

    flipX() {
        this.direction[0] *= -1
    }

    flipY() {
        this.direction[1] *= -1
    }
}

export default Ball;