# Portfolio

A full-stack personal portfolio website built with Next.js 15 App Router, MySQL, and JWT authentication. Features a public portfolio (projects with flow breakdowns, blog, about, language lab) and a protected admin dashboard for managing content — including drag-to-reorder for projects and flows, image uploads via Cloudinary, and a zoomable image viewer.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Home page
│   ├── layout.tsx                      # Root layout + metadata
│   ├── globals.css
│   ├── icon.svg                        # Favicon (AW monogram)
│   ├── Layouts/MainLayout/             # Navbar wrapper
│   ├── components/
│   │   ├── navbar/                     # Top navigation
│   │   ├── homePage/                   # header, about, postList
│   │   └── languageLab/               # Language lab UI
│   ├── pages/
│   │   ├── about/                      # Public about page
│   │   ├── blog/                       # Public blog page
│   │   ├── language/                   # Public language lab
│   │   ├── login/                      # Login page
│   │   └── projects/
│   │       ├── [id]/
│   │       │   ├── page.tsx            # Project detail
│   │       │   └── ZoomableImage.tsx   # Click-to-zoom image viewer
│   │       ├── components/             # Project list + card
│   │       ├── services/
│   │       └── types/
│   ├── admin/
│   │   ├── dashboard/                  # Admin home + stats
│   │   ├── language/                   # Language lab admin
│   │   └── profile/                    # Full content management
│   └── api/
│       ├── auth/                       # login, set-password
│       ├── profile/                    # get, update
│       ├── public/                     # about, projects, language
│       └── admin/                      # protected CRUD + reorder
│           ├── skills/                 # CRUD + reorder
│           ├── interests/              # CRUD + reorder
│           ├── projects/               # CRUD + reorder
│           ├── project-flows/          # CRUD + reorder
│           ├── experience/
│           ├── certificates/
│           ├── roles/
│           ├── language/
│           └── upload/                 # Cloudinary upload
├── lib/
│   ├── db.ts                           # MySQL connection pool
│   ├── projects.ts                     # Project + flow queries
│   ├── language.ts
│   ├── admin-auth.ts
│   └── tgl.ts                          # Date formatter
└── middleware.ts                       # JWT route protection
```
## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MySQL via `mysql2/promise` |
| Auth | JWT + bcryptjs, HttpOnly cookies |
| Images | Cloudinary CDN |
| Icons | lucide-react, react-icons |
| Markdown | react-markdown |
| Drag & Drop | Native HTML5 Drag API |

## Features

**Public Portfolio**
- Home page with profile header, about section, and blog posts
- About page with skills, experience, education, and certifications
- Projects showcase with tech stacks, live links, and per-project flow breakdowns
- Zoomable image viewer on project detail (scroll to zoom, drag to pan)
- Blog page
- Language lab (EN/ID learning dictionary)
- GitHub activity calendar

**Admin Dashboard** (JWT protected)
- Statistics overview (skills, interests, experiences, certificates)
- Full CRUD for: skills, interests, experience, roles, education, projects, project flows, certificates
- Drag-to-reorder for projects, flows, skills, and interests (persisted to DB)
- Profile editor (name, bio, avatar, contact info, job title)
- Cloudinary image uploads
- Private language lab management (EN/ID dictionary)

## Flow

### User Home `/`

![Home](./public/ss/home.png)

```
User visits /
      |
      ▼
  Render ProfileHeader  (static — name hardcoded)
      |
      ▼
  AboutSection — GET /api/public/about
      |
      ├─→ Error / no data       → fields stay empty
      |
      └─→ 200 { job_title, bio, ... }
              |
              ▼
          Render job_title + bio
              |
              ▼
          Button "More about me →" → /pages/about
      |
      ▼
  PostList — GET https://api.github.com/users/AnggaWikaNugraha/events/public?per_page=10
      |
      ├─→ Error / empty         → "No recent activity"
      |
      └─→ 200 events[]  (max 6)
              |
              ▼
          GitHub Contribution Calendar  (react-github-calendar)
              |
              ▼
          Recent Activity list  (event type, repo name, time ago)
```

### Projects `/pages/projects`

![Projects](./public/ss/projects.png)

```
User visits /pages/projects
      |
      ▼
GET /api/public/projects
      |
      ├─→ Error                 → 500 { error: message }
      |
      └─→ 200
              |
              ▼
          SELECT projects WHERE user_id=1 AND is_private=0
          ORDER BY sort_order ASC, created_at DESC
              |
              └─→ per project: SELECT project_flows WHERE project_id=?
                               ORDER BY sort_order ASC
              |
              ▼
          Response Project[] (each with flows[])
              |
              ▼
          Render Project List (card per project)
              ├─ Cover image, title, role · company · year
              ├─ Description (collapsible if long)
              ├─ Tech stack pills
              └─ Links: Demo · Source · Detail
