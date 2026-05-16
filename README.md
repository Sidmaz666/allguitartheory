# Guitar Theory Assistant

A lightweight, client‑side AI guitar‑theory assistant built with **Next.js 16**, **Tailwind CSS**, and **shadcn/ui**. The application runs entirely in the browser – no server‑side model, Docker, Nginx, or CI pipelines are required.

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
