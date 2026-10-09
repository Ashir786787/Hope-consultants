# Hero video playlist

Give the Midnight Blue hero under the navbar a real video background that crossfades between the four Pexels clips, without lag.

## The problem this solves

All four supplied files are 4K and enormous:

| Clip | Source file | Resolution | FPS | Size |
|---|---|---|---|---|
| 1 | `14055813_3840_2160_50fps.mp4` | 3840x2160 | 50 | 111.09 MB |
| 2 | `6536428-uhd_3840_2160_24fps.mp4` | 3840x2160 | 24 | 45.91 MB |
| 3 | `7304302-uhd_4096_2160_30fps.mp4` | 4096x2160 | 30 | 23.06 MB |
| 4 | `13439876_3840_2160_60fps.mp4` | 3840x2160 | 60 | 137.52 MB |

Total 317.52 MB. Four different frame rates. Shipping these as-is would make the hero the single worst-performing thing on the site and would visibly judder when crossfading between mismatched frame rates. Every fix below exists to make the result smooth.

## Decisions taken

- Rotate all four with a slow crossfade.
- ffmpeg may be installed via winget.
- The aurora is hidden while video plays; it still shows for reduced-motion and save-data users.

## Target

1920x1080, 30 fps, yuv420p, no audio, H.264 MP4 plus VP9 WebM, total MP4 budget at or under 10 MB. Roughly a 97 percent reduction from source.

## Steps

### 1. Install ffmpeg

`winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements`

If the shim is not on PATH for the session, resolve the installed binary directly and use the full path.

### 2. Download the four sources

Fetch the resolved `videos.pexels.com` file URLs into a temp directory outside the repository, so no 4K source ever risks being committed.

Temp dir: `C:\Users\mashi\AppData\Local\Temp\opencode\pexels-raw`

### 3. Measure durations, then transcode

Run `ffprobe` on each source and report exact duration before compressing. If a clip is long, keep a representative segment rather than the whole thing; if short, keep it whole.

Per clip, H.264 pass:

```
-i source.mp4 -an
-vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30"
-c:v libx264 -profile:v high -level 4.0 -preset slow -crf 26
-pix_fmt yuv420p -movflags +faststart
```

VP9 pass from the H.264 output:

```
-i clip.mp4 -an
-c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good -cpu-used 3
```

Identical parameters for all four is the whole point: one frame rate, one pixel format, one encoder profile, so the crossfade has nothing to judder against. If any output exceeds budget, raise CRF to 28 and re-run that clip only.

Also extract a poster JPEG per clip from roughly one second in, so every video element has a first frame and nothing flashes black.

### 4. Install outputs

`public/hero/`, one set per clip:

```
hero-clip-1.mp4   hero-clip-1.webm   hero-clip-1-poster.jpg
hero-clip-2.mp4   hero-clip-2.webm   hero-clip-2-poster.jpg
hero-clip-3.mp4   hero-clip-3.webm   hero-clip-3-poster.jpg
hero-clip-4.mp4   hero-clip-4.webm   hero-clip-4-poster.jpg
```

### 5. Extend the resolver

`src/lib/hero-media.ts`

- Scan `public/hero` for the numbered set, sort numerically, return an ordered `clips` array.
- Keep the existing single-file names as a fallback so nothing breaks if the set is ever absent.
- `hasHeroMedia` reports true for either shape.

### 6. Rebuild the reveal as a crossfade player

`src/components/motion/cinematic-reveal.tsx`

- Render all clips stacked, absolutely positioned, only one playing at a time.
- Keep the existing one-time intro reveal (scale 1.1 plus blur 30 to scale 1 plus blur 0) on the container. Unchanged.
- On a clip ending, crossfade: animate `opacity` only on the outgoing and incoming layers, `power2.inOut`, about 1.2 s, then swap which element is playing.
- Never animate `width`, `height`, `top`, `left` or `filter` during rotation. Only `opacity` and `transform` for the one-off reveal.
- `will-change` added only while a crossfade is running, removed after.
- All videos: `muted`, `playsInline`, `preload` controlled, `disablePictureInPicture`, `disableRemotePlayback`.
- First clip `preload="auto"` so the hero is ready immediately. Clips 2 to 4 `preload="none"`, then promoted to `auto` one at a time in idle time after the intro reveal finishes, so background fetching never competes with the reveal.
- Existing reduced-motion and `navigator.connection.saveData` behaviour kept: those users get the poster image only and download no video at all.
- Existing off-screen pause kept and extended to every clip.
- Full cleanup: scoped GSAP context, killed timelines, removed listeners on unmount, so route changes do not leak or duplicate.

### 7. Gate the aurora

`src/components/sections/hero.tsx`

- Introduce one small client leaf, `components/motion/hero-backdrop.tsx`, that owns the decision in one place: reduced motion or save-data means render `<HeroAurora />`, otherwise render the video player.
- `hero.tsx` then has a single backdrop child instead of two, so the composition rule lives in one file rather than being split.
- Both branches are decorative, `pointer-events-none` and `aria-hidden`, so swapping in an effect is safe and hydration-safe. The aurora starts mounted and fades out rather than popping, to avoid a flash before the client knows the connection type.

### 8. Correct the docs

`AGENTS.md`

- The hero aurora section currently states there is no filmed video on this site. Correct it, and note the aurora is hidden while video plays.
- Update the cinematic media reveal section to describe the numbered playlist, the uniform-encode requirement, and the idle-time preload ladder.

## Verification I can do

- `npx tsc --noEmit`, `npm run lint`, `npm run build`, all clean.
- `ffprobe` every output: confirm 1920x1080, 30 fps, yuv420p, no audio stream, plus duration and file size.
- Before/after size table for all four clips.
- Dev server: `/` returns 200, each clip and poster returns 200.
- Confirm no source 4K file is inside the repository or staged.

## Verification I cannot do, so you must

I cannot see rendering or measure frame timing. You need to confirm actual smoothness, since that is the requirement this plan is built around.

## Risks

- Pexels licence permits use without attribution. Flagged as your call, not changed.
- Judder can still appear if the OS compositor struggles, though 1080p at 30 fps with a single playing element leaves a lot of headroom.
- The blur-to-clear intro is the heaviest moment, because it composites a large blur with video decode. Clips 2 to 4 are not promoted until after it finishes, which keeps that moment cheap.

## Out of scope

No changes to business logic, content, or any other section. No commit or push until you ask.
