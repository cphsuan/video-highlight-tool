# Video Highlight Tool

A modern web application for creating video highlights with AI-generated transcripts. Upload a video, get an automatic transcript with sections and timestamps, select sentences to highlight, and preview your highlight reel in real-time.

## ✨ Features

### Core Functionality

- **Video Upload**: Drag-and-drop interface with file validation
- **AI Transcript Generation**: Automatically generated transcript with sections and timestamps (mock API)
- **Split-Screen Interface**:
  - Left panel: Video player with controls and timeline
  - Right panel: Interactive transcript editor
- **Highlight Selection**: Check/uncheck sentences to create your highlight reel
- **Two-Way Synchronization**:
  - Video playback automatically highlights the current sentence
  - Click timestamps to jump to specific moments
  - Debounced auto-scrolling follows video playback
- **Visual Timeline**: See highlighted segments on the timeline bar
- **Text Overlay**: Selected highlight text appears as subtitles

### User Experience

- **Responsive Design**: Desktop (60/40 split), tablet/mobile (stacked)
- **Loading States**: Animated progress with spinner during upload
- **Error Boundaries**: Graceful error handling prevents full app crashes
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

---

## 🛠️ Tech Stack

| Technology  | Version | Purpose               |
| ----------- | ------- | --------------------- |
| React       | 19.1.1  | UI Framework          |
| TypeScript  | 5.9.3   | Type Safety           |
| Vite        | 7.1.7   | Build Tool            |
| TailwindCSS | v4.1.16 | Styling               |
| Zustand     | 5.0.8   | State Management      |
| Vitest      | 4.0.5   | Testing Framework     |
| Radix UI    | Various | Accessible Components |
| MSW         | 2.11.6  | API Mocking           |

---

## 📚 Why These Technologies?

### React 19.1.1

**Why React 19 specifically:**

- Concurrent features (automatic batching, transitions)
- Improved performance with React Compiler (future-ready)
- Better server components support (migration path if needed)
- Stable release with v18 bug fixes

---

### Vite 7.1.7

**Key benefits:**

- Lightning-fast dev server with instant HMR
- Optimized production builds with Rollup
- Native ESM support (no bundling in dev)
- Simple, intuitive configuration

---

### TypeScript 5.9.3

**Strict mode enabled:**

- Prevents null/undefined errors
- Better type inference
- Forces explicit type annotations
- Safer refactoring

---

### TailwindCSS v4.1.16

**Why Tailwind v4:**

- Faster builds with Rust-based engine
- CSS-first configuration
- Better tree-shaking for production

---

### Zustand 5.0.8

**Perfect for this project:**

- Small app state (transcript, video playback, UI state)
- No need for Redux DevTools complexity
- Fast prototyping
- TypeScript-first design

---

### Radix UI + shadcn/ui

**Benefits:**

- Accessibility built-in (ARIA, keyboard nav)
- Unstyled primitives (perfect with Tailwind)
- Composable and production-ready
- shadcn/ui provides styled examples

---

### Vitest 4.0.5 + Testing Library

**Testing Library over Enzyme:**

- Tests behavior not implementation
- User-centric queries
- Encourages accessibility
- Less brittle tests

**Test Coverage:** 111 tests across 10 files

---

### MSW (Mock Service Worker)

**Chosen over alternatives:**

- ✅ **vs axios-mock-adapter**: Works with any HTTP client
- ✅ **vs manual mocking**: Same code in tests and development
- ✅ **vs json-server**: Runs in browser, no extra server

**Benefits:**

- Intercepts network requests realistically
- Same mocks in dev and test
- Service Worker API (standard)

---

## 🏗️ Architectural Decisions

### Native HTML5 Video Element

**Why not react-player:**

- ✅ More control over playback behavior
- ✅ No external dependency (~2MB saved)
- ✅ Better performance for local videos
- ✅ Direct access to video events
- ✅ Custom highlight-only playback logic needed

