// ============================================================
// AUTHENTIC COMMODORE AMIGA DEMOSCENE - DESERT BYTE
// Classic 1980s/1990s Demo Effects in JavaScript
// ============================================================

class AmigaDemo {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 320;
        this.height = 256;
        this.time = 0;
        this.running = false;
        this.startTime = 0;
        
        // Scale canvas for modern displays
        this.scale = Math.min(
            Math.floor(window.innerWidth / this.width) - 1,
            Math.floor(window.innerHeight / this.height) - 1,
            4
        );
        this.canvas.style.width = (this.width * this.scale) + 'px';
        this.canvas.style.height = (this.height * this.scale) + 'px';
        
        // Audio setup
        this.audio = new Audio('desert-byte.mp3');
        this.audio.loop = false;
        
        // Initialize effects
        this.starfield = new Starfield(this);
        this.rasterBars = new RasterBars(this);
        this.scroller = new Scroller(this);
        this.logo = new BouncingLogo(this);
        this.plasma = new Plasma(this);
        this.cube = new RotatingCube(this);
        
        // Timeline - when different effects appear
        this.timeline = [
            { start: 0, end: 8, scene: 'intro', effects: ['starfield', 'scroller'] },
            { start: 8, end: 16, scene: 'rasters', effects: ['rasterBars', 'scroller'] },
            { start: 16, end: 28, scene: 'logo', effects: ['starfield', 'logo'] },
            { start: 28, end: 40, scene: 'plasma', effects: ['plasma', 'scroller'] },
            { start: 40, end: 52, scene: '3d-cube', effects: ['cube', 'starfield'] },
            { start: 52, end: 64, scene: 'rasterBars', effects: ['rasterBars', 'scroller'] },
            { start: 64, end: 76, scene: 'logo', effects: ['logo', 'scroller'] },
            { start: 76, end: 999, scene: '3d-cube', effects: ['starfield', `cube`, 'scroller'] },
        
        ];
        
        this.currentScene = this.timeline[0];
        
        // Setup controls
        document.getElementById('startBtn').addEventListener('click', () => this.start());
    }
    
    start() {
        if (!this.running) {
            this.running = true;
            this.startTime = Date.now();
            this.audio.currentTime = 0;
            this.audio.play().catch(e => console.log('Audio play failed:', e));
            this.loop();
        }
    }
    
    getCurrentScene() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        for (let scene of this.timeline) {
            if (elapsed >= scene.start && elapsed < scene.end) {
                return scene;
            }
        }
        return this.timeline[this.timeline.length - 1];
    }
    
    loop() {
        if (!this.running) return;
        
        this.time = (Date.now() - this.startTime) / 1000;
        this.currentScene = this.getCurrentScene();
        
        // Update UI
        document.getElementById('sceneInfo').textContent = this.currentScene.scene;
        document.getElementById('timeInfo').textContent = this.time.toFixed(1) + 's';
        
        // Clear screen
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Render active effects for current scene
        const effects = this.currentScene.effects;
        
        if (effects.includes('plasma')) {
            this.plasma.render();
        }
        
        if (effects.includes('starfield')) {
            this.starfield.render();
        }
        
        if (effects.includes('rasterBars')) {
            this.rasterBars.render();
        }
        
        if (effects.includes('logo')) {
            this.logo.render();
        }
        
        if (effects.includes('cube')) {
            this.cube.render();
        }
        
        if (effects.includes('scroller')) {
            this.scroller.render();
        }
        
        requestAnimationFrame(() => this.loop());
    }
}

// ============================================================
// STARFIELD EFFECT - Classic parallax star scrolling
// ============================================================
class Starfield {
    constructor(demo) {
        this.demo = demo;
        this.stars = [];
        
        // Create stars with different speeds (parallax)
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * demo.width,
                y: Math.random() * demo.height,
                z: Math.random() * 3,
                speed: 0.5 + Math.random() * 2
            });
        }
    }
    
    render() {
        const ctx = this.demo.ctx;
        
        this.stars.forEach(star => {
            // Move star
            star.x -= star.speed;
            if (star.x < 0) {
                star.x = this.demo.width;
                star.y = Math.random() * this.demo.height;
            }
            
            // Draw star with color based on depth
            const brightness = Math.floor(128 + star.z * 40);
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            const size = 1 + Math.floor(star.z);
            ctx.fillRect(Math.floor(star.x), Math.floor(star.y), size, size);
        });
    }
}

// ============================================================
// RASTER BARS (COPPER BARS) - Iconic Amiga effect
// ============================================================
class RasterBars {
    constructor(demo) {
        this.demo = demo;
        this.bars = [];
        
        // Create multiple copper bars
        for (let i = 0; i < 5; i++) {
            this.bars.push({
                y: 50 + i * 40,
                speed: 0.3 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2,
                colors: this.generateGradient(i)
            });
        }
    }
    
