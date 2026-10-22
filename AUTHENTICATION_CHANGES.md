# Authentication changes (local, not deployed)

## Existing functionality reused

The existing AuthContext, Supabase client, session restoration, profiles.role authorization,
ProtectedRoute, logout, four dashboards, Admin creation forms, and create-portal-user account
linking/rollback remain in use. No second authentication system or production mock was added.
Admin and Principal continue using email and password through signInWithPassword.
Public pages, images, stylesheets and image data were not changed.
The only Admin Dashboard change removes its obsolete parent-account-linking sentence.
Student, Teacher and Principal dashboards are unchanged.

## Missing functionality implemented

- Removed Parent login card, supported frontend role, sidebar menu, child selector and routes.
  Unreferenced Parent components and all parent database tables/relationships remain intact.
  Teacher notices no longer import the Parent component.
- Student/Teacher login accepts a generated username and password. portal-login resolves exactly
  one profile server-side, retrieves the actual Auth account email via the Admin API and calls
  signInWithPassword. The frontend never downloads a directory to resolve a username.
- Existing account creation now returns a database-generated unique username and a cryptographically
  random temporary password, with the account linked to its profile and student/teacher record.
- Existing Admin rosters show usernames and offer Admin-only password reset. New credentials appear
  in the existing one-time dialog, held only in component memory until it closes.
- New/temporary passwords require a password change before portal data access. A protected change
  page reuses AuthContext; the backend verifies the current password, updates it through the official
  Auth API, then clears the first-login marker. New passwords require 12 characters, uppercase,
  lowercase, a number and a symbol.
- Visible authentication messages use school-friendly language. No privileged credentials enter
  the frontend and no plaintext password is written to application tables or logs.

## Files changed or added

Frontend:
- src/context/AuthContext.jsx
- src/context/PortalDataContext.jsx
- src/services/authService.js (new)
- src/services/portalService.js
- src/routes/AppRoutes.jsx
- src/components/portal/ProtectedRoute.jsx
- src/components/portal/PortalSidebar.jsx
- src/components/portal/PortalHeader.jsx
- src/components/portal/PortalLayout.jsx
- src/components/portal/SchoolCalendar.jsx
- src/components/portal/AccountCredentials.jsx
- src/pages/Portal/index.jsx
- src/pages/Portal/LoginPage.jsx
- src/pages/Portal/ChangePassword.jsx (new)
- src/pages/Portal/Admin/AdminStudents.jsx
- src/pages/Portal/Admin/AdminTeachers.jsx
- src/pages/Portal/Admin/AdminDashboard.jsx (obsolete Parent copy only)
- src/pages/Portal/Admin/AdminClasses.jsx (technical message only)
- src/pages/Portal/Principal/PrincipalNotices.jsx (Parent audience copy only)
- src/pages/Portal/Teacher/TeacherNotices.jsx

Backend and migration:
- supabase/functions/create-portal-user/index.ts
- supabase/functions/_shared/auth.ts (new)
- supabase/functions/portal-login/index.ts (new)
- supabase/functions/reset-portal-password/index.ts (new)
- supabase/functions/change-portal-password/index.ts (new)
- supabase/config.toml (new)
- supabase/migrations/20260927123625_portal_username_auth.sql (new)

Verification/documentation:
- tests/auth-handlers.test.cjs
- tests/auth-migration.test.cjs
- tests/auth-browser.py
- AUTHENTICATION_CHANGES.md

## Exactly what the SQL migration does

The migration is transactional and has NOT been applied to the school database.

1. Adds nullable profiles.username and profiles.password_change_token. A non-null token requires
   password change; it is not a password or password hash.
2. Adds a case-insensitive unique username index and private sequence. A trigger allocates
   MISSTU/MISTCH usernames automatically. Existing student/teacher accounts receive usernames;
   their current passwords remain unchanged and they are not forced to change solely by backfill.
3. Prevents browser roles from inserting profiles or changing id, role, email, username, is_active
   and the password-change marker. Existing non-security profile fields remain editable under
   their existing RLS policies. Privileged account operations remain server-side.
4. Adds a private, narrowly scoped readiness function. It checks the caller's current profile,
   supported role, active state and password-change marker. It uses SECURITY DEFINER solely to
   avoid recursion through the profiles policy; its search_path and execution grants are restricted.
