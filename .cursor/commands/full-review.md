# FULL CODEBASE REVIEW & MODERNIZATION (STRICT)

Follow `.cursorrules` with zero exceptions. Enforce industry standards, SOLID, DRY, accessibility, and production-grade SaaS practices.

Analyze the entire repository (`@codebase`) end-to-end using the following stack assumptions and enforcement rules:

# STACK (enforce or recommend migration if violated):
- Next.js App Router (RSC first, Server Actions preferred)
- React 19
- TypeScript (strict mode, no `any`)
- tRPC v11+
- @tanstack/react-query v5.59+
- Supabase v2.45+ and/or Prisma
- TailwindCSS + shadcn/ui (latest)
- Zod for validation
- Vitest for testing

────────────────────────────────────
# 1. DEPENDENCIES & TOOLING AUDIT
────────────────────────────────────
1. List all `dependencies` and `devDependencies` from `package.json` with exact versions.
2. Flag anything that is:
   - Outdated
   - Deprecated
   - Unmaintained
   - Redundant or overlapping
3. Recommend latest stable versions, including but not limited to:
   - next ^15.x
   - react / react-dom ^19
   - @tanstack/react-query ^5.59+
   - @trpc/* ^11.x
   - supabase-js ^2.45+
   - tailwindcss latest
   - shadcn/ui latest
   - zod latest
   - typescript ^5.5+
4. Identify unused packages, poor tree-shaking, and bundle bloat.
5. Recommend removals, consolidations, or tooling upgrades (ESLint, Prettier, TSConfig, Turbo).

────────────────────────────────────
# 2. ARCHITECTURE & FEATURE MAPPING
────────────────────────────────────
1. Identify core features:
   - Authentication & authorization
   - Database access & data modeling
   - API layer (tRPC / REST)
   - UI/component system
   - State management & caching
   - Background jobs / cron (if any)
2. Map each feature to exact files, routes, and folders.
3. Identify tight coupling, leaky abstractions, or scaling risks.
4. Evaluate SaaS readiness:
   - Multi-tenancy safety
   - Auth boundary enforcement
   - Environment separation
   - Observability readiness

────────────────────────────────────
# 3. CODE QUALITY, SAFETY & PERFORMANCE
────────────────────────────────────
1. DRY & SOLID
   - Identify duplicated logic (hooks, utils, API calls).
   - Recommend shared abstractions.
   - Enforce single-responsibility components.
2. Performance
   - Unnecessary client components
   - Missing memoization
   - Inefficient React Query usage
   - Overfetching / waterfalls
   - RSC misuse
3. Security
   - Auth/session leaks
   - Missing server-side authorization
   - Unsafe client access to secrets
   - Supabase RLS gaps
   - Input validation issues
4. Type Safety
   - Flag `any`, unsafe casts, weak inference
   - Missing or incorrect Zod schemas
5. Error Handling & UX
   - Missing error boundaries
   - Unhandled async errors
   - Poor loading / empty states
6. Testing
   - Coverage gaps
   - Untestable architecture
   - Recommend Vitest + Testing Library

────────────────────────────────────
# 4. MODERNIZATION & ALTERNATIVES
────────────────────────────────────
For EVERY issue found:
1. Provide a primary, best-practice fix aligned with latest Next.js & React.
2. Provide 2–3 viable alternatives (e.g., Server Actions vs tRPC).
3. Include clear pros & cons:
   - Performance
   - DX
   - Scalability
   - Maintenance cost
4. Suggest future-facing upgrades:
   - React Compiler readiness
   - Partial Prerendering (PPR)
   - Streaming / Edge opportunities
   - Monorepo or Turbo (if relevant)

────────────────────────────────────
# 5. REQUIRED OUTPUT FORMAT
────────────────────────────────────
- Clear issue title
- Severity (Critical / Major / Minor)
- Impact explanation
- Concrete FIXES with REAL CODE DIFFS (before → after)
- File paths included
- No pseudocode
- No vague advice

End with:
- Overall codebase health score
- Top 5 highest-ROI fixes
- Upgrade priority roadmap

HARD RULES:
- No Pages Router
- No legacy patterns unless justified
- No `any`
- No skipping diffs
- Prefer server-first, type-safe, composable solutions

Act as a staff-level engineer reviewing a production SaaS before scale.
Be strict, opinionated, and explicit.
