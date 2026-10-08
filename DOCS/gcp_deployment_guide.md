# GATEPASS — GCP Cloud Run Deployment & $0 Architecture Guide

> **Goal:** Run a production-grade hostel gatepass system at $0/month using GCP Cloud Run + Neon DB + Google Drive photo hosting.

---

## Part 1 — Architecture Cost Analysis

### Why This Costs $0/Month

| Platform | Resource | Your Usage (~2,000 users) | Free Tier Limit | Cost |
|:---|:---|:---|:---|:---|
| **Cloud Run** | API Requests | ~1.5M req/mo | 2M req/mo | $0.00 |
| | vCPU-seconds | ~60,000 | 180,000 | $0.00 |
| | GiB-seconds | ~120,000 | 360,000 | $0.00 |
| **Neon DB** | Storage | ~25 MB (text only) | 1 GB | $0.00 |
| | Compute (CU-hours) | ~45 hrs/mo | 100 hrs/mo | $0.00 |
| **Google Drive** | Photo Storage | ~1.5 GB (2,000 photos) | 15 GB | $0.00 |
| | Bandwidth | ~0 GB (bypasses backend) | Unlimited | $0.00 |
| **TOTAL** | | | | **$0.00/mo** |

### Why It Works

**Zero-idle billing:** Cloud Run at `--min-instances 0` + Neon 5-min autostop means both services hibernate when idle. At 3 AM, cost = $0.00.

**Bandwidth bypass:** Student photos stream directly from Google CDN (`googleusercontent.com`) to the browser. Cloud Run never processes photo bytes — no egress fees.

**Fast DB queries:** Prisma schema uses `@unique` + `@id` on QR codes, roll numbers, and tokens — O(1) index lookups (2–5ms). Fewer CU-seconds burned per request.

---

## Part 2 — GCP Deployment Guide (GUI + Minimal Terminal)

### Pre-Flight: Terminal Commands (Do These First)

**1. Generate strong JWT secrets:**
```bash
openssl rand -hex 32   # → copy as JWT_ACCESS_SECRET
openssl rand -hex 32   # → copy as JWT_REFRESH_SECRET
```

**2. Build Docker image for GCP (ARM Mac → Intel Cloud Run):**
```bash
cd /path/to/GATEPASS/BACKEND
docker buildx build --platform linux/amd64 -t gatepass-backend:latest .
```

**3. After creating Artifact Registry repo (Step 2 below), push the image:**
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev

docker tag gatepass-backend:latest \
  us-central1-docker.pkg.dev/YOUR_PROJECT_ID/gatepass-repo/gatepass-backend:latest

docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/gatepass-repo/gatepass-backend:latest
```

---

### STEP 1 — Enable APIs
🔗 https://console.cloud.google.com/apis/library

Search and **Enable** each:
- `Cloud Run API`
- `Artifact Registry API`
- `Secret Manager API`

---

### STEP 2 — Create Artifact Registry Repository
🔗 https://console.cloud.google.com/artifacts

1. Click **Create Repository**
2. Name: `gatepass-repo` | Format: `Docker` | Region: `us-central1`
3. Click **Create**

Note the full path: `us-central1-docker.pkg.dev/YOUR_PROJECT_ID/gatepass-repo`

Then run terminal command #3 from Pre-Flight above.

---

### STEP 3 — Create All Secrets
🔗 https://console.cloud.google.com/security/secret-manager

Click **Create Secret** for each:

| Secret Name | Value |
|:---|:---|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_y8iGYdsB6gaK@ep-purple-mountain-b4ezy43i-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require&pgbouncer=true&connection_limit=1&idle_in_transaction_session_timeout=5000` |
| `SECURITY_SECRET` | `gatepass_security_iiit_2026` |
| `JWT_ACCESS_SECRET` | ← first openssl output |
| `JWT_REFRESH_SECRET` | ← second openssl output |
| `GMAIL_USER` | `gatepassiiits@gmail.com` |
| `GMAIL_APP_PASSWORD` | `sfut ijwh hlyx utvh` |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `APP_URL` | `http://placeholder` ← updated after deploy in Step 6 |

---

### STEP 4 — Grant Cloud Run Access to Secrets
🔗 https://console.cloud.google.com/iam-admin/iam

1. Find principal: `YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com`
2. Click **Edit** → Add role: **Secret Manager Secret Accessor**
3. Click **Save**

> Find your project number at: https://console.cloud.google.com/home/dashboard

---

### STEP 5 — Deploy Cloud Run Service
🔗 https://console.cloud.google.com/run

1. Click **Create Service**
2. Pick image from Artifact Registry: `gatepass-backend:latest`
3. **Service name:** `gatepass-backend` | **Region:** `us-central1`
4. **Authentication:** Allow unauthenticated invocations ✅

#### 🔴 CRITICAL — Capacity Settings (Zero Bill)
- **Minimum instances:** `0`  ← MUST be zero (min-instances 1 = ~$30+/mo)
- **Maximum instances:** `10`
- **Startup CPU boost:** ✅ (Check this box to eliminate cold start lag)

