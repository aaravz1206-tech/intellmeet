# IntellMeet – Enterprise Video Conferencing Design Brief

## Tone & Differentiation
Brutalist industrial tech with Matrix influence. Grid patterns, glowing emerald highlights, monospace DNA. Sharp no-nonsense interfaces for high-stakes collaboration. Cyberpunk enterprise edge without novelty.

## Color Palette (OKLCH)
| Token | OKLCH | Usage | CSS |
|:------|:------|:------|:----|
| **Background** | 0.068 0 0 | Deep charcoal canvas, #020617 equivalent | `oklch(var(--background))` |
| **Foreground** | 0.95 0 0 | Primary text, nearly white | `oklch(var(--foreground))` |
| **Primary** | 0.55 0.15 142 | Emerald-500, CTAs, active states, glow | `oklch(var(--primary))` |
| **Accent** | 0.65 0.2 40 | Amber-500, secondary highlights | `oklch(var(--accent))` |
| **Card** | 0.11 0 0 | Slate-900 surface, meeting tiles | `oklch(var(--card))` |
| **Border** | 0.18 0 0 | Slate-800 dividers, grid lines | `oklch(var(--border))` |
| **Destructive** | 0.6 0.2 25 | Red-500, danger actions, leave button | `oklch(var(--destructive))` |
| **Muted** | 0.2 0 0 | Secondary UI, disabled states | `oklch(var(--muted))` |

## Typography
| Role | Font | Stack | Use |
|:-----|:------|:---------|:----|
| **Display / UI** | JetBrainsMono | Monospace | Meeting codes, status labels, command interface |
| **Body** | GeneralSans | Sans-serif | Primary content, descriptions, UI labels |
| **Mono** | JetBrainsMono | Monospace | Code snippets, participant IDs, technical text |

## Structural Zones
| Zone | Background | Border | Treatment | Purpose |
|:-----|:-----------|:-------|:----------|:---------|
| **Header** | card (0.11) | border (0.18), 1px bottom | Sharp top bar with emerald CTA accent | Navigation, user profile, settings |
| **Video Grid** | background (0.068) | card borders, 2px on hover | Participant tiles with grid-pattern underlay, glow on active speaker | Main meeting interaction |
| **Sidebar/Panel** | card (0.11), grid-pattern overlay | border (0.18), 1px | Monospace participant list, timer, controls | Meeting state & info |
| **Content** | background (0.068) | border dividers | Whiteboard canvas, recording indicator area | Collaboration surfaces |
| **Footer** | card (0.11) | border (0.18), 1px top | Minimal controls, mute/camera toggles, leave button | Quick access to meeting controls |

## Spacing & Rhythm
- **Density**: Compact (8px, 12px, 16px base units) — enterprise efficiency
- **Outer margins**: 24px (lg screens), 16px (md), 12px (sm)
- **Card padding**: 16px
- **Gaps between tiles**: 8px

## Component Patterns
- **Video tiles**: `border-emerald-glow` on hover, `border-emerald-glow-active` + `glow-emerald-active` on active speaker
- **Buttons**: Primary emerald with shadow, secondary muted gray, danger red with sharp corners (4px)
- **Inputs**: Charcoal background, border-border, focus ring emerald
- **Status badges**: Monospace `.code-label`, green for online, amber for away, red for offline
- **Modals**: Popover surface with border-top amber accent stripe (4px)

## Motion & Animation
- **Entrance**: Fade + subtle up (200ms) on page load
- **Interactive**: Emerald glow pulse (`pulse-glow` 2s) on active states
- **Transitions**: All 0.3s cubic-bezier(0.4, 0, 0.2, 1) for smooth state changes
- **Hover states**: Border glow + 8px shadow elevation

## Utilities & Signature Details
- `.glow-emerald`: Soft outer glow + inset highlight (ambient lighting effect)
- `.glow-emerald-active`: Intensified glow for active speaker/focused element
- `.grid-pattern`: 40px repeating grid overlay on cards (visual anchor, 30% opacity)
- `.code-label`: Monospace 12px, 0.02em letter-spacing — meeting codes, participant IDs
- `.border-emerald-glow`: 1px emerald border, 4px radius, subtle ambient glow
- `.border-emerald-glow-active`: Full emerald border, bright glow, visual focus pull

## Constraints
- ✋ NO blue, violet, indigo, sky, cyan anywhere (strict brand rule)
- ✋ No rounded-full unless icon button container
- ✋ No default Tailwind shadows — use token shadows only
- ✋ Monospace for codes and technical labels; body font for prose
- ✋ Emerald reserved for primary actions & focus; amber for secondary highlights only
- ✋ All text must meet WCAG AA contrast minimum (0.7 L lightness difference)

## Signature Detail
**Glowing Emerald Active State**: When a participant is speaking or an element is focused, the border pulses with emerald glow (0 0 16px with box-shadow), creating instant visual feedback. Grid pattern underlays on all cards reinforce the "hacker control room" aesthetic without distraction.
