# Portfolio

A full-stack personal portfolio website built with Next.js App Router, featuring a public-facing portfolio and a protected admin dashboard for managing content.

## Features

**Public Portfolio**
- Home page with profile header, about section, and blog posts
- About page with detailed professional info (skills, experience, education, certifications)
- Projects showcase with tech stacks, live links, and project flow screenshots
- Blog page
- GitHub activity calendar

**Admin Dashboard** (JWT protected)
- Statistics overview
- Full CRUD for: skills, interests, experience, education, projects, certificates
- Profile editor (name, bio, avatar, contact info, job title)
- Cloudinary image uploads

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MySQL via `mysql2/promise` |
| Auth | JWT + bcryptjs, HttpOnly cookies |
| Images | Cloudinary CDN |
| Icons | lucide-react, react-icons |
| Markdown | react-markdown |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── Layouts/MainLayout/       # Navbar wrapper
│   ├── components/               # Shared components
│   │   ├── navbar/
│   │   └── homePage/             # header, about, postList
│   ├── pages/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── projects/
│   │   └── login/
│   ├── admin/
│   │   ├── dashboard/
│   │   └── profile/
│   └── api/
│       ├── auth/                 # login, set-password
│       ├── admin/                # protected CRUD endpoints
│       ├── public/               # about, projects
│       └── profile/              # get, update
├── lib/
│   └── db.ts                     # MySQL connection pool
└── middleware.ts                 # JWT route protection
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- Cloudinary account

### Installation

```bash
git clone <repository-url>
cd port
npm install
```

### Environment Variables

Create a `.env.local` file at the root:

```env
# Database
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=your_database_name

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Database Setup

Import the SQL schema file to initialize your database:

```bash
mysql -u your_user -p your_database < u858890408_portfolio.sql
```

The schema includes tables for: `users`, `user_skills`, `user_interests`, `experience`, `education`, `certificates`, `projects`, `project_flows`, `roles`.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## API Endpoints

**Public**
- `GET /api/public/about` — profile and portfolio data
- `GET /api/public/projects` — projects with flow screenshots

**Auth**
- `POST /api/auth/login` — login with email + password
- `POST /api/auth/set-password` — set or update password

**Admin** (requires valid JWT cookie)
- `GET|POST /api/admin/skills` — manage skills
- `GET|POST /api/admin/interests` — manage interests
- `GET|POST /api/admin/experience` — manage experience entries
- `GET|POST /api/admin/certificates` — manage certificates
- `GET|POST /api/admin/projects` — manage projects
- `POST /api/admin/upload` — Cloudinary image upload
- `GET /api/profile` — get admin profile
- `POST /api/profile/update` — update profile info

## Authentication Flow

1. Submit email + password at `/pages/login`
2. Server validates credentials against the `users` table (bcrypt)
3. JWT token issued with 1-day expiration
4. Token stored in an HttpOnly, SameSite=Lax cookie
5. Middleware validates the token on all `/admin/*` routes
6. Invalid or missing token redirects to the login page

## Deployment

The recommended deployment target is [Vercel](https://vercel.com). Set all environment variables in the Vercel project settings before deploying.

```bash
npm run build
```

Make sure the following external image domains are allowed (already configured in `next.config.ts`):
- `res.cloudinary.com`
- `media.licdn.com`
- `tripjogja.co.id`
