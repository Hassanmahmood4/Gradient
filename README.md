# Gradient

**Learn machine learning by making the math move.**

Gradient is an interactive learning platform for machine learning. Instead of
static equations and dense textbook prose, it teaches through live
visualizations — you drag data points, tune learning rates, and watch decision
boundaries form in real time. The goal is the moment a concept finally
*clicks*: "oh, *that's* how gradient descent works."

It is built for CS and engineering students who are comfortable with calculus
and linear algebra, think in code and systems, and lose patience with
hand-waving. The math stays visible and honest; the interaction is what makes
it stick.

---

## What's in here

The project has two surfaces, both implemented in this repository (the frontend
is complete; a backend is planned):

### 1. The marketing landing page (`/`)

A scroll-driven, motion-forward page that sells the product by *demonstrating*
it — animated ML visualizations, a feature walkthrough, social proof, and a
clear path to conversion. Built to feel premium and kinetic (Stripe/Framer
lane), deliberately avoiding generic SaaS templates.

### 2. The learn app (`/learn`)

The product itself: a structured curriculum of bite-size lessons, each pairing
written explanation with an interactive lab and a short quiz.

- **Interactive labs** — hands-on SVG visualizations where you manipulate the
  algorithm and see cause and effect immediately.
- **Visualize / Code tabs** — every lab can flip to a clean code view showing
  the exact algorithm the visualization animates.
- **Quizzes** — three to four multiple-choice questions per module (including a
  "read the code" question on lab topics). Answering them all correctly marks
  the module complete.
- **Progress tracking** — completion is stored in the browser via
  `localStorage`, so the sidebar and progress indicators persist between visits.

---

## Curriculum

Content lives as plain data in `src/lib/curriculum.ts` and `src/lib/quizzes.ts`,
so adding or editing a lesson never touches rendering code. The curriculum is
organized into **6 categories** covering **29 topics**, **13** of which are
backed by an interactive lab:

| Category | Topics include |
| --- | --- |
| **Foundations** | What is ML, types of ML, the ML workflow, bias–variance, overfitting & regularization, data preprocessing |
| **Regression** | Linear regression*, gradient descent*, polynomial regression, ridge & lasso |
| **Classification** | Logistic regression*, k-nearest neighbors*, decision trees*, random forest*, naive Bayes, SVMs, gradient boosting |
| **Unsupervised** | k-means*, hierarchical clustering, PCA, DBSCAN |
| **Neural Networks** | The perceptron, neural networks*, backpropagation, activation functions |
| **Model Evaluation** | Train/test split & cross-validation, confusion matrix*, precision/recall/F1*, ROC & AUC* |

\* has an interactive lab

The labs themselves (`src/components/learn/labs/`) include linear regression,
gradient descent, logistic regression, KNN, k-means, decision trees / random
forest, a neural network with real in-browser backprop, a bias–variance
explorer, and a classification-threshold playground.

