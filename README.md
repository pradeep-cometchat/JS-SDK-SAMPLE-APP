# CometChat Storybook Component Library

This branch contains the Storybook component library for the CometChat sample
app. It showcases the UI kit (base elements, mobile surfaces, web surfaces, and
app screens) in isolation, with live controls and auto-generated docs.

## Run locally

```bash
npm ci
npm run storybook
```

Storybook starts on http://localhost:6006.

## Build

```bash
npm run build-storybook
```

Outputs a static site to `storybook-static/`. GitHub Pages deployment is
handled by `.github/workflows/deploy.yml`, which builds this branch and serves
it under `/storybook/` alongside the sample app built from `main`.

## Layout

- `.storybook/` — Storybook config (framework, addons, global decorators)
- `src/ui-kit/` — story files
  - `base-elements/` — Avatar, Button, Icons, Input, etc.
  - `mobile/` — mobile component stories
  - `web/` — web component stories
  - `app-screens/` — full-screen compositions (AppShell, LoginScreen)
  - `_helpers.jsx` — shared fixtures and layout wrappers
  - `Overview.mdx` — library landing page
- `src/components/` — the components the stories render
- `src/App.jsx`, `src/data.js` — shared app state, error boundary, and sample
  data consumed by stories

The standalone sample app entry points (`index.html`, `src/main.jsx`) live on
the `main` branch.
