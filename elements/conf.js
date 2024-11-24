// Game configuration constants
const backgroundColor = '#c5dcc1'; // Background color for the game canvas
const blockSize = 24; // Size of each block in the game (square blocks)
const padding = 15; // Padding around the game screen and HUD
const blockSpacing = 5; // Spacing between blocks in the grid
const gameScreenWidth = 10; // Number of blocks in the width of the game screen
const gameScreenHeight = 20; // Number of blocks in the height of the game screen
const gameScreenBorderWeight = 4; // Thickness of the game screen's border
const gameScreenPadding = 2; // Padding inside the game screen's border

// Total width of the canvas, including the game screen, padding, and additional HUD space
const width = 
    gameScreenWidth * (blockSize + blockSpacing) + // Width of the blocks and their spacing
    gameScreenPadding +                           // Padding inside the game screen
    gameScreenBorderWeight +                      // Border thickness
    padding * 2 +                                 // Outer padding on both sides
    100;                                          // Extra space for the HUD

// Total height of the canvas, including the game screen and padding
const height = 
    gameScreenHeight * (blockSize + blockSpacing) + // Height of the blocks and their spacing
    gameScreenPadding +                             // Padding inside the game screen
    gameScreenBorderWeight +                        // Border thickness
    padding * 2;                                    // Outer padding on top and bottom

// Export all configuration constants for use in other modules
export { 
    width,                // Total width of the canvas
    height,               // Total height of the canvas
    backgroundColor,      // Background color
    blockSize,            // Block size
    padding,              // Outer padding
    blockSpacing,         // Spacing between blocks
    gameScreenWidth,      // Grid width in blocks
    gameScreenHeight,     // Grid height in blocks
    gameScreenBorderWeight, // Border thickness
    gameScreenPadding     // Inner padding of the game screen
};
