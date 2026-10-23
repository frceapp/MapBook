---
name: frontend-development
description: >-
  Comprehensive frontend development and UI/UX implementation skill for React, Vite, Tailwind CSS, Framer Motion, and interactive mapping (MapLibre GL JS). Use when building, styling, animating, or optimizing frontend web components, layouts, forms, modals, and state management.
---

# Frontend Development Skill (ISCOMFEST 2026 Edition)

This skill guides the architecture, styling, animation, and accessibility of modern React + Vite + Tailwind CSS + Framer Motion applications, tailored specifically for the Yogyakarta Literacy & Culture Exploration Platform (**Museum, Cafe Book, Perpustakaan**).

## 1. Core Architecture & Design System Tokens
- **Surface Palette**:
  - Main Surface: `#FFFDF9` (Warm Cream White)
  - Secondary Surface: `#F5EFE6` (Soft Oatmeal)
  - Main Text & Stroke: `#5C4033` (Cozy Dark Brown — contrast > 9.5:1)
  - Muted Text: `#8C7365` (Warm Taupe)
- **Category & Accent Palette** (Always pair with `#5C4033` text, NEVER white text):
  - **Cafe Book (Pink)**: `#FFB7C5` (Pastel Sakura)
  - **Perpustakaan (Cyan)**: `#A0E7E5` (Soft Mint Cyan)
  - **Museum (Yellow)**: `#FFE699` (Sunny Butter)
  - **Status Open / Closed**: `#88D49E` (Sage Green) / `#FF8A8A` (Coral)

## 2. Ergonomics & Proportional Geometry
- **8-Point Grid System**: Use 4px/8px multiples (`gap-2`, `gap-3`, `gap-4`, `p-5` mobile, `p-6`/`p-8` desktop).
- **Nested Border Radius Harmony** ($R_{\text{inner}} = R_{\text{outer}} - \text{Padding}$):
  - Outer Cards & Modals: `rounded-3xl` (`24px`), `border-2 border-[#5C4033]`, tactile shadow `shadow-[0_6px_0_#5C4033]`.
  - Inner Cards, Photo Carousels, Inputs: `rounded-2xl` (`16px`) or `rounded-xl` (`12px`–`14px`), `border-[1.5px] border-[#5C4033]`.
- **Touch Targets & Tactile Micro-interactions**:
  - Interactive buttons/dropdowns/pins must be `40px`–`48px` (`h-10` to `h-12`).
  - Active press state: `active:translate-y-0.5` with reduced bottom shadow.

## 3. Persistent Map Layer & Zero Layout Shift
- Render `OpenFreeMap` + `MapLibre GL JS` once at `fixed inset-0 z-0` centered on **Yogyakarta** (`[110.3695, -7.7956]`).
- Never unmount or re-render the map when transitioning between Login (Page 1), Map Exploration (Page 2), Location Detail Modal (Page 3), and Archive Drawer (Page 4).
- Constrain photo carousels to maximum 5 photos with a fixed `aspect-[4/3]` container so switching photos causes zero layout shift.
