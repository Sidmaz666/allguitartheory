# Guitar Theory Assistant

A lightweight, client‑side AI guitar‑theory assistant built with **Next.js 16**, **Tailwind CSS**, and **shadcn/ui**. The application runs entirely in the browser – no server‑side model, Docker, Nginx, or CI pipelines are required.

## Features
- **Instant AI chat** – leverages a WebAssembly model loaded directly in the browser.
- **Quick‑start prompts** – a handful of suggested questions to explore scales, chords, tunings, and more.
- **Offline aware** – the floating chat button (and header guitar icon) disappear when the user goes offline.
- **Clear chat** – a single click clears the conversation history.
- **Responsive UI** – chat bubbles are right‑aligned for the user and left‑aligned for the assistant, without any role labels.
- **No external services** – all assets are static and can be served from any CDN or static host.

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm

### Installation
```bash
# Clone the repo
git clone <repo‑url>
cd guitar-guide

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

### Production Build
```bash
npm run build
npm start
```
The output is a fully static bundle that can be served from any static web host.

## Project Structure
```
src/
├─ app/                 # Next.js app router pages
├─ components/          # UI components (chat, fretboard, etc.)
├─ hooks/               # React hooks and Zustand store
├─ lib/                 # Utility functions and AI engines (client‑side only)
└─ styles/              # Global Tailwind styles
```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/awesome`).
3. Commit your changes (`git commit -m "Add awesome feature"`).
4. Push and open a Pull Request.