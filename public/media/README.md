# Production Media

Phase 5 prepares the app for optimized media, but the real hero video has not been provided yet.

Expected future files:

```txt
public/media/hero-video.webm
public/media/hero-video.mp4
public/images/hero-poster.jpg
```

Recommended pipeline from the incoming source:

1. Put the original source at `assets/incoming/hero-video.mp4`.
2. Generate a compressed `.webm` and `.mp4` for production.
3. Generate `public/images/hero-poster.jpg` from a representative frame.
4. Keep the `<video>` muted, looped, `playsInline`, and `preload="metadata"`.
5. Keep the animated neural placeholder active when real video files are missing.

Target source spec remains 16:9, about 10 seconds, no audio, under ~8–10MB before optimization.