---

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router) + **React 19**
- **TypeScript 5**
- **[Tailwind CSS v4](https://tailwindcss.com)** for styling, with an OKLCH
  theme defined as CSS tokens
- **[Framer Motion](https://www.framer.com/motion/)** for scroll reveals and
  physics-honest motion
- **[Phosphor Icons](https://phosphoricons.com)** and
  **[Simple Icons](https://simpleicons.org)**
- Custom SVG visualizations and a small math helper library
  (`src/lib/ml.ts`) — no charting dependency
- **[Clerk](https://clerk.com)** for authentication
- **[Supabase](https://supabase.com)** (Postgres) for the points/progress store,
  accessed server-side via Server Actions

> **Note:** This project pins a specific Next.js release whose APIs and
> conventions may differ from older versions. When working on the code, consult
> the bundled guides in `node_modules/next/dist/docs/` before relying on
> training-data assumptions.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # root layout, fonts, metadata
│   ├── page.tsx              # marketing landing page
│   ├── globals.css           # theme tokens + base styles
│   └── learn/
│       ├── layout.tsx        # learn workspace shell
│       ├── page.tsx          # curriculum index
│       └── [topic]/page.tsx  # individual lesson (lab + content + quiz)
├── components/
│   ├── sections/             # landing-page sections (Hero, Features, CTA, …)
│   ├── viz/                  # landing-page visualizations
│   ├── motion/               # scroll-reveal helpers
│   ├── ui/                   # shared primitives (Button, Logo)
│   └── learn/
│       ├── Workspace.tsx     # sidebar + topbar shell
│       ├── Sidebar.tsx       # curriculum navigation + progress
│       ├── LessonContent.tsx # renders structured lesson blocks
│       ├── Quiz.tsx          # multiple-choice quiz + completion
│       ├── LabPanel.tsx      # Visualize / Code tab switcher
│       ├── LabMount.tsx      # maps a lab key to its component
│       ├── progress.tsx      # localStorage-backed progress store
│       ├── controls.tsx      # shared lab controls (sliders, stats, buttons)
│       └── labs/             # the interactive ML labs
└── lib/
    ├── curriculum.ts         # all categories, topics, and lesson content
    ├── quizzes.ts            # per-topic quiz questions
    ├── ml.ts                 # math/scale helpers for the labs
    └── utils.ts              # cn() class-merge utility
```

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or
[http://localhost:3000/learn](http://localhost:3000/learn) to jump into the
curriculum.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## Authoring content

The curriculum is intentionally data-driven so lessons can be added without
touching components — this is the layer a database will eventually back.

- **Add a topic:** append a `Topic` entry to the relevant category in
  `src/lib/curriculum.ts`. A topic has a `slug`, `title`, `summary`, an array of
  content `Block`s (`p`, `h`, `list`, `ol`, `math`, `code`, `callout`), and
  optionally a `lab` key and a `labCode` snippet.
- **Add a quiz:** add an entry keyed by the topic slug in
  `src/lib/quizzes.ts`. Each question may include an optional `code` snippet for
  code-reading questions.
- **Add a lab:** create a component under `src/components/learn/labs/`, register
  it in `labs/index.tsx` under a new `LabKey`, and reference that key from the
  topic.

---

## Design

The interface uses a **warm dark** theme — a charcoal canvas (never pure black)
with a committed coral × violet duotone for atmosphere and accents. Typography
pairs Bricolage Grotesque (display), Hanken Grotesk (body), and JetBrains Mono
(code and data). Motion is energetic but meaningful, and `prefers-reduced-motion`
is honored throughout. See [`DESIGN.md`](./DESIGN.md) and
[`PRODUCT.md`](./PRODUCT.md) for the full briefs.

---

## Backend, accounts & points

Signed-in users earn **10 points per correct quiz answer**, and a **15-question
final exam** unlocks once every module has been passed.

- **Auth:** Clerk. The root layout is wrapped in `<ClerkProvider>`, and
  `proxy.ts` (Next.js 16's renamed Middleware) runs `clerkMiddleware()` so
  `auth()` works in Server Actions and Components.
- **Grading is server-authoritative.** Answer keys live in `src/lib/quizzes.ts`,
  which is `server-only` — they never reach the browser. The client receives
  sanitized questions and submits answers to the `gradeQuiz` Server Action
  (`src/app/learn/actions.ts`), which recomputes the score and persists it.
- **Scoring rule:** each quiz stores the user's *best* result, and
  `points = SUM(best_correct) × 10`. Re-taking a quiz can only raise a score,
  never farm points.
- **Storage:** a single `quiz_scores` table in Supabase Postgres (see
  `supabase/schema.sql`). Points, module completion, and final-exam unlock are
  all derived from it.
- **Final exam:** `/learn/final-exam` checks auth, then verifies every module
  quiz is passed before rendering the exam; otherwise it shows a locked state
  with a progress bar.

### Backend setup

1. **Clerk** — create an app at [dashboard.clerk.com](https://dashboard.clerk.com)
   and copy the publishable and secret keys.
2. **Supabase** — create a project at [supabase.com](https://supabase.com), then
   run `supabase/schema.sql` in the SQL editor. Copy the project URL and the
   **service-role** key (server-only; keep it secret).
3. **Environment** — copy `.env.local.example` to `.env.local` and fill in:

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_…
   CLERK_SECRET_KEY=sk_test_…
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=…
   ```

4. `npm run dev`, sign in, and complete a quiz to start banking points.

> The app builds and runs without these keys (auth and points simply stay
> inactive), so the frontend works standalone — but accounts, points, and the
> final exam require the setup above.

---

## Roadmap

- [x] Marketing landing page
- [x] Interactive learn app with labs, quizzes, and progress tracking
- [x] Backend — Clerk auth, a Supabase-backed points system, and a gated final exam
- [ ] Persisted lesson progress synced across devices (currently `localStorage`)
- [ ] Leaderboard and per-category scoring
