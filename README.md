# 🎮 Ultimate Tic-Tac-Toe Collection

<div align="center">

![Tic-Tac-Toe](https://img.shields.io/badge/Game-Tic--Tac--Toe-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)

**The most comprehensive collection of Tic-Tac-Toe variants ever created!**

[🚀 Play Now](#-getting-started) • [🎯 Game Variants](#-game-variants) • [⚡ Features](#-features) • [🛠️ Development](#-development)

</div>

---

## 🌟 About

Welcome to the **Ultimate Tic-Tac-Toe Collection** – a revolutionary take on the classic game that transforms simple X's and O's into an epic gaming experience! This project features **20 unique variants** of Tic-Tac-Toe, each offering different challenges, strategies, and excitement levels.

From the nostalgic **Classic 3x3** to mind-bending **3D Tic-Tac-Toe**, memory-challenging **Blind Mode**, and strategic **Ultimate Tic-Tac-Toe** – there's something here for every type of player!

## ✨ Features

- 🎲 **20 Unique Game Variants** - From beginner-friendly to expert-level challenges
- 🌓 **Dark/Light Mode Toggle** - Beautiful themes for any preference
- 📱 **Fully Responsive Design** - Play seamlessly on desktop, tablet, or mobile
- 🎨 **Animated Background** - Dynamic visual effects that respond to your gameplay
- 🏆 **Difficulty Filtering** - Find games that match your skill level
- ⚡ **Real-time Gameplay** - Smooth, interactive gaming experience
- 🎯 **Strategic Depth** - Each variant offers unique tactical challenges
- 🔄 **Game State Management** - Robust tracking of moves, wins, and game logic

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tic-tac-toe.git
   cd tic-tac-toe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) and start playing! 🎉

## 🎯 Game Variants

<details>
<summary><b>🟢 Easy Level (4 variants)</b></summary>

| Game | Description | Players |
|------|-------------|---------|
| **Classic 3x3** | Traditional tic-tac-toe with 3x3 grid | 2 Players |
| **Misère Tic-Tac-Toe** | Reverse rules! Avoid making 3 in a row | 2 Players |
| **One-Dimensional** | Pure linear strategy on a single row | 2 Players |
| **Dice Tic-Tac-Toe** | Roll dice to determine move coordinates | 2 Players |

</details>

<details>
<summary><b>🟡 Medium Level (6 variants)</b></summary>

| Game | Description | Players |
|------|-------------|---------|
| **NxN Boards** | Scalable boards from 4x4 to 10x10 | 2 Players |
| **Randomized Start** | First few moves are randomly placed | 2 Players |
| **Obstacle Course** | Navigate around blocked cells and traps | 2 Players |
| **Time-Controlled** | Chess clock rules with time pressure | 2 Players |
| **Circular Board** | Clock-like circular board gameplay | 2 Players |
| **Erase & Replace** | Capture opponent's pieces after turn 3 | 2 Players |

</details>

<details>
<summary><b>🟠 Hard Level (4 variants)</b></summary>

| Game | Description | Players |
|------|-------------|---------|
| **Wild Tic-Tac-Toe** | Place either X or O on your turn | 2 Players |
| **Tic-Tac-Two** | Two parallel boards, win both to victory | 2 Players |
| **Three-Player** | 3 players on 5x5 grid with X, O, and Δ | 3 Players |
| **Numerical** | Use numbers 1-9 to sum lines to 15 | 2 Players |

</details>

<details>
<summary><b>🔴 Expert Level (6 variants)</b></summary>

| Game | Description | Players |
|------|-------------|---------|
| **3D Tic-Tac-Toe** | Multi-layer 3D boards with z-dimension | 2 Players |
| **Infinite Grid** | Unlimited grid space, get 5 in a row | 2 Players |
| **Ultimate Tic-Tac-Toe** | 9 mini boards in complex meta-game | 2 Players |
| **Power-Up Mode** | Collect special abilities and bonuses | 2 Players |
| **Move Rotation** | Limited memory, old moves disappear | 2 Players |
| **Blind Mode** | Memory challenge without seeing board | 2 Players |

</details>

## 🛠️ Technology Stack

This project leverages cutting-edge web technologies:

- **⚛️ React 19** - Latest React with concurrent features
- **📦 Next.js 15.3.4** - Full-stack React framework with Turbopack
- **🔷 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first CSS framework
- **🎯 Lucide React** - Beautiful, customizable icons
- **⚡ Turbopack** - Ultra-fast bundler for development

## 🎮 How to Play

1. **Choose Your Adventure**: Select from 20 unique game variants
2. **Filter by Difficulty**: Use the difficulty filter to find your perfect challenge
3. **Read the Rules**: Each game has clear descriptions and rules
4. **Start Playing**: Click on any game card to begin
5. **Master the Strategy**: Each variant requires different tactics
6. **Switch Themes**: Toggle between dark and light modes
7. **Challenge Friends**: Most games support 2-3 players

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── TicTacToeApp.tsx   # Main app component
│   ├── GameMenu.tsx       # Game selection interface
│   ├── AnimatedBackground.tsx # Dynamic background effects
│   └── games/             # Individual game implementations
│       ├── ClassicGame.tsx
│       ├── UltimateGame.tsx
│       ├── ThreeDGame.tsx
│       └── ... (17 more variants)
```

## 🧠 Game Logic Highlights

Each game variant implements unique mechanics:

- **State Management**: Robust game state tracking
- **Win Detection**: Custom algorithms for each variant
- **Move Validation**: Prevents invalid moves
- **Turn Management**: Handles 2-3 player rotations
- **Special Rules**: Unique mechanics per variant
- **Visual Feedback**: Clear indication of game status

## 🎨 Design Features

- **🌈 Dynamic Themes**: Seamless dark/light mode switching
- **📱 Responsive Layout**: Optimized for all screen sizes
- **🎭 Animated Effects**: Smooth transitions and hover states
- **🎯 Intuitive UI**: Clean, accessible game interfaces
- **🖼️ Visual Hierarchy**: Clear information architecture

## 🚀 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint code analysis |

### Development Features

- **🔥 Hot Reload**: Instant updates during development
- **⚡ Turbopack**: Lightning-fast bundling
- **🔍 TypeScript**: Full type checking
- **📏 ESLint**: Code quality enforcement
- **🎨 Tailwind**: Rapid UI development

### Ideas for New Variants

- **Gravity Tic-Tac-Toe**: Pieces fall down like Connect Four
- **Quantum Tic-Tac-Toe**: Pieces exist in superposition
- **Network Tic-Tac-Toe**: Multiplayer across different devices
- **AI Opponent**: Machine learning-powered computer player

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by passionate developers**

[⭐ Star this repository](https://github.com/yourusername/tic-tac-toe) if you enjoyed playing!

</div>
