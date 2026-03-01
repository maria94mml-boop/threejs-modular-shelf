# 3D Modular Shelf Configurator

This project is a **3D modular shelf configurator** built with **Three.js**, developed as part of a technical exercise.

The configurator allows dynamically adjusting the shelf height by adding or removing modules, visualizing dimensions in real time, and exporting the configuration as structured JSON.

## Features
- Modular shelf system
  * Shelf built by stacking identical modules
  * Height adapts automatically based on the number of modules
- Parametric dimensions
 * Width, depth, module height, and total height calculated dynamically
- Real-time camera framing
	* Camera automatically adjusts to the current shelf size
- Helpers
	* Toggle grid and axes helpers for spatial reference
- Presentation mode
	* Hide all UI elements for a clean product view
- JSON configuration export
	* Configuration is logged to the browser console
	* Floating widget to:
		* Preview formatted JSON
		* Copy to clipboard
		* Download as .json file
- Icon-based UI
	* Dedicated icons for helpers toggle, hide UI, and JSON export

## Project Structure


```text
/
├── index.html
├── main.js
├── README.md
├── js/
│   ├── ProductLogic.js
│   ├── MaterialManager.js
│   └── UIManager.js
├── models/
│   └── shelf_module.glb
├── textures/
│   └── structure/
│       └── wood049/
│           ├── color.jpg
│           ├── normal.jpg
│           └── rough.jpg
├── icons/
│   ├── helpers.png
│   ├── hide.png
│   └── json.png

```

## Architecture Overview

### Main.js
- Scene, camera, renderer, and lights setup
- Shelf loading (loadShelf)
- Camera framing logic (frameShelf)
- UI visibility and helpers toggling
- JSON export logic and widget setup

### ProductLogic.js
- Core shelf logic
- Handles:
	* Number of levels
	* Shelf construction
	* Height calculation
	* Dimension reporting

### UIManager.js
- Manages UI controls:
  - Add / remove shelf levels
  - Height input (multiples of module height)
  - Dimension display
- Keeps UI in sync with product state

### MaterialManager.js
- Centralized texture and material loading
- Applies materials to all shelf modules

## JSON Export
The shelf configuration is generated from a single source of truth and includes metadata and dimensions.

Example output:

	{
		"productId": "modular-shelf-001",
 		"version": "1.0",
		"exportedAt": "2026-01-25T19:10:42.812Z",
		"units": "cm",
 		"dimensions": {
 			"width": 80,
 			"depth": 30,
			"moduleHeight": 30,
			"totalHeight": 180,
			"levels": 6
		}
	}

  The configuration is:
- Logged automatically to the browser console on every change
- Available via a floating widget with copy and download actions

## Controls
### Shelf
- '+ / −': Add or remove shelf modules

- Height input: Set total height (multiples of module height)

### UI Buttons

- 👁 Hide UI (presentation mode)

- 📐 Toggle grid & axes helpers

- 🧾 Export configuration as JSON

## Technologies
- Three.js
- ES Modules
- GLBLoader
- OrbitControls
- Vanilla JavaScript (no frameworks)

## Getting Started

Simply open index.html using a local server (e.g. VS Code Live Server).
No build step required.

## 🚀 Demo en vivo
👉 [Ver proyecto](https://maria94mml-boop.github.io/threejs-modular-shelf/)
