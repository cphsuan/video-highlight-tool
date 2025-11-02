# Video Highlight Tool

A modern web application for creating video highlights with AI-generated transcripts. Upload a video, get an automatic transcript with sections and timestamps, select sentences to highlight, and preview your highlight reel in real-time.

## ✨ Features

### Core Functionality
- **Video Upload**: Mock video upload interface that simulates AI processing
- **AI Transcript Generation**: Automatically generated transcript with sections, timestamps, and sentences (mock API)
- **Split-Screen Interface**:
  - Left panel: Video player with controls and timeline
  - Right panel: Interactive transcript editor
- **Highlight Selection**: Check/uncheck sentences to create your highlight reel
- **Two-Way Synchronization**:
  - Video playback automatically highlights the current sentence
  - Click timestamps to jump to specific moments
  - Auto-scrolling transcript follows video playback
- **Visual Timeline**: See highlighted segments on a visual timeline bar
- **Text Overlay**: Selected highlight text appears as subtitles on the video

### User Experience
- **Responsive Design**:
  - Desktop: Side-by-side layout (60/40 split)
  - Tablet: Vertical stacking
  - Mobile: Full-screen views with smooth transitions
- **Keyboard Shortcuts**:
  - `Space` or `K`: Play/Pause
  - `←/→`: Seek backward/forward 5 seconds
  - `J/L`: Seek backward/forward 10 seconds
  - `0` or `Home`: Jump to start
  - `End`: Jump to end
- **Loading States**: Animated loading screen with progress indicator
- **Dark Mode Support**: Built-in dark mode with smooth transitions

## 🛠 Tech Stack

- **React 19.1.1** + **TypeScript 5.9.3** + **Vite 7.1.7**
- **TailwindCSS v4.1.16** + **shadcn/ui** for styling
- **Zustand 5.0.8** for state management
- **Native HTML5 Video** for video playback
- **Vitest 4.0.5** + **Testing Library** for testing

## 🎯 Technical Decisions

### Why Native HTML5 Video Instead of react-player?

This project uses native HTML5 `<video>` element rather than react-player for several key reasons:

1. **Precise Control for Highlight Playback**: The app requires complex custom behavior including automatic skipping between highlight segments, which needs direct access to video events (`seeking`, `seeked`, `play`, `pause`) and programmatic control via refs.

2. **Performance & Bundle Size**: react-player (~2MB) wraps multiple players (YouTube, Vimeo, etc.) but this app only needs local MP4 playback. Native HTML5 is lighter and sufficient.

3. **Event Handling Precision**: The highlight-only playback mode requires preventing race conditions during seeks using custom ref management (`isSeekingRef`, `lastManualSeekTime`), which is simpler with direct video element access.

4. **No External Video Sources**: The current implementation focuses on uploaded local videos, not external platforms.

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## 📝 How to Use

1. **Upload Video**: Click the "Upload Video" button
2. **Wait for Processing**: Watch the animated loading screen (1-2 seconds)
3. **View Transcript**: The transcript appears with all sentences
4. **Select Highlights**: Check boxes next to sentences you want to highlight
5. **Navigate**: Click timestamps or use keyboard shortcuts
6. **Watch**: Play the video and see highlighted text as overlays

## 🧪 Testing

```bash
npm run test          # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

**Test Coverage**: 38 tests covering utilities, store, and components

## 📦 Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   ├── upload/       # Upload flow
│   ├── video/        # Video player
│   ├── transcript/   # Transcript editor
│   └── layout/       # Layouts
├── stores/           # Zustand store
├── hooks/            # Custom hooks
├── types/            # TypeScript types
├── utils/            # Utilities
└── __tests__/        # Tests
```

## 🎯 Design Decisions

**State Management**: Zustand for minimal boilerplate and excellent TypeScript support

**Styling**: TailwindCSS v4 + shadcn/ui for rapid development with customizable components

**Testing**: Vitest for fast unit tests with 38 tests covering critical paths

**Performance**: Code splitting, memoization, debounced updates

**Accessibility**: Full keyboard support, ARIA labels, semantic HTML

## 📱 Browser Support

✅ Chrome, Firefox, Safari, Edge (latest)
✅ iOS Safari, Android Chrome (latest)

## 🚀 Deployment

```bash
# Vercel (recommended)
npm install -g vercel
vercel --prod

# Netlify
npm install -g netlify-cli
netlify deploy --prod
```

## 📄 License

MIT

---

**Built with ❤️ for Frontend Homework Assignment**
