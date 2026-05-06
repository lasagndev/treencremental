# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server with HMR
npm run build      # type-check (tsc -b) then bundle (vite build)
npm run lint       # run ESLint
npm run preview    # preview production build locally
```

There is no test runner configured yet.

## Stack

- **React 19** + **TypeScript 6** + **Vite 8**
- **React Compiler** is enabled via `babel-plugin-react-compiler` + `@rolldown/plugin-babel`. This means manual `useMemo`/`useCallback` optimizations are unnecessary — the compiler handles them. It does slightly slow down dev/build.
- Entry point: `src/main.tsx` → `src/App.tsx`

## TypeScript

`tsconfig.app.json` enforces strict settings: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` (no `const enum` or parameter decorators that require emit). `verbatimModuleSyntax` is on — use `import type` for type-only imports.

## ESLint

Config in `eslint.config.js` uses `typescript-eslint` recommended, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. Currently not type-aware (no `parserOptions.project`). To enable type-aware rules, follow the README instructions.

## Vite server

`vite.config.ts` has an ngrok host (`makena-unconceited-malapertly.ngrok-free.dev`) in `server.allowedHosts` for remote tunneling.
