# 🎮 NotBrickGame

## 🕹️ Description
This is a personal project where I challenge myself to recreate some classic games, simulating the "original" **Brick Game**. It's built using **HTML**, **CSS**, **JavaScript**, and p5.js. The design and logic aim to replicate the look and feel of the old-school portable device. My version also won't have "9999 in 1"!

---

## 📸 Demo
[NOT Brick Game](https://adrianomoura.github.io/NotBrickGame/)

---

## ✨ Games
- 🎲 **NOT TETRIS**: My recreation of the classic Tetris.
- 🎲 **Race**: My recreation of the blocky Race Game.

---

## 🛠️ Technologies Used
- **HTML5**: Structure for the interface.
- **CSS3**: I challenged myself into recreate the Brick Game asthetic using only CSS, it's passable..
- **JavaScript (ES6)**: Game logic, event handling, and state management.
- **p5.js**: Dynamic rendering and element manipulation.

---

## 📋 Prerequisites
Ensure you have:
- 🖥️ A modern browser (Chrome, Firefox, Edge, etc.).
- 🌐 An HTTP server to host files locally (e.g., [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VSCode).

---

## 🚀 Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/retro-console-simulator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd NotBrickGame
   ```

3. Run using live-server or something similar
    ```
    live-server
    ```

## 📂 Project Structure
The first part (index.html and sketch.js) at the repository root, are the Hub Management, when we can select which game do you wanna play
Each game is separated in his own folder, with related components
The elements folder in the root have the commom components used by each game

```
NotBrickGame/
├── index.html              # Main HTML file for the hub
├── sketch.js               # p5.js Sketch for the hub
├── elements/               # Common components, used by multiples games
│   ├── GameHud.js          # Class responsible for the game scene, score, and related infos
│   ├── preload.js          # Font preloading
│   ├── conf.js             # Commom configuration
│   ├── helpers.js          # Helper functions
│   └── Block.js            # The visual base component for creation of the different elements in scene, literally the building block
├── nottetris/              # Tetris recreation
│   ├── sketch.js           # p5.js Sketch for the game logic
│   ├── index.html          # Base html, is the same from the parent folder
│   └── elements/
│       ├── Brick.js        # Tetris Brick representation class with rules
│       └── conf.js         # General configurations for this game
├── race/                   # Race Game
│   ├── sketch.js           # p5.js Sketch for the game logic
│   ├── index.html          # Base html, is the same from the parent folder
│   └── elements/
│       ├── Car.js          # Car class
│       └── conf.js         # General configurations for this game
├── assets/
│   ├── fonts/              # Custom fonts (pixel and LCD)
│   └── styles.css          # Styles for the Console Recreation
└── README.md               # Project documentation
```