    generateGradient(seed) {
        const hue = (seed * 70) % 360;
        const colors = [];
        for (let i = 0; i < 16; i++) {
            const lightness = Math.abs(8 - i) * 6 + 20;
            colors.push(`hsl(${hue}, 100%, ${lightness}%)`);
        }
        return colors;
    }
    
    render() {
        const ctx = this.demo.ctx;
        const time = this.demo.time;
        
        this.bars.forEach((bar, idx) => {
            // Sinusoidal movement
            const y = bar.y + Math.sin(time * bar.speed + bar.phase) * 30;
            
            // Draw gradient bar
            bar.colors.forEach((color, i) => {
                ctx.fillStyle = color;
                const barY = Math.floor(y + i - 8);
                if (barY >= 0 && barY < this.demo.height) {
                    ctx.fillRect(0, barY, this.demo.width, 1);
                }
            });
        });
    }
}

// ============================================================
// SINUSOIDAL SCROLLER - Classic bottom text scroller
// ============================================================
class Scroller {
    constructor(demo) {
        this.demo = demo;
        this.text = "    WELCOME TO THE COMMODORE AMIGA DEMOSCENE...    " +
                    "DESERT BYTE PRESENTS...    " +
                    "AUTHENTIC 1980S STYLE DEMO EFFECTS...    " +
                    "FEATURING STARFIELDS, COPPER BARS, PLASMA, AND MORE...    " +
                    "CODED IN PURE JAVASCRIPT...    " +
                    "GREETINGS TO ALL SCENERS WORLDWIDE...    " +
                    "KEEP THE SCENE ALIVE!    "+
                    "SPECIAL THANKS TO THE ORIGINAL AMIGA DEMO CREATORS...    "+
                    "THIS DEMO IS A TRIBUTE TO YOUR LEGACY...    "+
                    "DEDICATED TO KEFRENS, NIGHTLIGHT, AND OTHER LEGENDS...    "+
                    "CODED BY MACKENZIE    "+
                    "MUSIC BY MACKENZIE    "+
                    "GRAPHICS BY MACKENZIE    "+
                    "ENRICHED WITH LOVE AND NOSTALGIA...    "+
                    "DESERT BYTE RULES!    "+
                    "SEE YOU IN THE NEXT DEMO!    ";
        this.x = demo.width;
        this.fontSize = 16;
        this.amplitude = 10;
    }
    
    render() {
        const ctx = this.demo.ctx;
        const time = this.demo.time;
        
        // Move scroller
        this.x -= 1.5;
        if (this.x < -this.text.length * 8) {
            this.x = this.demo.width;
        }
        
        // Draw text with sine wave
        ctx.font = `${this.fontSize}px monospace`;
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < this.text.length; i++) {
            const char = this.text[i];
            const charX = this.x + i * 8;
            
            if (charX > -20 && charX < this.demo.width + 20) {
                const wave = Math.sin((charX * 0.05) + time * 2) * this.amplitude;
                const y = this.demo.height - 30 + wave;
                
                // Classic Amiga palette - cyan/orange gradient
                const colorPhase = (charX * 0.02 + time) % 1;
                const hue = colorPhase < 0.5 ? 180 : 30;
                ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
                
                ctx.fillText(char, Math.floor(charX), Math.floor(y));
            }
        }
    }
}

// ============================================================
// BOUNCING LOGO - Classic demo group logo bounce
// ============================================================
class BouncingLogo {
    constructor(demo) {
        this.demo = demo;
        this.x = demo.width / 2;
        this.y = demo.height / 2;
        this.vx = 2;
        this.vy = 1.5;
        this.size = 60;
        this.rotation = 0;
    }
    
    render() {
        const ctx = this.demo.ctx;
        const time = this.demo.time;
        
        // Bounce physics
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x - this.size/2 < 0 || this.x + this.size/2 > this.demo.width) {
            this.vx = -this.vx;
        }
        if (this.y - this.size/2 < 0 || this.y + this.size/2 > this.demo.height - 40) {
            this.vy = -this.vy;
        }
        
        // Rotate
        this.rotation += 0.02;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw logo - classic checkered pattern
        const checks = 8;
        const checkSize = this.size / checks;
        
        for (let i = 0; i < checks; i++) {
            for (let j = 0; j < checks; j++) {
                if ((i + j) % 2 === 0) {
                    const hue = (time * 50 + i * 30 + j * 30) % 360;
                    ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
                    ctx.fillRect(
                        -this.size/2 + i * checkSize,
                        -this.size/2 + j * checkSize,
                        checkSize,
                        checkSize
                    );
                }
            }
        }
        
        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
        
        ctx.restore();
    }
}

// ============================================================
// PLASMA EFFECT - Classic old-school plasma
// ============================================================
class Plasma {
    constructor(demo) {
        this.demo = demo;
        this.palette = this.generatePalette();
    }
    
