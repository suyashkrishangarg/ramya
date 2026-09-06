---

# ≡ƒîÉ ramya ai ΓÇö Complete Website Specification

```
                               SITE ARCHITECTURE MAP
                               
                                ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
                                Γöé   / (Landing)   Γöé
                                ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
             ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö╝ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
             Γû╝                           Γû╝                           Γû╝
    ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ         ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ         ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
    Γöé     /models     Γöé         Γöé    /pricing     Γöé         Γöé  /login (auth)  Γöé
    Γöé  (engine specs) Γöé         Γöé (hybrid pricing)Γöé         Γöé (Google OAuth)  Γöé
    ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ         ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ         ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
                                                                     Γû╝
                                                            ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
                                                            Γöé    /waitlist    Γöé
                                                            Γöé (queue status)  Γöé
                                                            ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
```

---

## 1. Page-by-Page Content & Wireframe Breakdown

### Page 1: `/` ΓÇö The Main Landing Page

The landing page is designed to convert visitors into waitlist signups in under 30 seconds.

#### Section A: Fixed Glassmorphism Navbar
* **Left:** `[r] ramya ai` (dynamic theme logo + lowercase wordmark).
* **Center (Links):** `features` ┬╖ `engine` ┬╖ `pricing` ┬╖ `docs`.
* **Right:** 
  * Theme Toggle (Sun/Moon icon).
  * `sign in` (Ghost button).
  * `get early access` (Solid Cyan Pill button $\rightarrow$ scrolls to waitlist).

#### Section B: Hero Section (The Core Hook)
* **Badge Tag:** `[Γ£ª now accepting closed beta access]`
* **Main Headline:**  
  `the universal hybrid agent platform.`  
  `slashes ai costs by up to 80%.`
* **Sub-headline:**  
  *"run routine tasks locally on your laptop for free. seamlessly offload deep reasoning to ultra-affordable cloud models. built for anyone who works on a computer."*
* **Interactive Waitlist Capsule:**
  * Clean pill input: `[ enter your work or personal email... ] [ join waitlist Γ₧ö ]`
  * Social proof counter below input: `≡ƒƒó 2,400+ power users, devs & professionals in line`

#### Section C: Interactive Product Simulator (Visual Wireframe)
An interactive animated desktop mock comparing standard cloud execution vs. **ramya ai**:

```
ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
Γöé  ramya desktop v1.0.0 ┬╖ task: "parse 40-page contract & extract risk items" Γöé
Γö£ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöñ
Γöé                                                                             Γöé
Γöé  [≡ƒƒó local engine] reading document & parsing clauses...    (0.08s ┬╖ $0.00) Γöé
Γöé  [≡ƒƒó local engine] formatting risk tables & syntax check...  (0.04s ┬╖ $0.00) Γöé
Γöé  [≡ƒƒú cloud mesh]   synthesizing cross-jurisdiction liability (0.61s ┬╖ $0.003)Γöé
Γöé                                                                             Γöé
Γöé  -------------------------------------------------------------------------  Γöé
Γöé  Γ£ö completed in 0.73s   Γöé   cost: $0.003   Γöé   saved vs cloud saas: 84%     Γöé
ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
```

#### Section D: The 3 Core Pillars (Feature Grid)
* **Card 1: `[≡ƒƒó 100% free on-device brain]`**
  * *Title:* `unlimited local execution`
  * *Copy:* `run fine-tuned 3BΓÇô8B models locally on your apple silicon, nvidia gpu, or modern laptop. file reading, search, and formatting stay 100% free and on-device.`
* **Card 2: `[≡ƒƒú smart dynamic router]`**
  * *Title:* `zero token waste`
  * *Copy:* `never burn expensive frontier tokens on simple text extraction. our intelligent harness offloads only high-order reasoning to the cloud mesh.`
* **Card 3: `[ΓÜí high-reasoning cloud mesh]`**
  * *Title:* `frontier intelligence at 1/5th cost`
  * *Copy:* `access fine-tuned deep reasoning models with 3x the monthly token capacity of traditional $20/mo subscriptions with zero mid-day rate limits.`

#### Section E: Direct Comparison Matrix

| Capability | Legacy Cloud AI *(ChatGPT/Claude)* | Pure Local Open AI *(Ollama)* | **ramya ai** |
| :--- | :---: | :---: | :---: |
| **Routine Task Cost** | High ($$ Token burn) | Free ($0) | **Free ($0 on-device)** |
| **Complex Logic** | High Intelligence | Struggles / Hallucinates | **High-Reasoning Cloud** |
| **Usage Limits** | Strict mid-day caps | Unlimited | **Zero Rate-Limit Anxiety** |
| **Setup Friction** | Zero Setup | Technical / CLI only | **1-Click Desktop App** |
| **Total Price** | $20ΓÇô$50/mo | Free (Hardware limited) | **$20/mo for 3x Capacity** |

#### Section F: Simple FAQ & Minimal Footer
* 4 collapsible questions:
  1. *is my local data really private?* (Yes, 0 bytes leave your machine in local mode).
  2. *what hardware do i need?* (Any M-series Mac or 8GB+ RAM laptop running Windows/Linux).
  3. *how is it 80% cheaper?* (Local engine absorbs 80% of token calls; cloud uses optimized open-weight clusters).
  4. *when do i get access?* (Rolling weekly beta batches).
* **Footer:** `[r] ramya ai` ┬╖ `terms` ┬╖ `privacy` ┬╖ `x / twitter` ┬╖ `discord` ┬╖ `github`.

---

