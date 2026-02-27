# 🥚 EGG Engine: Expression to Gate Generator

> **"Let's Boil the EGG"** 

**EGG_Engine** is an interactive Boolean logic evaluator and circuit synthesizer. Operating via a REPL-style interface, it parses raw Boolean algebraic expressions and compiles them into comprehensive analytical models. The engine dynamically calculates state permutations to generate Truth Tables, Karnaugh Maps, canonical expressions, and structural circuit schematics.

---

## Core Features

* **Expression Parsing & Evaluation**: Processes standard Boolean logic strings utilizing fundamental operators (`AND`, `OR`, `NOT`, `XOR`).
* **Algorithmic Truth Table Generation**: Computes all possible permutations of input variables ($2^n$ states) to determine the corresponding boolean output matrix.
* **Karnaugh Map (K-Map) Synthesis**: Maps the evaluated truth table logic onto a 2-variable coordinate grid, aiding in the visualization of boolean simplification. 

* **Canonical Form Derivation**: Automatically extracts Minterms (Sum of Products / SOP) and Maxterms (Product of Sums / POS) directly from the active logic states.
* **Structural Schematic Rendering**: Translates the expression's logical hierarchy into a DOM-based schematic using CSS-drawn logic gates, bypassing external rendering libraries or SVGs.

* **Real-time Syntax Validation**: Built-in error trapping to detect and alert users of invalid expressions, missing operands, or malformed Boolean syntax.

## Technical Architecture

* **Markup & Node Injection**: HTML5 combined with modular `<template>` elements to handle dynamic DOM construction without framework overhead.
* **Styling & Grid Mathematics**: Utility-first CSS (Tailwind) utilized for exact matrix alignments (K-Maps) and responsive data tables, supplemented by raw CSS algorithms for geometric circuit node drawing.
* **Logic & State Management**: Vanilla JavaScript powers the core engine—handling event listening, expression string parsing, bitwise evaluations, and the conditional rendering of output modules.

## Initialization (Zero Setup)

As a purely client-side static engine, EGG_Engine requires no build steps, package managers, or backend dependencies.

1.  **Clone or Download** the repository to your local machine.
2.  Execute the application by opening `index.html` directly in any modern web browser.
3.  Initialize the logic sequence.

## Execution Guide

* **Standard Evaluation**: Input a Boolean expression (e.g., `A AND B` or `(A OR B) AND C`) into the command bar and execute via the **Enter** key or the **SEND** trigger.
* **Operator Shortcuts**: Utilize the quick-insert parameter tags (`[AND]`, `[OR]`, `[NOT]`, `[XOR]`) to rapidly construct complex expressions.
* **Exception Handling Demo**: To observe the syntax validation and error-trapping state, input an intentionally malformed string containing the keywords `error` or `invalid` (e.g., `A AND error B`) and execute.
* **Session Reset**: Click the `+ New Session` command to flush the DOM history and re-initialize the engine state.

---
Created By Ashwin Jain