#### Container tab:
- **Container port:** `3000`

#### Variables & Secrets tab — map all 9 secrets:

| Env Var Name | Secret | Version |
|:---|:---|:---|
| `DATABASE_URL` | `DATABASE_URL` | latest |
| `SECURITY_SECRET` | `SECURITY_SECRET` | latest |
| `JWT_ACCESS_SECRET` | `JWT_ACCESS_SECRET` | latest |
| `JWT_REFRESH_SECRET` | `JWT_REFRESH_SECRET` | latest |
| `GMAIL_USER` | `GMAIL_USER` | latest |
| `GMAIL_APP_PASSWORD` | `GMAIL_APP_PASSWORD` | latest |
| `NODE_ENV` | `NODE_ENV` | latest |
| `PORT` | `PORT` | latest |
| `APP_URL` | `APP_URL` | latest |

5. Click **Create** → wait ~2 min
6. **Copy the Service URL:** `https://gatepass-backend-xxxxxxxx-uc.a.run.app`

---

### STEP 6 — Update APP_URL
🔗 https://console.cloud.google.com/security/secret-manager

1. Click `APP_URL` → **New Version**
2. Value: `https://gatepass-backend-xxxxxxxx-uc.a.run.app`
3. **Add New Version**

Then: Cloud Run → `gatepass-backend` → **Edit & Deploy New Revision** → **Deploy**

---

### STEP 7 — Set Billing Alert ($1 Safety Net)
🔗 https://console.cloud.google.com/billing/budgets

1. **Create Budget** → Amount: `$1`
2. Add your email → **Save**

You'll be emailed instantly if anything starts costing money.

---

### STEP 8 — Verify
| Test | Expected |
|:---|:---|
| Open Cloud Run URL | JSON response (even 404 = server alive) |
| Cloud Run → Logs | `Server running on http://0.0.0.0:3000` |
| Forgot Password email | Link starts with `https://gatepass-backend-...run.app` |
| Home Pass → parent email | Link starts with `https://gatepass-backend-...run.app` |

---

## Part 3 — Future Updates Workflow

```bash
# Rebuild + push new image
docker buildx build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/gatepass-repo/gatepass-backend:latest \
  --push .
```

Then in GCP Console:
**Cloud Run → gatepass-backend → Edit & Deploy New Revision → Deploy**

Secrets stay. Env vars stay. One push + one click = done.

---

## Part 4 — $0 Survival Checklist

> Breaking any of these rules will generate unexpected charges.

- [ ] **Cloud Run `min-instances` must be `0`** 
  - **What it is:** A setting in Cloud Run that determines how many container instances stay running permanently.
  - **Why:** If set to 1 or more, GCP will bill you for 24/7 compute time (which costs ~$30+/month). Setting it to 0 allows Cloud Run to completely "hibernate" when nobody is using the app, keeping your compute bill at $0.00.

- [ ] **`DATABASE_URL` must use the Neon `-pooler` URL (in production)**
  - **What it is:** The Neon connection string that acts as a "traffic cop" (PgBouncer) between your app and the database.
  - **Why:** Cloud Run handles many requests simultaneously. If Prisma uses a direct connection, it holds connections open, blocking Neon from safely going to sleep. The pooler safely manages connections, allowing Neon to trigger its 5-minute Autostop timer and protecting your 100 free compute hours.

- [ ] **Never store photos as `base64` strings in the database**
  - **What it is:** Uploading the raw bytes of an image (converted to text) directly into a Postgres table column.
  - **Why:** Neon gives you 1 GB of free storage. Base64 strings are massive. Storing raw images inside the database will instantly bloat your table sizes and exhaust your 1 GB free limit in weeks, forcing you to pay for storage.

- [ ] **Student photos must be external URLs (Google Drive / ui-avatars)**
  - **What it is:** Storing only a simple text link (e.g., `https://drive.google.com/uc?id=...`) inside the database instead of the file itself.
  - **Why:** By offloading the actual image bytes to Google Drive, the image loads directly from Google's servers to the user's browser. This entirely bypasses your Cloud Run container, meaning you consume **0 GB** of Google Cloud's outbound network bandwidth (egress), which prevents expensive networking charges.

- [ ] **Billing alert set at $1 in GCP Billing**
  - **What it is:** An automated email trigger configured in your Google Cloud Billing Console.
  - **Why:** If an unexpected traffic spike happens, or if a configuration accidentally changes, this acts as an early warning system. You'll be notified instantly the moment you cross $1, rather than being surprised by a bill at the end of the month.

- [ ] **Neon Autostop set to 5 minutes**
  - **What it is:** A setting in the Neon dashboard that forces the database compute engine to shut down after a period of inactivity.
  - **Why:** Neon gives you 100 hours of free "active" compute per month. By setting Autostop to 5 minutes, your database will completely shut down during classes and overnight. This stretches your 100 free hours to easily cover the entire month. If disabled, Neon runs 24/7 and exhausts your free tier in exactly 4 days.
