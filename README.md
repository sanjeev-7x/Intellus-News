# Intellus News India (React + Vite + Tailwind + Supabase)

Modern, high-performance investigative news platform for India with real-time Supabase authentication and database integration.

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase Credentials:**
   Copy `.env.example` to `.env` (or edit the existing `.env`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   > **Note:** If `.env` is not configured yet, the app runs in **Demo Mode** with mock storage and instant one-click login buttons, ensuring all pages and layouts stay intact without crashing!

3. **Set up Supabase Database Schema:**
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Open **SQL Editor** -> Click **New query**
   - Copy and paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql)
   - Click **Run**
   - This sets up:
     - `profiles`: User accounts, newsroom roles (`CONTRIBUTOR`, `EDITOR`), contributor IDs, and automatic signup triggers.
     - `categories`: News verticals (Crime, Law, Tech, India, World).
     - `articles`: Articles with summaries, content, hero images, views, trending/featured flags, and RLS security.
     - `reports`: Citizen news leads and whistleblower submissions.
     - Seed data: Pre-loaded initial articles and categories matching the live newsroom feed.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔐 Authentication Features

- **Supabase Auth Client:** Initialized in [`src/lib/supabase.js`](src/lib/supabase.js).
- **Auth Provider & Hook:** [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx) exposes:
  - `user`: Active user object with `name`, `email`, `role`, and `contributorId`.
  - `session`: Supabase session token.
  - `signIn(email, password)`: Email/password authentication.
  - `signUp(email, password, { name, role })`: Account creation with automatic profile creation.
  - `signOut()`: Logs out and clears state.
  - `isConfigured`: Indicates whether Supabase keys are provided.
- **Dedicated Auth Page:** [`/auth/login`](src/pages/AuthPage.jsx) featuring Sign In, Sign Up, role selection, status indicator, and instant one-click Demo logins.

---

## 🗄️ Database & Workspaces

- **News Articles (`/`, `/category/:slug`, `/article/:slug`):**
  Fetched from Supabase table `articles` with automatic fallback to [`src/data/articles.js`](src/data/articles.js).
- **Citizen Report Portal (`/submit-report`):**
  Allows citizens and contributors to submit investigative leads directly into the Supabase `reports` table.
- **Editorial Dashboard (`/dashboard/editorial`):**
  Allows editors to review incoming leads, audit published stories, and publish new articles directly to the database.
- **Contributor Dashboard (`/dashboard/contributor`):**
  Shows contributor credentials, ID, tier, and submitted story leads.
- **Search (`/search`):**
  Real-time search across headlines, content, and categories.

---

## 📁 Project Structure

```
├── .env.example              # Template for Supabase credentials
├── .env                      # Local environment configuration
├── supabase/
│   └── schema.sql            # Complete Supabase SQL schema & seed data
├── src/
│   ├── lib/
│   │   └── supabase.js       # Safe Supabase client initialization
│   ├── context/
│   │   └── AuthContext.jsx   # Supabase Auth provider & state
│   ├── data/
│   │   └── articles.js       # Supabase database queries & fallbacks
│   ├── components/
│   │   ├── Header.jsx        # Navigation, auth profile menu, theme toggle
│   │   ├── Footer.jsx        # Footer with newsletter & links
│   │   └── HomeView.jsx      # Homepage hero, ticker, & trending stories
│   ├── pages/
│   │   ├── AuthPage.jsx      # Sign In / Sign Up with Supabase
│   │   ├── EditorialDashboard.jsx   # Editorial review & publishing
│   │   ├── ContributorDashboard.jsx # Contributor stats & leads
│   │   ├── SubmitReportPage.jsx     # Lead submission to Supabase
│   │   ├── SearchPage.jsx           # Article search
│   │   ├── Home.jsx                 # Front page
│   │   └── Pages.jsx                # Category, Article, and fallback pages
│   ├── App.jsx               # Routes
│   └── main.jsx              # Entry point
```
# Intellus-News
# Intellus-News
# Intellus-News
