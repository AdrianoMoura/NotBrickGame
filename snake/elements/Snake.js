import Block from "../../elements/Block.js";
import { gameScreenHeight, gameScreenWidth } from "../../elements/conf.js";


// The Snake class
class Snake {
    p5; // p5.js instance for rendering
    y; // Current X position of the head
    x; // Current Y position of the head
    direction = [1, 0]; // Vector for the direction of the snake
    tail = []; // Array of tail each pos have a object {block: Block, lastPos: [x,y]}

    /**
     * Constructs a Car instance
     * @param {Object} p5 - p5.js instance
     * @param {number} x - Initial X position
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
        const tail = [...this.tail];

        if (this.x >= 0 && this.x < gameScreenWidth && this.y >= 0 && this.y < gameScreenHeight) {
            const block = new Block(this.p5, this.x, this.y);
            block.draw();
        }

        for (let i = 0; i < tail.length; i++) {

            const block = new Block(this.p5, tail[i].block.x, tail[i].block.y);
            block.draw();
        }
    }

    // Receive the keyboard input and move the car side to side
    changeDirection(dirX, dirY) {
        const firstTail = this.tail[0];

        if (firstTail) {
            if (this.x + dirX === firstTail.block.x && this.y + dirY === firstTail.block.y) {
                return // wont allow the player to turn into the tail direction
            }
        }

        this.direction = [dirX, dirY];
    }

    move() {
        const lastX = this.x;
        const lastY = this.y;

        this.x += this.direction[0];
        this.y += this.direction[1];

        this.moveTail(0, lastX, lastY);
    }

    grow() {

        const lastTail = this.tail[this.tail.length - 1] ?? {
            block: this,
            lastPos: [this.x - this.direction[0], this.y - this.direction[1]]
        }

        this.tail.push(
            {
                block: new Block(this.p5, lastTail.lastPos[0], lastTail.lastPos[1]),
                lastPos: [lastTail.block.x, lastTail.block.y]
            }
        )
    }

    moveTail(i, x, y) {
        if (!!this.tail[i]) {
            const lastX = this.tail[i].block.x;
            const lastY = this.tail[i].block.y;

            this.tail[i].block.x = x;
            this.tail[i].block.y = y;
            this.tail[i].lastPos = [lastX, lastY];

            this.moveTail(i + 1, lastX, lastY);
        }
    }

    hitOwnTail() {
        for (let tail of this.tail) {
            if (tail.block.x === this.x && tail.block.y === this.y) {
                return true;
            }
        }
        return false;
    }
}

export default Snake;