import { width, height, backgroundColor, gameScreenWidth, gameScreenHeight } from '../elements/conf.js';
import GameHud from '../elements/GameHud.js';
import { preventKeyboard } from '../elements/helpers.js';
import preload from '../elements/preload.js';

function sketch(p) {
    let gameHud; // Game HUD instance
    let selectedGame = 0; // Index of the currently selected game

    const gamesPerPage = 10; // Total of games to show per page

    // List of games with their names and paths
    const gameList = [
        ['NOT TETRIS', '/nottetris'],
        ['RACE', '/race'],
        ['SNAKE', '/snake'],
        ['BREAK OUT', ''],
        ['OFFROAD', '/offroad'],
    ];

    let page = 0;
    const totalPages = Math.ceil(gameList.length / gamesPerPage);

    // Preload assets like fonts
    p.preload = () => preload(p);

    // Setup the canvas and initialize HUD
    p.setup = () => {
        const canvas = p.createCanvas(width, height); // Create the canvas
        canvas.parent('canvas'); // Attach the canvas to a DOM element
        gameHud = new GameHud(p); // Initialize the GameHud
    };

    // Main game loop for rendering
    p.draw = () => {
        p.background(backgroundColor); // Set background color

        gameHud.draw(); // Draw the HUD
        gameHud.drawScore(); // Draw the score HUD

        // Draw semi-transparent overlay for the menu
        const color = p.color(backgroundColor);
        color.setAlpha(150); // Set transparency
        p.fill(color);
        p.rect(0, 0, width, height);

        // Draw the "SELECT GAME" title
        p.fill(0);
        drawPixelFont(50, 120, 'SELECT GAME'); // Title for game selection
        p.rect(30, 120, 250, 4); // Underline for the title

        // Render the list of games

        if (page < totalPages - 1) {
            drawPixelFont(290, 350, '>'); // Draw game name
        }

        if (page > 0) {
            drawPixelFont(20, 350, '<'); // Draw game name
        }

        page = Math.floor(selectedGame / gamesPerPage);

        for (let i = page * gamesPerPage; i < (page + 1) * gamesPerPage; i++) {

            const game = gameList[i]
            if (!game) {
                break;
            }

            const x = 40; // X position of the menu item
            const y = 150 + i * 40 - (page * gamesPerPage) * 40; // Y position based on index

            const black = p.color(0);

            if (game[1] === '') {
                black.setAlpha(100);
            }

            p.fill(black); // Default color

            // Highlight the selected game
            if (i === selectedGame) {
                p.rect(x, y, 230, 40); // Draw highlight rectangle
                p.fill(backgroundColor); // Invert text color for the selected game
            }

            drawPixelFont(x + 10, y + 50, game[0]); // Draw game name
        }
    };

    // Handle key presses for navigation and selection
    p.keyPressed = () => {
        if (p.keyCode === p.UP_ARROW || p.keyCode === p.DOWN_ARROW) {
            let newSelection;

            const move = p.keyCode === p.UP_ARROW ? -1 : p.keyCode === p.DOWN_ARROW ? 1 : 0

            newSelection = selectedGame + move;

            const totalGames = gameList.length;
            // Wrap around the selection index (support cyclic navigation)
            selectedGame = (newSelection % totalGames + totalGames) % totalGames;
        }

        if (p.keyCode === p.RIGHT_ARROW || p.keyCode === p.LEFT_ARROW) {
            let nextPage;

            if (p.keyCode === p.LEFT_ARROW) {
                nextPage = page - 1; // Move selection up
            }
            if (p.keyCode === p.RIGHT_ARROW) {
                nextPage = page + 1; // Move selection down
            }

            // Wrap around the selection index (support cyclic navigation)
            page = (nextPage % totalPages + totalPages) % totalPages;
            selectedGame = page * gamesPerPage;
        }

        if (p.keyCode === p.ENTER && gameList[selectedGame][1]) {
            location.href = `..${gameList[selectedGame][1]}`; // Navigate to the selected game's path
        }
    };

    // Draw text using a pixel font
    function drawPixelFont(x, y, text, size = 28) {
        p.textSize(size); // Set font size
        p.textLeading(size); // Set line height
        p.textFont(pixelFont); // Use the pixel font
        p.textAlign(p.LEFT); // Align text to the left
        p.text(text, x, y); // Draw the text at the given position
    }
}

new p5(sketch); // Initialize the sketch

preventKeyboard(); // Prevent default browser actions for certain key presses