```

### Project Detail `/pages/projects/[id]`

![Project Detail](./public/ss/projects%20details.png)

```
User visits /pages/projects/[id]
      |
      ▼
getPublicProjectById(id)  ← server-side (lib/projects.ts)
      |
      ├─→ SELECT projects WHERE id=? AND is_private=0
      |         |
      |         └─→ Not found  → notFound()  (404 page)
      |
      └─→ Found
              |
              ▼
          SELECT project_flows WHERE project_id=?
          ORDER BY sort_order ASC
              |
              ▼
          Render Project Detail
              ├─ Cover image  (ZoomableImage)
              │     └─→ Click → lightbox overlay
              │             ├─ Scroll   → zoom in / out
              │             ├─ Drag     → pan
              │             └─ Esc / click outside → close
              ├─ Tech stack pills
              └─ Flows[]  (ordered by sort_order)
                    ├─ Flow image  (ZoomableImage)
                    └─ Flow description  (markdown)
```

### About `/pages/about`

![About](./public/ss/about.png)

```
User visits /pages/about
      |
      ▼
GET /api/public/about
      |
      ├─→ No user found         → 404 { error: "No user found" }
      ├─→ Error                 → 500 { error: message }
      |
      └─→ 200
              |
              ▼  (parallel DB queries)
              ├─ SELECT users LIMIT 1
              ├─ SELECT user_skills       ORDER BY sort_order ASC
              ├─ SELECT user_interests    ORDER BY sort_order ASC
              ├─ SELECT experience        ORDER BY created_at ASC
              │     └─ SELECT roles WHERE experience_id  ORDER BY start_date DESC
              └─ SELECT certificates      ORDER BY issue_date DESC
              |
              ▼
          Response { name, bio, avatar_url, job_title, email, phone,
                     location, website, skills[], interests[],
                     experience[{ company, roles[] }], certificates[] }
              |
              ▼
          Render About Page
              ├─ AvatarSection    (avatar, name, job_title)
              ├─ InfoSection      (email, phone, location, website)
              ├─ ExperienceSection (company, logo, roles)
              ├─ EducationSection  (currently empty)
              ├─ SkillsSection    (skills[], interests[])
              └─ CertificatesSection (certificates[])
```

### Language `/pages/language`

![Language](./public/ss/language.png)

```
User visits /pages/language
      |
      ▼
GET /api/public/language  (read-only, no auth)
      |
      ├─→ Error                 → 500 { error: message }
      |
      └─→ 200
              |
              ▼
          ensureLanguageEntriesTable()  ← CREATE TABLE IF NOT EXISTS
              |
              ▼
          SELECT language_entries WHERE user_id=1
          ORDER BY updated_at DESC, created_at DESC
              |
              ▼
          Response {
            entries[],          ← meanings & tags parsed from JSON
            availableTags[],    ← unique tags, sorted A-Z
            stats: { entries, meanings, tags }
          }
              |
              ▼
          Render LanguageLab (mode="public")
              ├─ Stats cards  (total entries, meanings, tags)
              ├─ Search bar   (filter by sourceText, meanings, tags)
              ├─ Tag filter   (filter by availableTags)
              └─ Entry list   (sourceText, meanings[], example, notes)
                    ⚠ mode="public" → form tambah/edit/hapus tidak ditampilkan
```

### Admin Language

```
Admin visits language admin page
      |
      ▼
middleware.ts — verify JWT cookie
      |
      ├─→ Invalid / no token    → redirect login page
      |
      └─→ Valid
              |
              ▼
GET /api/admin/language
      |
      ▼
ensureLanguageEntriesTable()  ← CREATE TABLE IF NOT EXISTS
      |
      ▼
SELECT language_entries WHERE user_id=1
ORDER BY updated_at DESC, created_at DESC
      |
      ▼
Response {
  entries[],       ← meanings & tags parsed from JSON
  availableTags[], ← unique tags, sorted A-Z
  stats: { entries, meanings, tags }
}
      |
      ▼
Render LanguageLab (mode="admin")
    ├─ Stats cards  (entries, meanings, tags)
    ├─ Search bar   (filter by sourceText, meanings, tags, example, notes)
    ├─ Direction filter  (All / EN→ID / ID→EN)
    ├─ Tag filter   (filter by availableTags)
    ├─ [+ Tambah] button → open create form
    └─ Entry list grouped A-Z  (click card → edit modal)

