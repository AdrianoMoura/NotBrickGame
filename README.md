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
- 🎲 **Breakout**: A Breakout/Arkanoid type of game

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

## 🕹️ How to Play
Select a game using the arrows and confirm using Enter
All games can be paused using Space
When you loses you can press Enter to restart the game

#### Not Tetris
⬅️ / ➡️: Move blocks horizontally.
⬇️: Accelerate block falling.
⏺️ Space: Rotate blocks.

#### Race
⬅️ / ➡️: Move the Car horizontally.
⏺️ Space: Accelerate the Car.

#### Snake
⬅️ / ➡️ / ⬆️ / ⬇️: Move the Snake Around.

#### Break Out (in development)
⬅️ / ➡️: Move the pad horizontally.

#### OffRoad
⬅️ / ➡️: Move the Car horizontally.
⏺️ Space: Accelerate the Car.


## 📂 Project Structure
The first part (index.html and sketch.js) at the repository root, are the Hub Management, when we can select which game do you wanna play
Each game is separated in his own folder, with related components
The elements folder in the root have the commom components used by each game