### Page 2: `/models` ΓÇö Engine & Model Specs
* **Hero:** `the hybrid intelligence engine.` (Transparent model architecture).
* **Local Models Tier:** Specifications of fine-tuned 3B, 7B, and 8B models (quantized via GGUF/AWQ for MLX & TensorRT).
* **Cloud Models Tier:** Specifications of high-reasoning cloud mesh models (DeepSeek-R1 / Qwen-2.5 / Kimi fine-tunes).
* **Token Efficiency Benchmarks:** Graphs showing reduced reasoning token overhead while maintaining 100% tool-calling schema accuracy.

---

### Page 3: `/pricing` ΓÇö The Transparent Model
* Displays the 3 pricing cards matching your approved model:
  1. **`free ($0)`**: Unlimited local AI + 500k starter cloud tokens + BYOK.
  2. **`pro ($20/mo)`**: 3x ChatGPT token allowance + smart auto-routing + no rate caps.
  3. **`pay-as-you-go & api`**: $5 / $10 token reload packs + OpenAI-compatible API.
* Interactive Cost Savings Slider: *"How many hours do you use AI daily?"* $\rightarrow$ Calculates annual dollar savings.

---

### Page 4: `/login` & `/signup` ΓÇö Authentication
* **Design:** Minimalist centered card in Dark Obsidian.
* **Header:** `[r] ramya ai` $\rightarrow$ `welcome to the future of compute.`
* **Auth Buttons:**
  1. `[ continue with google ]` (Primary 1-click OAuth).
  2. `[ continue with github ]` (For developer adoption).
  3. Or magic link: `[ enter email ]` $\rightarrow$ `[ send magic link ]`.
* **Footer Notice:** `by signing in, you agree to our terms and privacy policy.`

---

### Page 5: `/waitlist/confirmed` ΓÇö Position & Viral Referral
* **Headline:** `you're on the list!`
* **Dynamic Badge:** `your position: #412 of 2,400+`
* **Viral Hook:**  
  `want to jump the line?`  
  *"share your unique referral link with colleagues. every person who joins moves you up 10 spots and grants both of you 500k bonus cloud tokens."*
* **Link Box:** `[ https://ramya.ai/join?ref=xyz123 ] [ copy link ]`
* **Direct Links:** `[ join our discord ]` ┬╖ `[ follow on x ]`

---

## 2. Recommended Technical Stack

```
ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
Γöé                             MODERN WEB STACK                                Γöé
Γö£ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö¼ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöñ
Γöé Layer             Γöé Technology Choice             Γöé Why It Fits             Γöé
Γö£ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö╝ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö╝ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöñ
Γöé Frontend          Γöé Next.js 14/15 (App Router)    Γöé Lightning fast, SEO     Γöé
Γöé Styling           Γöé Tailwind CSS + Framer Motion  Γöé Dark obsidian palette   Γöé
Γöé Backend / DB      Γöé Supabase (PostgreSQL)         Γöé Instant Auth + DB + RLS Γöé
Γöé Authentication    Γöé Supabase Auth (Google OAuth)  Γöé 1-Click login setup     Γöé
Γöé Emails            Γöé Resend + React Email          Γöé Clean waitlist emails   Γöé
Γöé Hosting / Edge    Γöé Vercel                        Γöé Sub-50ms global TTFB    Γöé
ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö┤ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö┤ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ
```

---

## 3. Database Schema Design (PostgreSQL / Supabase)

Here are the 4 core tables needed to run the website, authentication, and waitlist system:

```sql
-- 1. Profiles Table (Tied to Supabase Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    plan_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Waitlist Queue & Referral Table
CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    referral_code TEXT UNIQUE NOT NULL,
    referred_by TEXT REFERENCES waitlist(referral_code),
    position SERIAL,
    bonus_points INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'invited', 'active'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Cloud Token Usage & Balances
CREATE TABLE token_balances (
    user_id UUID REFERENCES profiles(id) PRIMARY KEY,
    free_starter_tokens_remaining BIGINT DEFAULT 500000,
    monthly_pro_tokens_remaining BIGINT DEFAULT 0,
    purchased_topup_balance BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Developer API Keys (For BYOK & Cloud API)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL,
    key_prefix TEXT NOT NULL, -- e.g., 'ramya_live_...'
    label TEXT DEFAULT 'default key',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. User Journey & Waitlist Flow

```
1. Visitor lands on ramya.ai
   Γöé
   Γö£ΓöÇΓöÇ Option A: Enters email in Hero Waitlist Capsule
   Γöé     ΓööΓöÇΓöÇ Instantly adds email to `waitlist` table ΓöÇΓöÇΓû║ Redirects to `/waitlist/confirmed`
   Γöé
   ΓööΓöÇΓöÇ Option B: Clicks "Sign in with Google"
         Γö£ΓöÇΓöÇ Authenticates via Supabase Google OAuth
         Γö£ΓöÇΓöÇ Profile created in `profiles` table
         Γö£ΓöÇΓöÇ Auto-assigns starter 500,000 cloud credits in `token_balances`
         ΓööΓöÇΓöÇ Redirects to User Dashboard / Beta Queue Status
```

---

## 5. Summary Checklist Before Coding

1. **Logo Placement:** Ensure `ramya_logo_blackbg.png` renders on dark mode and `ramya_logo_whitebg.png` on light mode.
2. **Typography Setup:** Load Google Fonts `Geist Sans` (Body/Display) and `JetBrains Mono` (Badges/Metrics).
3. **Google OAuth Config:** Enable Google Provider in your Supabase Dashboard with your Google Cloud Client ID & Secret.
4. **Copy Standard:** Keep all brand headings, badges, and buttons strictly in **lowercase** (`ramya ai`, `join waitlist Γ₧ö`, `features`).