── Create Entry ──────────────────────────────────────────
  [Simpan]
  POST /api/admin/language/create
  { sourceText, sourceLang, targetLang, meanings[],
    exampleSource?, exampleTarget?, notes?, tags[] }
      └─→ { success: true, id }
              └─→ refresh GET /api/admin/language

── Edit Entry  (modal) ───────────────────────────────────
  [Save]
  POST /api/admin/language/update
  { id, sourceText, sourceLang, targetLang, meanings[],
    exampleSource?, exampleTarget?, notes?, tags[] }
      └─→ { success: true }
              └─→ refresh GET /api/admin/language

── Delete Entry (modal) ──────────────────────────────────
  [Delete]
  POST /api/admin/language/delete  { id }
      └─→ { success: true }
              └─→ refresh GET /api/admin/language
```

### Admin Dashboard

```
Admin visits dashboard
      |
      ▼
middleware.ts — verify JWT cookie (token)
      |
      ├─→ No cookie / invalid   → redirect login page
      |
      └─→ Valid JWT
              |
              ▼
          GET /api/admin/skills
          GET /api/admin/interests
          GET /api/admin/experience
          GET /api/admin/certificates
              |   (parallel fetch, client-side useEffect)
              ▼
          Response
              ├─ skills[]        → count
              ├─ interests[]     → count
              ├─ experience[]    → count
              └─ certificates[]  → count
              |
              ▼
          Render Stats Cards
              ├─ Skills count
              ├─ Interests count
              ├─ Experience count
              └─ Certificates count
```

### Admin Profile

```
Admin visits profile page
      |
      ▼
middleware.ts — verify JWT cookie
      |
      ├─→ Invalid / no token    → redirect login page
      |
      └─→ Valid
              |
              ▼  (parallel fetch on mount)
              ├─ GET /api/profile
              ├─ GET /api/admin/skills
              ├─ GET /api/admin/interests
              ├─ GET /api/admin/experience
              ├─ GET /api/admin/certificates
              └─ GET /api/admin/projects
              |
              ▼
          Render tabs: Profile · Skills · Interests · Experience · Certificates · Projects

── Tab: Profile ──────────────────────────────────────────
  Edit fields (name, bio, avatar_url, job_title, …)
      |
      ▼  [Save]
  POST /api/profile/update  { name, bio, avatar_url, … }
      └─→ { success: true }

── Tab: Skills ───────────────────────────────────────────
  [Add]   POST /api/admin/skills/create   { skill }
              └─→ refresh GET /api/admin/skills
  [Delete] POST /api/admin/skills/delete  { id }
              └─→ refresh GET /api/admin/skills
  [Drag]  POST /api/admin/skills/reorder  { ids[] }
              └─→ { success: true }

── Tab: Interests ────────────────────────────────────────
  [Add]   POST /api/admin/interests/create   { interest }
              └─→ refresh GET /api/admin/interests
  [Delete] POST /api/admin/interests/delete  { id }
              └─→ refresh GET /api/admin/interests
  [Drag]  POST /api/admin/interests/reorder  { ids[] }
              └─→ { success: true }

── Tab: Experience ───────────────────────────────────────
  [Add]   POST /api/admin/experience/create  { company, companyLogoUrl, location }
              └─→ refresh GET /api/admin/experience
  [Save]  POST /api/admin/experience/update  { id, company, … }
              └─→ { success: true }
  [Delete] POST /api/admin/experience/delete { id }
              └─→ refresh GET /api/admin/experience
  [Add Role]    POST /api/admin/roles/create  { experienceId, title, … }
  [Save Role]   POST /api/admin/roles/update  { id, title, … }
  [Delete Role] POST /api/admin/roles/delete  { id }

── Tab: Certificates ─────────────────────────────────────
  [Add]   POST /api/admin/certificates/create  { title, issuer, issue_date, … }
              └─→ refresh GET /api/admin/certificates
  [Save]  POST /api/admin/certificates/update  { id, title, … }
              └─→ { success: true }
  [Delete] POST /api/admin/certificates/delete { id }
              └─→ refresh GET /api/admin/certificates

