Below is a **ready‑for‑production mock‑up kit** that gives you everything a visual‑designer or Sora operator needs to generate *pixel‑perfect* screens for both desktop and mobile. You will find:

* **Information‑architecture & layout blueprint** – which regions go where and why.
* **Twenty Sora prompts** (10 desktop + 10 mobile) – already normalised on style, resolution, and duration.
* **Global component boards** – colour & typography palettes, glass tokens, icon set, states.
* **Hand‑off notes** – grids, responsiveness, accessibility, dev‑ready specs.

---

## 1. Global Style & Prompt Boilerplate

```
STYLE = "ultra‑sharp 4‑K (desktop 3840×2160) or 1242×2688 iPhone resolution, 60‑fps still‑frame capture, 3‑D cosmic glass UI, deep‑space backdrop #0d0d1a, neon‑blue (#1877f2) & magenta (#ff2080) accents, translucency & subtle volumetric lighting"

NEG = "—no flat illustration —no cartoon mascot —no pastel —no 2‑D icons —no low‑poly"
```

Always prefix individual prompts with `{STYLE}.` and finish with `{NEG}.`

---

## 2. Information‑Architecture Blueprint

| Zone                 | Desktop Layout (1440 + px)                                                     | Mobile Layout (< 480 px)                        |
| -------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| **Navigation**       | Collapsible *Constellation‑bar* at left (72 px) – orbit icons animate on hover | Bottom sheet 72 px high, thumb‑zone aligned     |
| **Work Canvas**      | Centre 80 % width, 16∶9 safe area for timeline, script pad or preview          | Full‑width card stack; swipe to switch canvases |
| **Context Panel**    | Right 20 % – AI suggestions, asset browser, live preview                       | Slide‑up drawer (overscroll to reveal)          |
| **Status & Actions** | Header bar 56 px: project name, share, settings, progress stars                | Collapsed into “…” kebab in top‑right           |
| **Global Effects**   | Always‑visible galaxy swirl at rear Z‑layer indicating AI processing           | Pulsating border on current card                |

Grid: **12‑col, 88‑px max column, 32‑px gutter** on desktop; **4‑col, 16‑px gutter** on mobile. All modules snap to 4‑pt spacing system.

---

## 3. Desktop Mock‑up Prompts (×10)

| #    | Screen                                      | Sora Prompt (paste as one line)                                                                                                                                                            |
| ---- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D‑1  | **Landing – Project Galaxy**                | `{STYLE}. Wide desktop browser window shows immersive star‑field; centre star card “Social AI Pro – Project Galaxy” glows; orbiting mini‑stars with drop shadows; top bar minimal. {NEG}.` |
| D‑2  | **Dashboard – Multi‑Project Constellation** | `{STYLE}. Desktop UI: left constellation rail collapsed, centre galaxy shows multiple bright project stars with progress rings; hover tooltip “42 % Complete”; ambient parallax. {NEG}.`   |
| D‑3  | **Project Workspace Hub**                   | `{STYLE}. Full‑width 3‑D sound‑stage: three large translucent orbs labelled Script, Voice, Video orbit core; right panel lists recent edits; subtle floor reflection. {NEG}.`              |
| D‑4  | **Script Creation (Expanded)**              | `{STYLE}. Dark glass canvas left 65 %, code‑editor cursor blinks; pastel word droplets merge; right side live video thumbnail; top tells “Tone: adventurous”. {NEG}.`                      |
| D‑5  | **AI Suggestion Drawer**                    | `{STYLE}. Slide‑out right drawer shows floating suggestion chips, each glowing; click mock‑cursor dragging chip into script; timeline minimap bottom. {NEG}.`                              |
| D‑6  | **Voice Selection Marketplace**             | `{STYLE}. Carousel of 3‑D voice orbs in theatre void; each orb halo reflects waveform; slider beneath adjusts emotion; spectral bars footer; constellation nav left highlighted. {NEG}.`   |
| D‑7  | **Video Assembly Timeline**                 | `{STYLE}. Magnetic timeline centre; clips levitate, snap; holographic preset cards above; dual preview (TikTok 9∶16 left, YouTube 16∶9 right); subtle space‑fog. {NEG}.`                   |
| D‑8  | **AI Style Transfer Panel**                 | `{STYLE}. Right panel overlay lists style filters with looping thumbnails; hovering filter expands card 20 %; left timeline dimmed. {NEG}.`                                                |
| D‑9  | **Preview & Share**                         | `{STYLE}. Finished video in glass frame centre; below, glowing platform buttons; frosted blur share sheet right; confetti particles; header shows “Ready to Publish”. {NEG}.`              |
| D‑10 | **Settings & Accessibility**                | `{STYLE}. Settings modal floating; toggle for One‑Hand Mode, Motion‑Reduce, High‑Contrast; behind, blurred workspace; phosphor blue focus outlines. {NEG}.`                                |

---

## 4. Mobile Mock‑up Prompts (×10)

