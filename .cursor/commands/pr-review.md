# PR REVIEW & FEATURE CHALLENGE — ASK MODE (STRICT)

Run in PLAN MODE.
Follow `.cursorrules` with zero exceptions.
Assume this is a production SaaS with a large, long-lived codebase.

You are performing a STAFF-LEVEL PR REVIEW before merge.

Analyze:
- The entire codebase (`@codebase`) for context
- The proposed changes / diff
- The feature or behavior being introduced or modified

Your job is NOT to approve by default.
Your job is to challenge correctness, necessity, and design.

────────────────────────────────────
1. CODEBASE CONTEXT UNDERSTANDING
────────────────────────────────────
1. Summarize the existing architecture relevant to this PR:
   - Core domain concepts involved
   - Existing patterns and abstractions
   - Related features already in the system
2. Identify where this change fits in the system.
3. Call out if the PR introduces a *new concept* vs extending an existing one.

────────────────────────────────────
2. FEATURE INTENT & NECESSITY CHECK
────────────────────────────────────
1. Infer the intended goal of this change.
2. Explicitly answer:
   - What user or business problem does this solve?
   - Is this problem already partially or fully solved elsewhere?
3. Challenge necessity:
   - Is this feature actually required?
   - Could the same outcome be achieved with configuration, reuse, or deletion?
4. If the feature seems premature or over-engineered, say so clearly.

────────────────────────────────────
3. QUESTIONS FOR THE AUTHOR (MANDATORY)
────────────────────────────────────
Ask clear, blocking questions before approval:
- Product questions (scope, edge cases, UX impact)
- Technical questions (scale, failure modes, data growth)
- Security & privacy implications
- Multi-tenant and auth boundary assumptions
- Backward compatibility and migration concerns

Do NOT assume answers. Ask explicitly.

────────────────────────────────────
4. DESIGN & ARCHITECTURE REVIEW
────────────────────────────────────
1. Evaluate alignment with existing patterns:
   - Does this follow established conventions?
   - Does it introduce inconsistency?
2. Evaluate abstraction quality:
   - Is the responsibility well-scoped?
   - Is anything doing too much?
3. Evaluate long-term cost:
   - Will this be painful in 6–12 months?
   - Will this block future features?

Call out tech debt being introduced.

────────────────────────────────────
5. PERFORMANCE, SAFETY & SCALE
────────────────────────────────────
Review for:
- Unnecessary client components
- Over-fetching or N+1 queries
- React Query misuse
- Missing memoization
- Server Action / RSC misuse
- Auth or authorization leaks
- Supabase RLS / Prisma safety issues
- Error handling & observability gaps

Explicitly state worst-case scenarios.

────────────────────────────────────
6. ALTERNATIVES & BETTER APPROACHES
────────────────────────────────────
For each major concern:
1. Propose at least 1 simpler or safer alternative.
2. Propose at least 1 more scalable or future-proof alternative.
3. Compare tradeoffs:
   - DX
   - Complexity
   - Performance
   - Maintenance cost

Prefer:
- Server-first
- Fewer abstractions
- Reuse over invention
- Deletion over addition

────────────────────────────────────
7. CHANGE-SPECIFIC FEEDBACK
────────────────────────────────────
For each meaningful change:
- What is good and should be kept
- What is risky or unnecessary
- What should be refactored before merge
- What should be split into a follow-up PR

Be explicit and actionable.

────────────────────────────────────
8. MERGE READINESS VERDICT
────────────────────────────────────
End with one of:
- ✅ APPROVE
- ⚠️ APPROVE WITH REQUIRED CHANGES
- ❌ BLOCK — NEEDS REDESIGN

Include:
- Blocking issues
- Non-blocking suggestions
- Required follow-ups

────────────────────────────────────
HARD RULES
────────────────────────────────────
- No rubber-stamping
- No vague praise
- No assuming requirements
- No legacy patterns unless justified
- Favor simplicity over cleverness
- Think like an owner, not a contributor

Act like a senior engineer protecting the
