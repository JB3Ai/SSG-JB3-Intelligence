# SSG-JB3 Intelligence

SSG Security Operations Intelligence Hub — JB3Ai / OS3

Landing page for the SSG Intelligence platform at `www.jb3ai.com/ssg`.

## Modules

- **VoiceGrid OS3Grid** — Acoustic monitoring and voice intelligence
- **Falagalor** — NLP framework for localised dialect processing
- **ViewGrid Sentinel OS3** — Satellite-based illegal mining detection

## Operational Projects

This repository is now both the SSG intelligence web front door and a source mirror host for two working systems:

- **MZANZI_CORE** — localized mining, security, and community-liaison VoiceGrid system.
  - Mirror source path in this repo: `OS3_VoiceGrid_MZANZI_SSG`
  - Upstream GitHub: `JB3Ai/OS3_VoiceGrid_MZANZI_CORE.git`
- **Sentinel Eye** — Next.js ViewGrid watch layer for satellite OSINT, alerts, and risk scoring.
  - Source path in this repo: `sentinel-eye`

## Structure

```
index.html              # Landing page
docs/brochures/         # PDF brochures
projects/               # HTML project profiles for MZANZI_CORE and Sentinel Eye
OS3_VoiceGrid_MZANZI_SSG/ # OS3 VoiceGrid source mirror used for SSG
sentinel-eye/             # Sentinel Eye source now hosted inside this repo
```

## Deployment

Static site — serve `index.html` at `/ssg` on the main domain.
