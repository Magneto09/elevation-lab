# 🌿 Elevation Lab — Deployment Guide

## Go Live in 30 Minutes (₹0 cost)

### STEP 1: Create Supabase Project (5 min)

1. Go to **https://supabase.com** → Sign up (free)
2. Click **"New Project"**
3. Set:
   - Name: `elevation-lab`
   - Database Password: (save this somewhere safe!)
   - Region: **South Asia (Mumbai)** ← closest to Pune
4. Wait 2 minutes for it to provision

### STEP 2: Set Up the Database (3 min)

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the ENTIRE contents of `supabase-schema.sql` and paste it
4. Click **"Run"** (the green play button)
5. You should see "Success" — this creates all tables, security rules, and default data

### STEP 3: Enable Email Auth (2 min)

1. Go to **Authentication** → **Providers** (left sidebar)
2. **Email** should already be enabled (it is by default)
3. Go to **Authentication** → **Settings**
4. Under "Email Auth":
   - Turn OFF "Confirm email" (for demo — your 10 users won't need to verify email)
   - This means users can sign up and immediately use the app

### STEP 4: Get Your API Keys (1 min)

1. Go to **Settings** → **API** (left sidebar)
2. Copy these two values:
   - **Project URL** (looks like: `https://abcdefghij.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

### STEP 5: Push to GitHub (5 min)

1. Install Git if you don't have it: https://git-scm.com
2. Create a GitHub account if you don't have one: https://github.com
3. Create a **new repository** on GitHub called `elevation-lab`
4. Open terminal/command prompt in this project folder and run:

```bash
git init
git add .
git commit -m "Elevation Lab MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/elevation-lab.git
git push -u origin main
```

### STEP 6: Deploy on Vercel (5 min)

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your `elevation-lab` repo from GitHub
4. Before clicking Deploy, add **Environment Variables**:
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_SUPABASE_URL` = your Project URL from Step 4
   - Add: `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key from Step 4
5. Click **"Deploy"**
6. Wait 2-3 minutes — Vercel builds and deploys automatically

### STEP 7: Your App is LIVE! 🎉

Vercel gives you a URL like: `https://elevation-lab.vercel.app`

Share this URL with your 10 beta users!

---

## How to Add a Custom Domain (optional, ₹500-800/year)

1. Buy a domain from **Namecheap** or **GoDaddy** (e.g., `elevationlab.in`)
2. In Vercel: **Settings** → **Domains** → Add your domain
3. Follow Vercel's DNS instructions (usually add 1 CNAME record)

---

## How to Monitor Your 10 Beta Users

### See all user data in Supabase:
1. Go to **Supabase** → **Table Editor**
2. You can see all tables: profiles, ideas, tasks, sessions, reflections
3. Click any table to see all the data your users create

### See user signups:
1. Go to **Supabase** → **Authentication** → **Users**
2. You'll see every user who signed up with their email

---

## Free Tier Limits (more than enough for 10 users)

| Service | Limit | Your Usage |
|---------|-------|------------|
| **Vercel** | 100GB bandwidth/mo | ~0.1GB for 10 users |
| **Supabase DB** | 500MB | ~1MB for 10 users |
| **Supabase Auth** | 50,000 MAU | 10 users |
| **Supabase Storage** | 1GB | Not used yet |

You're at **<1%** of all free limits with 10 users.

---

## Troubleshooting

**"Invalid API key" error**: Double-check your environment variables on Vercel match exactly what's in Supabase → Settings → API.

**Users can't sign up**: Make sure "Confirm email" is turned OFF in Supabase → Authentication → Settings.

**Blank page**: Check Vercel deployment logs for build errors. Usually a missing import or typo.

**Need to redeploy after changes**: Just push to GitHub — Vercel auto-deploys on every push.

```bash
git add .
git commit -m "Updated feature"
git push
```

---

## Tech Stack (all free)

- **Frontend**: Next.js 14 + React 18 (hosted on Vercel)
- **Database**: PostgreSQL (hosted on Supabase)
- **Auth**: Supabase Auth (email/password)
- **Hosting**: Vercel (auto-SSL, CDN, auto-deploy from GitHub)
- **Total Monthly Cost**: ₹0
