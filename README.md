# SSG-JB3 Intelligence

SSG Security Operations Intelligence Hub — JB3Ai / OS3

Landing page for the SSG Intelligence platform at `www.jb3ai.com/ssg`.

## Modules

- **VoiceGrid OS3Grid** — Acoustic monitoring and voice intelligence
- **Falagalor** — NLP framework for localised dialect processing
- **ViewGrid Sentinel OS3** — Satellite-based illegal mining detection

## Operational Projects

This repository is the SSG intelligence web front door for two working systems:

- **MZANZI_CORE** — localized mining, security, and community-liaison VoiceGrid system.
  - Workspace source: `OS3_VOICE_GRID/OS3_VoiceGrid_MZANZI_CORE`
  - GitHub: `JB3Ai/OS3_VoiceGrid_MZANZI_CORE.git`
- **Sentinel Eye** — Next.js ViewGrid watch layer for satellite OSINT, alerts, and risk scoring.
  - Workspace source: `Claude Working Folder/sentinel-eye`

## Structure

```
index.html              # Landing page
docs/brochures/         # PDF brochures
projects/               # HTML project profiles for MZANZI_CORE and Sentinel Eye
```

## Deployment

Static site — serve `index.html` at `/ssg` on the main domain.
