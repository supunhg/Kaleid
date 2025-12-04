# Kaleid - Modern Glitch Animation Platform

> ⚠️ **Work in Progress** - Active development phase

A Next.js 15 web application for creating, customizing, and exporting stunning glitch effects on images with real-time pixel manipulation.

## 🚀 Current Status

### ✅ Implemented (MVP Phase)
- Real-time canvas-based image glitching with pixel manipulation
- Image upload and sample image library
- 9+ glitch effects (RGB Split, Noise, Block Glitch, Pixelation, Scanlines, Color Shift, VHS Distortion, Displacement, Datamosh, Color Grading)
- Modern tabbed control panel with efficient spacing
- Preset system with instant effect loading
- Live preview with play/pause controls
- **Local preset saving (browser storage)**
- **Image and video export (PNG, WebM)**
- **WebGL/Three.js renderer with custom shaders**
- **Beta notification banner**
- Responsive design optimized for desktop and mobile

### 🚧 In Development
- Public gallery for sharing creations
- GIF export functionality (requires additional library)
- Batch processing for multiple images
- Community preset marketplace

### 📋 Planned (Phase 2+)
- Advanced shader composition system
- Custom shape library support
- API for programmatic access

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/supunhg/Kaleid.git
cd kaleid
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Features

- **Image-Based Glitching**: Upload your own images or use sample photos
- **Real-Time Canvas Manipulation**: See effects instantly as you adjust parameters
- **9+ Glitch Effects**: RGB channel splitting, noise, block displacement, pixelation, scanlines, color shifting, VHS distortion, displacement mapping, datamosh, and color grading
- **Effect Toggler**: Easy on/off switches for each effect module
- **WebGL/Three.js Integration**: Advanced GPU-accelerated shader effects
- **Preset Library**: Start with 9+ professionally designed glitch presets
- **Modern Tabbed UI**: Organized controls with Image, Effects, and Settings tabs
- **Interactive Controls**: Fine-tune animations with intuitive sliders
- **Export Functionality**: Download as PNG images or WebM videos
- **Local Preset Saving**: Save up to 50 presets in browser localStorage
- **Saved Presets Library**: Quick access to your saved presets
- **Public Gallery**: Share and discover community creations
- **Share Presets**: Generate shareable links with URL parameters
- **Keyboard Shortcuts**: Ctrl+E (export), Ctrl+S (save), H (share), 1/2/3 (tabs), Ctrl+Z (undo), Ctrl+Shift+Z (redo), P (performance stats)
- **History/Undo System**: 50-state history with undo/redo buttons and keyboard shortcuts
- **Performance Monitoring**: Real-time FPS, frame time, and memory usage tracking
- **Web Worker Processing**: Offload heavy canvas operations for improved performance
- **8 Sample Images**: Diverse library including city, portrait, space, abstract, neon, tech, gradient, and nature
- **Success Notifications**: Visual feedback for actions
- **Loading States**: Proper loading indicators throughout
- **Dark Theme**: Beautiful cyberpunk-inspired design with cyan/magenta gradients
- **TypeScript**: Fully typed for better developer experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Beta Banner**: Dismissible notification about development status

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.7 (App Router with Turbopack)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS v4 (using `@import` and `@theme` syntax)
- **State Management**: Zustand 5.0.9
- **Canvas API**: Real-time pixel manipulation with `ImageData`
- **WebGL**: Three.js 0.181.2 with custom GLSL shaders
- **Animation**: Framer Motion 12.23.25, GSAP 3.13.0
- **Storage**: Browser localStorage (no database, privacy-first)
- **Video Export**: MediaRecorder API (WebM)
- **URL Sharing**: Base64 encoding for preset sharing
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
kaleid/
├── app/                  # Next.js app directory
│   ├── editor/          # Editor page with tabbed interface
│   ├── gallery/         # Gallery page with public creations
│   ├── supporters/      # Supporters page
│   ├── globals.css      # Global styles (Tailwind v4)
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage with live previews
├── components/          # React components
│   ├── AuthModal.tsx    # User authentication modal
│   ├── BetaBanner.tsx   # Dismissible beta notification
│   ├── ControlPanel.tsx # Tabbed control panel with history controls
│   ├── EffectToggler.tsx # Effect module on/off switches
│   ├── Footer.tsx       # Footer with creator credit
│   ├── GlitchCanvas.tsx # Real-time pixel manipulation with performance tracking
│   ├── HistoryControls.tsx # Undo/redo buttons with keyboard shortcuts
│   ├── ImageUploader.tsx # Image upload & sample selector (8 samples)
│   ├── LiveGlitchPreview.tsx # Animated homepage previews
│   ├── LoadingStates.tsx # Loading spinners and notifications
│   ├── Navigation.tsx   # Navigation with auth integration
│   ├── PerformanceStats.tsx # FPS/frame time/memory usage display
│   ├── PresetSelector.tsx
│   ├── PreviewCanvas.tsx
│   ├── SaveModal.tsx    # Save to gallery modal
│   ├── ShareModal.tsx   # Share preset via URL
│   └── WebGLRenderer.tsx # Three.js WebGL renderer
├── hooks/               # Custom React hooks
│   ├── useKeyboardShortcuts.tsx # Keyboard shortcut system
│   └── useWebWorker.ts  # Web Worker hook for offloading canvas operations
├── lib/                 # Utilities and configuration
│   ├── auth.ts          # Supabase auth functions
│   ├── export.ts        # Image/video export service
│   ├── gallery.ts       # Gallery CRUD operations
│   ├── history.ts       # History store with undo/redo logic
│   ├── performance.ts   # Performance monitoring and optimization utilities
│   ├── presets.ts       # Glitch effect presets
│   ├── store.ts         # Zustand state management (integrates with history)
│   └── supabase.ts      # Supabase client
├── shaders/             # GLSL shader files
│   └── glitchShader.ts  # WebGL glitch shaders
├── workers/             # Web Workers
│   └── glitch.worker.ts # Web Worker for heavy canvas processing
├── types/               # TypeScript type definitions
│   └── glitch.ts        # GlitchConfig, params, presets
└── public/              # Static assets
```

## 📷 Screenshots

<img width="1585" height="1016" alt="image" src="https://github.com/user-attachments/assets/ea0047b0-3dec-47eb-a677-a8b53db3d5b0" />
<img width="1239" height="749" alt="image" src="https://github.com/user-attachments/assets/6b5f8219-0b9e-497d-ba9a-1ac100f826c9" />
<img width="1581" height="1006" alt="image" src="https://github.com/user-attachments/assets/6af17790-374f-4f01-bab0-15792cefe44e" />

## 🎯 Roadmap

### Phase 1 (MVP) ✅ Complete
- [x] Next.js setup with TypeScript and Tailwind v4
- [x] Basic UI components and navigation
- [x] Canvas-based image glitch system
- [x] Real-time pixel manipulation engine
- [x] Image upload and samples
- [x] Preset library (9+ effects)
- [x] Tabbed control interface
- [x] Supporters page
- [x] Live homepage previews
- [x] Local preset saving (localStorage)
- [x] Export functionality (PNG/WebM)
- [x] WebGL/Three.js integration
- [x] Beta notification banner
- [x] Footer with creator credit
- [x] History/undo system with 50-state limit
- [x] Performance monitoring with FPS tracking
- [x] Web Worker for heavy canvas operations

### Phase 2 (Advanced Effects)
- [x] WebGL/Three.js integration
- [x] Advanced shader effects (VHS, displacement, datamosh, color grading)
- [ ] Custom shader composition
- [ ] Video input support
- [ ] Batch processing
- [ ] GIF export (requires gif.js integration)

### Phase 3 (Community & Polish)
- [ ] User preset sharing platform
- [x] Public gallery foundation
- [ ] Gallery filters and search
- [ ] Social sharing features
- [ ] Advanced export options
- [ ] Community preset marketplace

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Supun Hewagamage](https://github.com/supunhg) using Next.js and Vercel