### Event-Driven Architecture

**Why `seeked` event over `setTimeout`:**

- ✅ More reliable across devices/video sizes
- ✅ No race conditions with slow-loading videos
- ✅ Browser tells us when seek actually completes
- ✅ Better UX on slow networks

**Pattern:**

```typescript
video.currentTime = newTime;
const handleSeeked = () => {
  setIsProgrammaticSeek(false);
  video.removeEventListener("seeked", handleSeeked);
};
video.addEventListener("seeked", handleSeeked);
```

### Single Store Pattern (Zustand)

**Why centralized state:**

- ✅ Single source of truth
- ✅ Easier debugging
- ✅ Predictable state updates
- ✅ Better dev tools support

### Kebab-Case File Naming

**Why kebab-case over PascalCase:**

- ✅ Web standards (URLs use kebab-case)
- ✅ Faster typing (no shift key)
- ✅ Case-insensitive filesystem safe (Windows/macOS)
- ✅ Modern convention

Examples:

- ✅ `video-player.tsx`, `use-video-player.ts`
- ❌ `VideoPlayer.tsx`, `useVideoPlayer.ts`

### Centralized Constants

**Why extract magic numbers:**

- ✅ Single source of truth for timing/thresholds
- ✅ Easier to tune performance
- ✅ Self-documenting code
- ✅ Prevents typos

Location: `src/constants/index.ts`

### Performance Optimizations

**Debounced Auto-Scroll (100ms):**

- Prevents excessive DOM operations during playback
- Smoother UX on slower devices
- Tuned for perceived instant response

**Early Bailout in toggleHighlight:**

- Before: O(n) for all sentences
- After: O(1) average, O(n) only for target section
- Scales better with large transcripts (100+ sentences)

**Memory Leak Prevention:**

- Blob URL cleanup with `URL.revokeObjectURL()`
- Timeout cleanup in hooks
- Proper event listener removal

---

## ⚠️ When NOT to Use These Choices

### Don't use React if:

- You need tiny bundle size → Use Preact/Svelte
- Building static site → Use Astro/11ty

### Don't use Vite if:

- Complex Webpack loaders required
- Legacy project (high migration cost)

### Don't use Zustand if:

- Need Redux DevTools extensively
- Complex middleware ecosystem required
- Team already expert in Redux

### Don't use Tailwind if:

- Strict design system in external CSS
- Team prefers CSS-in-JS strongly
- Utility classes feel unreadable

---

## 🔄 Migration Paths

**Zustand → Redux:**

- Similar patterns, easy migration
- Keep component structure

**Vite → Next.js:**

- If SSR/SSG needed later
- Similar configuration

**React 19 → React 18:**

- Fully backwards compatible
- Just change version

---

## 📊 Complete Dependency List

### Runtime (15 packages)

**UI Framework:**

- `react@19.1.1` + `react-dom@19.1.1`

**UI Components (Radix primitives):**

- `@radix-ui/react-checkbox@1.3.3`
- `@radix-ui/react-progress@1.1.7`
- `@radix-ui/react-slider@1.3.6`
- `@radix-ui/react-slot@1.2.3`

**Styling:**

- `@tailwindcss/vite@4.1.16`
- `class-variance-authority@0.7.1`
- `clsx@2.1.1`
- `tailwind-merge@3.3.1`

**Other:**

- `zustand@5.0.8` (state)
- `lucide-react@0.548.0` (icons)
- `react-dropzone@14.3.8` (file upload)
- `media-chrome@4.15.1` (video controls)

### Development (23 packages)

**Build & TypeScript:**

- `vite@7.1.7`, `@vitejs/plugin-react@5.0.4`
- `typescript@5.9.3`
- `@types/react@19.1.16`, `@types/react-dom@19.1.9`, `@types/node@24.6.0`

**Testing:**

