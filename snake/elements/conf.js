// Game configuration constants

const gameName = 'snake';       // The name of the game, used for local storage keys
const initialSpeed = 1;            // The initial speed of the game (bricks falling per second)
const acceleratedSpeed = 20;      // The speed when the game is accelerated (e.g., when action button is pressed)
const levelThreshold = 100;         // The score required to advance to the next level
const speedThreshold = 5;          // The number of levels required to increase the game's speed

// Export the constants so they can be imported in other modules
export {
    gameName,
    initialSpeed,
    acceleratedSpeed,
    speedThreshold,
    levelThreshold,
};