5. Adds RESTRICTIVE policies that intersect existing ownership policies. Pending accounts may
   read their own profile to restore their session but cannot read/write portal data tables.
   Parent records are gated in the same way, without deleting or changing their relationships.
6. Adds a private password-operation lock table and two service-role-only SECURITY INVOKER RPCs.
   They serialize reset/change requests across server instances. This table stores only account
   IDs, operation IDs and start times, never passwords.
7. Aborts and rolls back everything when an expected table is absent or lacks enabled RLS and
   an existing permissive policy. This checks policy presence, NOT whether ownership policies
   are correct. It deliberately does not apply or endorse portal-security.review.sql.

The checked-in supabase_schema.sql does not meet this RLS preflight. Live policies could differ;
no live schema connection was available. Before a future rollout, run inspect-portal.sql and
review actual ownership policies, exposed views/RPCs and storage access against real relationships.
The new gates do not repair unrelated broad ownership policies or privileged RPC bypasses.
No schema replacement, Auth password-internal SQL, parent-data deletion or database deployment occurred.

If a server process terminates during a password operation, its durable lock deliberately remains
fail-closed. A database operator must verify the operation is no longer running, inspect that one
row in portal_private.password_operations, and remove only that stale lock before retrying an
Admin reset. Locks do not expire automatically, avoiding overlapping password writes.

## Authentication flow

Admin/Principal email + password -> existing signInWithPassword -> verified Auth identity ->
profiles.role -> existing dashboard.

Admin creation -> verified active Admin -> official Auth Admin createUser -> existing profile and
student/teacher linkage -> generated username + temporary password shown once.

Student/Teacher username + password -> portal-login server-side mapping -> signInWithPassword ->
existing client session -> own profile -> required password-change page when marked -> existing dashboard.

Admin reset -> verified active Admin -> target limited to Student/Teacher -> operation lock -> mark
password change required -> official Admin updateUserById -> show only NEW credentials once.

First-login change -> verified identity + current-password reauthentication -> operation lock ->
official user updateUser -> compare-and-clear marker -> existing session restoration/dashboard.

The functions use server environment SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.
Only the public URL/key are used by Vite. No values are included in this document.
verify_jwt=false permits the public login endpoint and current key formats; create/reset/change
independently validate bearer tokens with getUser and enforce database-backed authorization.

## Verification results

- npm run build passed (existing advisory about a chunk larger than 500 kB).
- Deno type-check passed for all four Edge Functions.
- 10 handler/migration tests passed. Handler tests use isolated SDK fixtures; SQL tests execute the
  migration in PGlite PostgreSQL, testing rollback on missing RLS, field protection, pending-session
  access, readiness after change, RPC permissions and serialized operations.
- Browser integration checks passed for Admin, Principal, Student and Teacher: login/dashboard,
  refresh/session restoration, logout, route guards, forced change, Admin create/reset forms,
  one-time credential display, removal of Parent routes/cards, and school-friendly login UI.
  Browser responses were intercepted test fixtures; these are NOT live authentication/RLS tests.
- Vite detects both required public environment variables. No privileged key was found in those
  public environment variables. URL/key values were never printed.
- Integrity comparison of 145 protected source/assets found only the intentional one-sentence
  Parent copy removal in AdminDashboard; public content/images and the other dashboards match.

Run focused tests with:

```powershell
npm install --prefix "$env:TEMP/mis-auth-db-test" --no-audit --no-fund @electric-sql/pglite@0.3.14
node --test tests/auth-handlers.test.cjs tests/auth-migration.test.cjs
npx --yes deno@2.5.6 check supabase/functions/create-portal-user/index.ts supabase/functions/portal-login/index.ts supabase/functions/reset-portal-password/index.ts supabase/functions/change-portal-password/index.ts
npm run dev -- --host 127.0.0.1 --port 5182 --strictPort
# In another terminal (Python Playwright and Chromium required):
python tests/auth-browser.py
npm run build
```

## Remaining activation and live verification

No commit, push or deployment was performed. The new backend/migration must be reviewed and
installed together before the new username/reset flows can work against the live project.
Live RLS review and actual-account acceptance tests remain unverified. Existing Admin/Principal
login includes a legacy profile-column fallback before migration; the new roster queries and
Student/Teacher flows require the migration. Do not publish the frontend alone.
