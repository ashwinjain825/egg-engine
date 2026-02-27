# 🥚 EGG_Engine: Expression to Gate Generator

> **"Let's Boil the EGG"** 🔥

![UI Preview](https://via.placeholder.com/1000x500/050505/00ffc2?text=EGG_Engine+Interface+Preview)

**EGG_Engine** is a sleek, cyberpunk-inspired frontend interface built to simulate an advanced Boolean logic evaluator. Designed with a conversational, ChatGPT-style UX, it takes raw logic expressions from the user and "boils" them down into modular, visually stunning analytical blocks—including Truth Tables, Karnaugh Maps, Min/Max Terms, and CSS-rendered Circuit Diagrams.



---

## ✨ Features

* **Conversational Interface**: A dynamic chat loop where user inputs slide in, followed by the engine processing and serving the formatted logic results.
* **Futuristic Aesthetic**: Uses a deep obsidian (`#050505`) palette, glassmorphism (frosted glass) effects, and glowing neon cyan (`#00ffc2`) accents.
* **Modular Analytical Blocks**: 
    * **Truth Tables**: Clean, mono-spaced tables mapping input combinations to outputs.
    * **Karnaugh Maps (K-Maps)**: Custom CSS grids simulating 2-variable K-Maps.
    * **Min/Max Terms**: Separate visual blocks for Sum of Products (SOP) and Product of Sums (POS).
    * **Schematic Engine**: A purely CSS/HTML-drawn logic circuit representation (no external SVGs or images required).
* **Quick-Insert Logic Tags**: Dedicated buttons `[AND]`, `[OR]`, `[NOT]`, `[XOR]` above the input bar for rapid expression building.
* **Simulated Error State**: Built-in logic to demonstrate syntax validation and error handling when a bad expression is fed to the engine.



## 🛠️ Tech Stack

* **HTML5**: Semantic structure and modular `<template>` tags for chat elements.
* **Tailwind CSS (via CDN)**: Rapid, utility-first styling for layout, typography, and responsive design.
* **Vanilla JavaScript**: Handles DOM manipulation, chat animations, auto-scrolling, and quick-insert logic.
* **Custom CSS**: Specific glowing effects, scrollbar styling, and structural circuit diagramming.

## 🚀 Quick Start (Zero Setup)

Because this project is built entirely as a single-file static frontend, there are no build steps, dependencies, or node modules required to get the EGG boiling.

1.  **Clone or Download** the repository.
2.  Open the `index.html` file directly in any modern web browser (Chrome, Firefox, Safari, Edge).
3.  Start typing logic!

## 🎮 How to Use (Demo Guide)

* **Standard Input**: Type a Boolean expression like `A AND B` or `(A OR B) AND C` into the bottom input bar and press **Enter** (or click **SEND**).
* **Shortcuts**: Click the quick-insert buttons (`[AND]`, `[OR]`, etc.) to instantly add them to your input.
* **Trigger an Error**: To see the custom error UI state, type the word `error` or `invalid` into your expression (e.g., `A AND error B`) and hit **Enter**.
* **New Session**: Click the `+ New Session` button in the sidebar to clear the chat history and start fresh.

---
*Powered by EGG_Engine Core v1.0* 🤖