── Tab: Projects ─────────────────────────────────────────
  [Add]   POST /api/admin/projects/create  { title, techStack[], … }
              └─→ { success: true, id }  → refresh GET /api/admin/projects
  [Save]  POST /api/admin/projects/update  { id, title, … }
              └─→ { success: true }
  [Delete] POST /api/admin/projects/delete { id }
              └─→ refresh GET /api/admin/projects
  [Drag project] POST /api/admin/projects/reorder  { ids[] }
              └─→ { success: true }  → sort_order updated in DB

  Per project — Flow actions:
  [Add Flow]    POST /api/admin/project-flows/create  { projectId, title, imageUrl, description }
  [Save Flow]   POST /api/admin/project-flows/update  { id, title, imageUrl, description }
  [Delete Flow] POST /api/admin/project-flows/delete  { id }
  [Drag flow]   POST /api/admin/project-flows/reorder { ids[] }
              └─→ sort_order persisted; public detail page reflects new order

  Image upload (cover / flow):
  POST /api/admin/upload  multipart/form-data { file }
      └─→ { url }  (Cloudinary CDN URL)
```

### Blog `/pages/blog`

```
User visits /pages/blog
      |
      ▼
  getBlogFeed()  ← hardcoded static data (no API call)
      |
      ▼
  setTimeout 1000ms  (simulated loading)
      |
      ├─→ posts set to []   → "No posts available."
      |
      └─→ (future) posts[]  → Render BlogCard list
```

## API Endpoints

### Auth

**POST `/api/auth/login`**
```json
// Request
{ "email": "string", "password": "string" }
// Response 200 — sets HttpOnly token cookie
{ "success": true }
// Errors: 404 User not found · 401 Wrong password · 400 No password set
```

**POST `/api/auth/set-password`**
```json
// Request
{ "email": "string", "password": "string" }
// Response
{ "success": true, "message": "Password updated" }
```

---

### Profile (requires JWT cookie)

**GET `/api/profile`**
```json
// Response
{
  "id": "string", "name": "string", "username": "string",
  "bio": "string", "email": "string", "phone": "string",
  "location": "string", "avatar_url": "string",
  "job_title": "string", "company": "string", "website": "string"
}
```

**POST `/api/profile/update`**
```json
// Request — all fields optional
{
  "name": "string", "username": "string", "bio": "string",
  "email": "string", "phone": "string", "location": "string",
  "avatar_url": "string", "job_title": "string",
  "company": "string", "website": "string"
}
// Response
{ "success": true }
```

---

### Public

**GET `/api/public/about`**
```json
// Response
{
  "id": "string", "name": "string", "bio": "string",
  "avatar_url": "string", "job_title": "string",
  "skills": ["string"],
  "interests": ["string"],
  "experience": [{
    "id": "string", "company": "string", "companyLogoUrl": "string", "location": "string",
    "roles": [{
      "id": "string", "title": "string", "employmentType": "string",
      "startDate": "date", "endDate": "date | null", "description": "string"
    }]
  }],
  "certificates": [{
    "id": "string", "title": "string", "issuer": "string",
    "issueDate": "date", "expirationDate": "date", "credentialUrl": "string"
  }]
}
```

**GET `/api/public/projects`**
```json
// Response
[{
  "id": "string", "title": "string", "description": "string",
  "role": "string", "company": "string", "techStack": ["string"],
  "year": "number", "status": "completed | in-progress | archived",
  "featured": "boolean", "demoUrl": "string", "repoUrl": "string",
  "coverImage": "string",
  "flows": [{
    "id": "string", "title": "string", "description": "string",
    "imageUrl": "string", "sortOrder": "number"
  }]
}]
```

**GET `/api/public/language`**
```json
// Response — language lab entries (public read-only)
[{ "id": "string", "sourceText": "string", "sourceLang": "string",
   "targetLang": "string", "meanings": ["string"], "tags": ["string"] }]
