---
version: alpha
name: "Rowland Asorwoe Eyram Portfolio"
description: "A practical developer portfolio with a project board as its visual signature."
colors:
  primary: "#3159d7"
  primary-hover: "#2346b2"
  ink: "#17213c"
  muted: "#626d84"
  background: "#f6f8fb"
  surface: "#ffffff"
  border: "#dce2ed"
  soft-blue: "#e7edfc"
  green: "#2d675e"
  green-soft: "#e9f2ee"
  amber: "#9b610a"
  amber-soft: "#faf0df"
  danger: "#a42c3c"
  scroll-thumb: "#909db8"
  scroll-thumb-hover: "#626d84"
  scroll-thumb-active: "#3159d7"
  scroll-track: "#edf0f6"
typography:
  display:
    fontFamily: "Display, Arial Narrow, Arial, sans-serif"
  sans:
    fontFamily: "Body, Arial, sans-serif"
  mono:
    fontFamily: "Mono, monospace"
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
spacing:
  page-max: "1180px"
  section-gap: "110px"
components:
  button:
    min-height: "50px"
  card:
    padding: "30px"
  dialog:
    max-width: "1040px"
---

# Rowland Portfolio Design System

## Overview

### Creative North Star
A developer’s open project board: useful work in progress, orderly interfaces, and code that serves real people. The CV’s task manager provides the signature visual, with a calm navy code window layered over a cobalt-and-white board.

### Product context and register
- Audience and job: employers and collaborators evaluating Rowland’s skills and contacting him.
- Evidence: the user’s attached rowland_asorwoe_cv.pdf, with the user-requested name Rowland Asorwoe Eyram. Preserve CV facts; distinguish newly authored demos from original projects.
- Register: presentation-led portfolio. Small browser-local demonstrations support the narrative. No production CRUD service, medical model, authentication, or payments.
- Market and language: English, globally accessible, based in Ho, Ghana; GHS appears only in explicitly fictional storefront prices.
- Usage scene: recruiter desktop scanning and phone browsing. Prioritize readable project descriptions and direct contact.
- Memorable signature: layered task board and code window, echoed by small project interface illustrations.
- Restraint: quiet supporting sections, no fabricated performance numbers, testimonials, repository links, or professional portrait.
- Anti-references: neon cybersecurity dashboard, generic startup pricing page, and serif newspaper portfolio.
- Token ownership: styles.css :root is the runtime source; frontmatter mirrors it. Shared buttons, cards, and native dialog reuse those CSS variables. Illustrative artwork may use secondary tints documented in its source.

## Colors
White and ice-gray provide the canvas. Cobalt is the action and identity color; navy is text and the about section. Muted text stays readable. Green, amber, and blue distinguish example project states with text labels. Scrollbar tokens define thumb, track, hover, and active states; forced-colors mode uses system colors.

## Typography
Self-hosted URW Nimbus Sans Narrow Bold provides the condensed display voice. Nimbus Sans Regular/Bold carries body text, and Nimbus Mono captions the technical details. Font assets use WOFF and are preloaded for display and body. Headlines are deliberately large; paragraphs have restrained line lengths. Body is 17px with a 1.55 line height. Labels use sentence case except short technical eyebrows.

## Layout
1180px maximum content width; generous 110px desktop sections, 70px phone sections. Desktop hero, project grid, about, experience, and contact use distinct two-column arrangements. Breakpoints at 1050px, 760px, and 460px provide phone navigation and stacked content. Below 460px the project grid and task board stack. Native dialog owns its scrolling within the viewport. Media panels have fixed geometry, fonts preload, and document scrollbar gutter stays stable.

## Elevation & Depth
Most content uses borders and tonal separation. Shadows appear only on the layered illustrative interfaces and the modal. The dark about section separates biography from work without adding competing visual motifs.

## Shapes
6px controls, 12px panels, and 20px larger accents. Native dialog has an 18px corner. Circle shapes are reserved for compact identity and close controls. Icons use consistent simple stroke/fill SVG artwork, with visible action labels.

## Components
- Buttons and navigation: semantic buttons for actions, links for navigation; explicit hover, visible focus, active, and disabled behavior. Primary solid cobalt, secondary white with border.
- Dialog: native showModal supplies focus trapping, background isolation, and Escape. The close button receives initial focus; close restores the trigger. Dialog body scrolls without hiding its close control.
- Task sample: browser-memory state; add/edit validation is inline with associated error text. Move preserves focus, removal offers Undo. Reopening a completed task moves it to To do.
- Store sample: fixed fictional catalog, button filters, bounded quantities, GHS subtotal, empty cart state, disabled empty-order action, and an explicitly nontransactional order preview.
- Research sample: ordered workflow disclosures, schematic illustration, conceptual code, and clear absence of clinical inference or supplied model results.
- Feedback: a polite live status inside each interactive sample. Errors remain inline. No native alert/confirm/prompt.
- Motion: 150ms color/background changes and smooth anchor scrolling only; reduced motion removes transitions and smooth scrolling. No ambient animation.
- Content: plain, specific project claims grounded in the CV. Do not invent live originals or links to absent repositories.

## Do's and Don'ts
- Do keep demos clearly described as sample recreations.
- Do preserve working email, telephone, CV download, keyboard focus, and responsive access.
- Do preserve CV dates and distinguish the ongoing manager role from completed work.
- Don't add medical predictions, real checkout, invented metrics, or unverified credentials.
- Don't replace this palette with neon terminal styling or attach an invented photograph.