    generatePalette() {
        const palette = [];
        for (let i = 0; i < 256; i++) {
            const r = Math.floor(128 + 127 * Math.sin(i * 0.024));
            const g = Math.floor(128 + 127 * Math.sin(i * 0.024 + 2));
            const b = Math.floor(128 + 127 * Math.sin(i * 0.024 + 4));
            palette.push(`rgb(${r}, ${g}, ${b})`);
        }
        return palette;
    }
    
    render() {
        const ctx = this.demo.ctx;
        const time = this.demo.time;
        const scale = 4; // Chunky pixels
        
        for (let y = 0; y < this.demo.height; y += scale) {
            for (let x = 0; x < this.demo.width; x += scale) {
                // Classic plasma formula
                const value = Math.sin(x * 0.04 + time) +
                             Math.sin(y * 0.03 + time) +
                             Math.sin((x + y) * 0.03 + time) +
                             Math.sin(Math.sqrt(x * x + y * y) * 0.02 + time);
                
                const colorIndex = Math.floor((value + 4) * 32) % 256;
                ctx.fillStyle = this.palette[colorIndex];
                ctx.fillRect(x, y, scale, scale);
            }
        }
    }
}

// ============================================================
// ROTATING 3D CUBE - Classic vector 3D effect
// ============================================================
class RotatingCube {
    constructor(demo) {
        this.demo = demo;
        
        // Define cube vertices
        const s = 50;
        this.vertices = [
            [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s], // Back face
            [-s, -s, s],  [s, -s, s],  [s, s, s],  [-s, s, s]   // Front face
        ];
        
        // Define edges (connections between vertices)
        this.edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Back face
            [4, 5], [5, 6], [6, 7], [7, 4], // Front face
            [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
        ];
        
        // Define faces for filled rendering
        this.faces = [
            [0, 1, 2, 3], // Back
            [4, 5, 6, 7], // Front
            [0, 1, 5, 4], // Bottom
            [2, 3, 7, 6], // Top
            [0, 3, 7, 4], // Left
            [1, 2, 6, 5]  // Right
        ];
        
        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;
    }
    
    rotateX(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return (x, y, z) => [x, y * cos - z * sin, y * sin + z * cos];
    }
    
    rotateY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return (x, y, z) => [x * cos + z * sin, y, -x * sin + z * cos];
    }
    
    rotateZ(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return (x, y, z) => [x * cos - y * sin, x * sin + y * cos, z];
    }
    
    project(x, y, z) {
        // Simple perspective projection
        const distance = 200;
        const scale = distance / (distance + z);
        return [
            this.demo.width / 2 + x * scale,
            this.demo.height / 2 + y * scale
        ];
    }
    
    render() {
        const ctx = this.demo.ctx;
        const time = this.demo.time;
        
        // Update rotation angles
        this.rotX = time * 0.7;
        this.rotY = time * 0.5;
        this.rotZ = time * 0.3;
        
        // Transform all vertices
        const rotXFunc = this.rotateX(this.rotX);
        const rotYFunc = this.rotateY(this.rotY);
        const rotZFunc = this.rotateZ(this.rotZ);
        
        const transformed = this.vertices.map(([x, y, z]) => {
            [x, y, z] = rotXFunc(x, y, z);
            [x, y, z] = rotYFunc(x, y, z);
            [x, y, z] = rotZFunc(x, y, z);
            return { x, y, z, projected: this.project(x, y, z) };
        });
        
        // Calculate face depths for z-sorting
        const facesWithDepth = this.faces.map((face, idx) => {
            const avgZ = face.reduce((sum, i) => sum + transformed[i].z, 0) / face.length;
            return { face, depth: avgZ, idx };
        });
        
        // Sort faces by depth (painter's algorithm)
        facesWithDepth.sort((a, b) => a.depth - b.depth);
        
        // Draw filled faces with classic Amiga colors
        facesWithDepth.forEach(({ face, idx }) => {
            ctx.beginPath();
            face.forEach((vIdx, i) => {
                const [x, y] = transformed[vIdx].projected;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            
            // Color cycling based on face and time
            const hue = (idx * 60 + time * 30) % 360;
            const brightness = 40 + idx * 8;
            ctx.fillStyle = `hsl(${hue}, 80%, ${brightness}%)`;
            ctx.fill();
        });
        
        // Draw edges for that classic wireframe look
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        
        this.edges.forEach(([i, j]) => {
            const [x1, y1] = transformed[i].projected;
            const [x2, y2] = transformed[j].projected;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        });
        
        // Draw vertices as dots
        transformed.forEach(({ projected: [x, y] }) => {
            ctx.fillStyle = '#fff';
            ctx.fillRect(x - 1, y - 1, 2, 2);
        });
    }
}

// ============================================================
// Initialize demo when page loads
// ============================================================
let demo;
window.addEventListener('load', () => {
    demo = new AmigaDemo();
    console.log('🎮 Amiga Demoscene Ready! Click START DEMO to begin.');
});
