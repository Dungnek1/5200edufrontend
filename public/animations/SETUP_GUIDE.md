# Storyset Video Setup Guide

## Implementation Complete ✓

The animated Storyset illustrations have been successfully integrated into the teacher dashboard using MP4 video format.

### What Was Done

1. **Updated dashboard page** - Replaced Lottie components with HTML5 `<video>` tags in 3 cards
2. **Removed lottie-react dependency** - No longer needed, using native browser video support
3. **Updated animations folder** - `/public/animations/` ready for MP4 files
4. **Updated documentation** - Clear instructions for downloading MP4 videos

### Location in Code

**File**: `app/[locale]/instructor/dashboard/page.tsx`
**Section**: "Chúng tôi hiểu điều gì quan trọng với Giảng viên"

**Cards updated**:
- Card 1: "Bạn không xây dựng mọi thứ một mình"
- Card 2: "Thu nhập cần được đo lường minh bạch"
- Card 3: "Dữ liệu được phục vụ cho quyết định của bạn"

### Required Actions (STILL NEEDED)

**You need to download 2 MP4 video files from Storyset:**

#### 1. browser-stats-rafiki.mp4
- URL: https://storyset.com/illustration/browser-stats/rafiki
- Used in: Card 1 and Card 2
- Save to: `/public/animations/browser-stats-rafiki.mp4`

#### 2. business-decisions-bro.mp4
- URL: https://storyset.com/illustration/business-decisions/bro
- Used in: Card 3
- Save to: `/public/animations/business-decisions-bro.mp4`

### How to Download from Storyset

1. Visit the illustration URL
2. Click the "Download video" button (MP4 format)
3. Save the MP4 file to `/public/animations/` with the correct filename

### Benefits of MP4 over Lottie

- **No dependencies**: Removed lottie-react package (~50KB smaller bundle)
- **Better performance**: Native browser video playback, optimized by browser
- **Smaller files**: MP4 compression is better than Lottie JSON for complex animations
- **Universal support**: All browsers support HTML5 video
- **Free access**: Storyset provides MP4 download without premium account

### Files Modified

- `app/[locale]/instructor/dashboard/page.tsx` - Replaced Lottie with `<video>` tags
- `package.json` - Removed lottie-react dependency
- `/public/animations/README.md` - Updated with MP4 instructions
- `/public/animations/SETUP_GUIDE.md` - This file

### Testing After Download

1. After downloading the MP4 files, restart dev server: `npm run dev`
2. Visit `/instructor/dashboard` page
3. Verify videos play smoothly in all 3 cards
4. Check that videos autoplay, loop, and are muted

### Troubleshooting

**If videos don't show:**
- Check browser console for 404 errors (video files not found)
- Verify file names match exactly: `browser-stats-rafiki.mp4` and `business-decisions-bro.mp4`
- Ensure files are in `/public/animations/` folder

**If videos don't autoplay:**
- Verify `muted` attribute is present (required for autoplay in most browsers)
- Check browser autoplay settings (some browsers block unmuted autoplay)
- Ensure `playsInline` attribute is set for iOS compatibility

**If videos look stretched/pixelated:**
- Check that `object-contain` class is applied
- Verify `maxWidth` and `maxHeight` styles are set to 100%

### Attribution

Storyset illustrations are free with attribution.
Add to page footer if needed: "Illustrations by Storyset"