```

---

### Admin — Skills (requires JWT cookie)

**GET `/api/admin/skills`**
```json
// Response
[{ "id": "string", "skill": "string" }]
```

**POST `/api/admin/skills/create`**
```json
// Request
{ "skill": "string" }
// Response
{ "success": true }
```

**POST `/api/admin/skills/delete`**
```json
// Request
{ "id": "string" }
// Response
{ "success": true }
```

**POST `/api/admin/skills/reorder`**
```json
// Request — ordered array of all skill IDs
{ "ids": ["string"] }
// Response
{ "success": true }
```

---

### Admin — Interests (requires JWT cookie)

**GET `/api/admin/interests`**
```json
[{ "id": "string", "interest": "string" }]
```

**POST `/api/admin/interests/create`** · `{ "interest": "string" }`

**POST `/api/admin/interests/delete`** · `{ "id": "string" }`

**POST `/api/admin/interests/reorder`** · `{ "ids": ["string"] }`

All respond `{ "success": true }`.

---

### Admin — Projects (requires JWT cookie)

**GET `/api/admin/projects`**
```json
// Response — same shape as public/projects including flows
[{ "id": "string", "title": "string", "sortOrder": "number", "isPrivate": "boolean", "flows": [] }]
```

**POST `/api/admin/projects/create`**
```json
// Request
{
  "title": "string",
  "description": "string?", "role": "string?", "company": "string?",
  "techStack": ["string"], "year": "number?",
  "status": "completed | in-progress | archived",
  "featured": "boolean", "isPrivate": "boolean",
  "demoUrl": "string?", "repoUrl": "string?", "coverImage": "string?"
}
// Response
{ "success": true, "id": "string" }
```

**POST `/api/admin/projects/update`** — same fields as create + `"id": "string"` → `{ "success": true }`

**POST `/api/admin/projects/delete`** · `{ "id": "string" }` → `{ "success": true }`

**POST `/api/admin/projects/reorder`** · `{ "ids": ["string"] }` → `{ "success": true }`

---

### Admin — Project Flows (requires JWT cookie)

**POST `/api/admin/project-flows/create`**
```json
// Request
{ "projectId": "string", "title": "string?", "description": "string?", "imageUrl": "string?" }
// Response
{ "success": true, "id": "string" }
```

**POST `/api/admin/project-flows/update`**
```json
{ "id": "string", "title": "string?", "description": "string?", "imageUrl": "string?" }
// Response
{ "success": true }
```

**POST `/api/admin/project-flows/delete`** · `{ "id": "string" }` → `{ "success": true }`

**POST `/api/admin/project-flows/reorder`** · `{ "ids": ["string"] }` → `{ "success": true }`

---

### Admin — Experience (requires JWT cookie)

**GET `/api/admin/experience`**
```json
[{
  "id": "string", "company": "string", "companyLogoUrl": "string", "location": "string",
  "roles": [{
    "id": "string", "title": "string", "employmentType": "string",
    "startDate": "date", "endDate": "date | null", "description": "string"
  }]
}]
```

**POST `/api/admin/experience/create`** · `{ "company": "string", "companyLogoUrl": "string", "location": "string" }` → `{ "success": true }`

**POST `/api/admin/experience/update`** · `{ "id": "string", "company": "string", "companyLogoUrl": "string", "location": "string" }` → `{ "success": true }`

**POST `/api/admin/experience/delete`** · `{ "id": "string" }` → `{ "success": true }`

---

### Admin — Roles (requires JWT cookie)

**POST `/api/admin/roles/create`**
```json
{
  "experienceId": "string", "title": "string", "employmentType": "string",
  "startDate": "date", "endDate": "date?", "description": "string?"
}
// Response
{ "success": true, "id": "string" }
```

**POST `/api/admin/roles/update`** · same fields + `"id"` → `{ "success": true }`

**POST `/api/admin/roles/delete`** · `{ "id": "string" }` → `{ "success": true }`

---

### Admin — Certificates (requires JWT cookie)

**GET `/api/admin/certificates`**
```json
[{ "id": "string", "title": "string", "issuer": "string",
   "issue_date": "date", "expiration_date": "date", "credential_url": "string" }]
```

**POST `/api/admin/certificates/create`** · `{ "title", "issuer", "issue_date", "expiration_date", "credential_url" }` → `{ "success": true }`

**POST `/api/admin/certificates/update`** · same + `"id"` → `{ "success": true }`

**POST `/api/admin/certificates/delete`** · `{ "id": "string" }` → `{ "success": true }`

---

### Admin — Language (requires JWT cookie)

**GET `/api/admin/language`** → full language payload

**POST `/api/admin/language/create`**
```json
{
  "sourceText": "string", "sourceLang": "string", "targetLang": "string",
  "meanings": ["string"], "exampleSource": "string?", "exampleTarget": "string?",
  "notes": "string?", "tags": ["string"]
}
// Response
{ "success": true, "id": "string" }
```

**POST `/api/admin/language/update`** · same + `"id"` → `{ "success": true }`

**POST `/api/admin/language/delete`** · `{ "id": "string" }` → `{ "success": true }`

---

### Admin — Upload (requires JWT cookie)

**POST `/api/admin/upload`**
```
// Request: multipart/form-data
file: File (image)
// Response
{ "url": "string" }  // Cloudinary CDN URL
// Error: { "error": "No file provided" } 400
```