| #    | Screen                          | Sora Prompt (paste as one line)                                                                                                         |
| ---- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| M‑1  | **Mobile Landing**              | `{STYLE}. iPhone‑Aspect full‑screen: single central star card, bottom orbital nav bar, thumb‑reach CTAs. {NEG}.`                        |
| M‑2  | **Project List**                | `{STYLE}. Card stack slides vertically, each card starry thumbnail + title, subtle depth. {NEG}.`                                       |
| M‑3  | **Stage Selector Orbit (gyro)** | `{STYLE}. Portrait: 3 glass orbs revolve when phone tilts; top shows “Swipe up to enter Script”. {NEG}.`                                |
| M‑4  | **Script Canvas**               | `{STYLE}. Full‑screen dark pad, word‑cloud bubbles pop in; bottom voice mic FAB; AI swirl at top; split preview via swipe‑left. {NEG}.` |
| M‑5  | **Voice Orb Carousel**          | `{STYLE}. Edge‑to‑edge carousel of voice orbs; emotion knob bottom‑centre; waveform bar overlay. {NEG}.`                                |
| M‑6  | **Clip Magnet Timeline**        | `{STYLE}. Horizontal scroll timeline, clips snap; pinch splits to dual preview; top bar progress 2 / 3 stars. {NEG}.`                   |
| M‑7  | **Effects Quick‑Sheet**         | `{STYLE}. Pull‑up sheet half‑height shows style chips as mini loops; glass blur background; one chip selected glows. {NEG}.`            |
| M‑8  | **Preview**                     | `{STYLE}. Vertical phone mock‑up playing video; below: TikTok, IG, YT icons in pill buttons; confetti micro‑anim. {NEG}.`               |
| M‑9  | **Celebration Overlay**         | `{STYLE}. Screen dims, constellation line animates, clapboard snap, stardust; CTA buttons slide up. {NEG}.`                             |
| M‑10 | **Profile & Settings**          | `{STYLE}. Scrollable list of settings, large toggle pills; neon blue focus; footer nav bar stays. {NEG}.`                               |

---

## 5. Component‑Board Prompts

**A. Colour & Type Tokens**
`{STYLE}. Isolated component board on dark canvas: swatches primary #1877f2, magenta #ff2080, neutrals, success/alert; typography samples Inter 14–96 pt; buttons default, hover, disabled. {NEG}.`

**B. Iconography & States**
`{STYLE}. Grid of 3‑D line icons: play, pause, record, share; each in default, hover (halo), active (filled) states; sized 32 px. {NEG}.`

**C. Glass Morphology**
`{STYLE}. Panel showing three elevation levels: 0 px, 8 px, 24 px blur; light reflections; labelled. {NEG}.`

**D. Interaction Blueprint**
`{STYLE}. Storyboard strip: finger tap, drag, pinch on phone; overlaid UI responses; cosmic background. {NEG}.`

---

## 6. Responsive & Dev Hand‑off Notes

| Spec                    | Value                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Desktop Breakpoints** | 1440 px (base), 1920 px, 2560 px, 4‑K                                                                                              |
| **Mobile Breakpoints**  | 375 px, 414 px, 430 px, folding (720 px)                                                                                           |
| **Grid**                | 12 col × 88 px (desktop), 4 col × calc((100vw‑48 px)/4) (mobile)                                                                   |
| **Spacing Scale**       | 4‑pt; major section paddings 40, 64, 96 pts                                                                                        |
| **Motion**              | Default easing `cubic‑bezier(0.16,1,0.3,1)`; prefers‑reduced‑motion → 150 ms fade                                                  |
| **Assets**              | WebP for raster, SVG for icons, Lottie JSON optional                                                                               |
| **React**               | Componentised via `@radix-ui` primitives, state in `zustand`; 3‑D layers via `react-three-fiber` loaded *after* `interactionStart` |

---

## 7. Accessibility Quick‑Checklist

* High‑contrast theme generated by doubling alpha on glass layers and shifting primaries to #0d8cff / #ff2fb0.
* All colour‑coded states mirrored by icon shape or stroke pattern.
* Focus outline 2 px #00eaff across themes.
* Screen‑reader labels for AI swirl (“AI processing ...”), timeline snaps (“Clip aligned at 00:15”).
* One‑Hand toggle → bottom‑aligned actionable areas within 48 px reach.

---

## 8. How to Use This Kit

1. **Copy a prompt**, paste into Sora (still‑frame mode), select the right resolution.
2. Tweak wording if you need to highlight a *specific* element (e.g., “show pulsating voice orb #3 bigger”).
3. Pull renders into Figma; overlay grid to verify alignment.
4. Iterate colours by re‑running prompts with explicit Hex overrides if required.
5. When every screen passes UX review, export as PNG/SVG → hand to devs alongside grids/table above.

You now have a **complete, coherent suite of high‑fidelity mock‑up images** for both web and mobile, plus the underlying design system to keep future iterations perfectly in sync. Enjoy building the cosmic studio!