- `vitest@4.0.5`, `@vitest/ui@4.0.5`
- `@testing-library/react@16.3.0`, `@testing-library/user-event@14.6.1`
- `happy-dom@20.0.10`, `jsdom@27.0.1`
- `@playwright/test@1.56.1` (configured, unused)
- `msw@2.11.6`

**Linting:**

- `eslint@9.36.0`, `@eslint/js@9.36.0`
- `typescript-eslint@8.45.0`
- `eslint-plugin-react-hooks@5.2.0`, `eslint-plugin-react-refresh@0.4.22`
- `globals@16.4.0`

**Styling:**

- `tailwindcss@4.1.16`

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev         # Start dev server (http://localhost:5173)
npm run build       # TypeScript compile + Vite production build
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

### Testing

```bash
npm run test              # Run Vitest unit tests
npm run test:ui           # Run tests with Vitest UI
npm run test:coverage     # Generate coverage report
```

---

## 📝 How to Use

1. **Upload Video**: Drag & drop or click to upload MP4 file (max 500MB)
2. **Wait for Processing**: Animated loading screen (~2-3 seconds)
3. **View Transcript**: Transcript appears with sections and timestamps
4. **Select Highlights**: Check sentences you want in highlight reel
5. **Navigate**: Click timestamps, use keyboard shortcuts, or control bar
6. **Watch**: Video plays only highlighted segments with text overlays

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components (Radix primitives)
│   ├── video/          # Video player, controls, timeline
│   ├── transcript/     # Transcript panel, sections, sentences
│   ├── upload/         # Upload area, dropzone, loading
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
│   └── use-video-player.ts  # Main video playback hook
├── stores/             # Zustand state management
│   └── transcript-store.ts  # Central store
├── utils/              # Utility functions
│   ├── time-utils.ts        # Time formatting
│   └── highlight-playback.ts # Segment calculations
├── constants/          # Centralized constants
│   └── index.ts
├── types/              # TypeScript type definitions
├── __tests__/          # Vitest test files (111 tests)
└── test/               # Test setup
```

---

## 🎯 Recent Improvements (2025)

### Code Quality

- ✅ ErrorBoundary component added
- ✅ Fixed blob URL memory leaks
- ✅ Refactored use-video-player hook (comprehensive JSDoc)
- ✅ Centralized constants file
- ✅ Removed duplicate components

### Performance

- ✅ toggleHighlight optimization (early bailout)
- ✅ Debounced auto-scroll (100ms)
- ✅ Proper cleanup (timeouts, event listeners)

### Accessibility

- ✅ ARIA labels on video player and timeline
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

### UX

- ✅ Upload button loading states
- ✅ Error handling with user-friendly messages
- ✅ Disabled states during operations

### Testing

- ✅ 111 unit tests (all passing)
- ✅ VideoPlayer component tests
- ✅ SentenceItem with debouncing tests
- ✅ UploadArea accessibility tests

---

## 🧪 Testing

**Framework:** Vitest with happy-dom
**Coverage:** 111 tests across 10 files
**Focus:** Utilities, store actions, critical component behaviors

Tests cover:

- Video player rendering and functionality
- Sentence auto-scroll with debouncing
- Upload area UI and accessibility
- Control bar navigation
- Transcript store state management
- Highlight playback utilities

---

## 📱 Browser Support

✅ Chrome, Firefox, Safari, Edge (latest)
✅ iOS Safari, Android Chrome (latest)

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 📖 Documentation

For detailed AI assistant guidance and codebase documentation:

- [CLAUDE.md](./CLAUDE.md) - Technical details, patterns, conventions

---

## 🤝 Contributing

Contributions welcome! Please ensure:

- ✅ All tests pass (`npm run test`)
- ✅ Code is linted (`npm run lint`)
- ✅ TypeScript compiles (`npm run build`)
- ✅ Follow kebab-case naming
- ✅ Add JSDoc for complex logic

---
