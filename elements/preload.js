/**
 * Preloads fonts and assigns them to global variables for use in the application.
 * This function is called in the `preload` phase of the p5.js lifecycle.
 *
 * @param {Object} p5 - The p5.js instance.
 */
export default function preload(p5) {
    // Load the pixel-style font and assign it to a global variable
    // Used for rendering pixelated or retro-style text in the HUD
    window.pixelFont = p5.loadFont("../assets/fonts/pixel.ttf");

    // Load the LCD-style font and assign it to a global variable
    // Used for rendering text that mimics a digital display
    window.lcdFont = p5.loadFont("../assets/fonts/lcd.ttf");
}
