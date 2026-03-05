# Storyset Video Animations

This folder contains MP4 video animation files from Storyset (https://storyset.com).

## Required Videos

### 1. browser-stats-rafiki.mp4 ✅ (INSTALLED)
- **Source**: https://storyset.com/illustration/browser-stats/rafiki
- **Used in**: Card 1 & Card 2 of "Chúng tôi hiểu điều gì quan trọng với Giảng viên" section
- **Fallback**: `/images/browser-stats-rafiki-1.svg`

### 2. business-decisions-bro.mp4 ✅ (INSTALLED)
- **Source**: https://storyset.com/illustration/business-decisions/bro
- **Used in**: Card 3 of "Chúng tôi hiểu điều gì quan trọng với Giảng viên" section
- **Fallback**: `/images/business-decisions-bro.svg`

## Why MP4 instead of Lottie?

- **Better performance**: Smaller file sizes, smoother playback
- **Better quality**: Native video format with better browser support
- **No dependencies**: Doesn't require lottie-react package
- **Storyset support**: Storyset provides MP4 out of the box (no premium needed)

## Usage in Code

The videos are used in `app/[locale]/instructor/dashboard/page.tsx` via the `AnimatedImage` component which provides automatic fallback to static SVG images:

```typescript
<AnimatedImage
  videoSrc="/animations/browser-stats-rafiki.mp4"
  imageSrc="/images/browser-stats-rafiki-1.svg"
  alt="Browser stats"
  className="w-full h-full object-contain"
/>
```

### Fallback Behavior

The `AnimatedImage` component:
1. Attempts to load and play the MP4 video
2. If video fails to load or returns 404, automatically displays the static SVG fallback
3. Ensures no broken video icons appear on the page

### Video Attributes Explained

- `autoPlay` - plays automatically when loaded
- `loop` - repeats infinitely
- `muted` - required for autoplay to work in most browsers
- `playsInline` - prevents fullscreen on iOS devices
- `object-contain` - maintains aspect ratio without stretching

## Notes

- Storyset is free for personal/commercial use with attribution
- Attribution: "Illustrations by Storyset"
- Files are loaded from public folder, so they're served statically
- MP4 files are typically 1-5MB each (much smaller than GIF equivalents)
