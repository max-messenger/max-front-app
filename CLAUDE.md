# CLAUDE.md

Agent guidance for this repository. See `README.md` for the project overview, architecture, API and UI usage, and examples.

## Use The Relevant Skill

| Change                              | Skill              |
|-------------------------------------|--------------------|
| Generating new entities and pages   | `max-front-app-generate` |
| Writing tests (Vitest)              | `max-front-app-test`     |

## Non-Negotiable Invariants

- **Follow FSD layering.** Layers, top-down: `app` → `pages` → `widgets` → `features` → `entities` → `shared`.
  A layer may import only from layers below it. `entities` must not import from
  `features`/`widgets`/`pages`. `shared` is the lowest layer and depends on nothing
  inside `src/` except other `shared` modules.
- **Respect the public API of each module.** Import from a module's barrel
  (`@/entities/dog`, `@/shared/api`), not from its internal paths
  (`@/entities/dog/model/queries`). Deep imports break encapsulation and the FSD contract.
- **Generate, don't handcraft entities/pages.** Create new entities and pages via the
  CLI — `npx @maxhub/create-max-front-app generate entity/page <Name>` (see the `max-front-app-generate`
  [skill](./.agents/skills/max-front-app-generate/SKILL.md) ). Never scaffold FSD files by hand. After generation, edit the type, mocks, and
  UI to fit the real entity.
- **Route all HTTP through `apiRequest` from `@/shared/api`.** Entities wrap calls in a
  `repository` and expose React Query hooks (`useXsQuery`, `useXQuery`) with keys from
  `query-keys.ts`. Components consume hooks, never the raw API layer.
- **Keep mocks registered.** Entity mocks are registered in `src/app/mock-setup.ts`
  via `registerXMocks()` against the mock-registry. Run dev with mocks through
  `npm run dev-mock` (`VITE_MOCK=true`). Never let mock wiring drift out of sync with
  generated entities.
- **Use the design system, not raw HTML.** Build UI on `@maxhub/max-ui` and the shared
  wrappers in `src/shared/ui` (`FlexBox`, `Page`, `Modal`, `Toast`). Co-locate component
  styles as CSS Modules (`.module.scss`) next to the component.
- **Keep imports sorted and semicolon-free.** ESLint enforces `simple-import-sort`
  (imports/exports) and `@stylistic` (`semi: never`, 2-space indent, curly spacing).
  Use the `@/*` alias (→ `src/*`) for anything under `src/`; keep relative imports for
  files within the same module. Run `npm run lint:fix` before committing.
- **Keep it type-checked.** `npm run typecheck` (`tsc -b --noEmit`) must pass. No `any`
  for entity/API shapes — define types in `model/types.ts` and `api/types.ts`. Treat
  API responses as untrusted; type them explicitly rather than casting through.
