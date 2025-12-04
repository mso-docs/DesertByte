# 🎮 Amiga Demoscene - Desert Byte

[PLAY THE DEMO](link)

An authentic 1980s/1990s Commodore Amiga demoscene tribute built with pure JavaScript. Experience classic demo effects with old-school computer graphics and desert-byte.mp3 soundtrack.

## ✨ Features

Classic Amiga demo effects:
- **Starfield** - Parallax scrolling stars with depth
- **Raster Bars** - Iconic copper bar effects with sinusoidal movement
- **Sinusoidal Scroller** - Wave-motion text scroller with color cycling
- **Bouncing Logo** - Rotating checkered pattern with physics
- **Plasma Effect** - Mathematical plasma with palette cycling
- **3D Rotating Cube** - Vector 3D cube with perspective projection

## 🚀 Quick Start

### Local Development
```bash
# Serve with Python
python -m http.server 8000

# Or use any static server
npx serve
```

Open `http://localhost:8000` and click **START DEMO**

### Live Demo
Visit the [GitHub Pages demo](https://[username].github.io/exo-demo/) (replace with your username)

## 🎨 Technical Details

- **Resolution**: 320×256 (authentic Amiga PAL resolution)
- **Rendering**: HTML5 Canvas with pixelated scaling
- **Effects**: Pure JavaScript, no external libraries
- **Audio**: desert-byte.mp3 soundtrack
- **Timeline**: Scene-based effect transitions

## 📁 Project Structure

```
.
├── index.html      # Main HTML with controls
├── demo.js         # All demo effects and engine
├── desert-byte.mp3 # Soundtrack
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages deployment
```

## 🎯 Scene Timeline

1. **Intro (0-8s)**: Starfield + Scroller
2. **Rasters (8-16s)**: Copper bars + Scroller
3. **Logo (16-28s)**: Bouncing logo + Starfield
4. **Plasma (28-40s)**: Plasma effect + Scroller
5. **3D Cube (40-52s)**: Rotating cube + Starfield
6. **Finale (52s+)**: All effects combined

## 💾 Amiga Nostalgia

This demo pays homage to the legendary Commodore Amiga demoscene of the late 1980s and early 1990s. The Amiga was revolutionary for its graphics and audio capabilities, inspiring a generation of digital artists and programmers to push the boundaries of what was possible.

Classic effects recreated:
- Copper bars (hardware-accelerated color changes)
- Chunky pixels and limited palettes
- Vector graphics and 3D rotation
- Plasma and mathematical effects
- Smooth scrollers and screen splits

## 🛠️ Customization

Edit `demo.js` to:
- Add new effects
- Modify the timeline
- Change colors and palettes
- Adjust animation speeds
- Create new scenes

## 📜 License

MIT - Feel free to remix and share!

---

*Greetings to all sceners worldwide! Keep the scene alive!* 🌟
