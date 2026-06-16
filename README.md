<div align="center">

# Gradient

### Learn machine learning by making the math move.

Gradient is an interactive ML learning platform. Instead of static equations and
dense prose, every concept comes with a **live visualization** you can poke at —
drag the data, tune the learning rate, and watch the model respond in real time.

[Features](#features) · [Curriculum](#curriculum) · [Interactive labs](#interactive-labs) · [Tech stack](#tech-stack) · [Getting started](#getting-started) · [Architecture](#architecture)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6c47ff)
![Supabase](https://img.shields.io/badge/DB-Supabase-3ecf8e?logo=supabase)

</div>

---

## Overview

Gradient is built for CS and engineering students who think in code and lose
patience with hand-waving. The math stays visible and honest; the interaction is
what makes it stick — the goal is the moment a concept finally *clicks*: "oh,
*that's* how gradient descent works."

The repository contains two surfaces, both fully implemented:

| Surface | Route | What it is |
| --- | --- | --- |
| **Landing page** | `/` | A scroll-driven, motion-forward page that sells the product by *demonstrating* it — animated ML visualizations, a feature walkthrough, and a "Concept → code" section showing the same algorithm across five frameworks. |
| **Learn app** | `/learn` | The product: a structured curriculum where each lesson pairs a written explanation with an interactive lab and a graded quiz. |

---

## Features

- **🧪 Interactive labs** — Hands-on SVG/canvas visualizations where you
  manipulate an algorithm and see cause and effect immediately. Drag points,
  move sliders, press *Train*, and watch boundaries form.
- **👁 Visualize / Code tabs** — Every lab flips to a syntax-highlighted code
  view showing the exact algorithm the visualization animates.
- **🎮 Playground** (`/learn/playground`) — An IDE-style console that gathers
  *every* lab in one place: pick an algorithm to run its live visualization and
  read its source side by side.
- **📝 Server-graded quizzes** — Three to four multiple-choice questions per
  module. Answer keys live server-side; grading happens in a Server Action so
  answers never reach the browser.
- **🏆 Points & progress** — Earn 10 points per correct answer. The best score
  per quiz is persisted, completion ticks sync from the database, and a
  **150-point final exam** unlocks once every module is passed.
- **🔐 Accounts** — Clerk authentication with a modal sign-in; progress and
  points are tied to your account.
- **✨ Premium motion** — Framer Motion throughout, a custom design-token system,
  and typography tuned for a kinetic, Stripe/Framer-grade feel.

---

## Curriculum

**39 lessons across 8 areas**, plus a capstone final exam.

| Area | Topics |
| --- | --- |
| **Foundations** | What is ML · Types of ML · The ML Workflow · Bias–Variance Tradeoff · Overfitting & Regularization · Data Preprocessing |
| **Regression** | Linear Regression · Gradient Descent · Polynomial Regression · Ridge & Lasso |
| **Classification** | Logistic Regression · K-Nearest Neighbors · Decision Trees · Random Forest · Naive Bayes · SVMs · Gradient Boosting |
| **Unsupervised Learning** | K-Means · Hierarchical Clustering · PCA · DBSCAN |
| **Neural Networks** | The Perceptron · Neural Networks · Backpropagation · Activation Functions |
| **Model Evaluation** | Train/Test Split & Cross-Validation · Confusion Matrix · Precision/Recall/F1 · ROC & AUC |
| **Libraries & Tools** | NumPy · Pandas · scikit-learn · PyTorch · TensorFlow · Hugging Face |
| **LLMs & Retrieval** | Embeddings · Vector Databases · RAG · LangChain |

The entire curriculum is plain data in [`src/lib/curriculum.ts`](src/lib/curriculum.ts).
Adding a topic is a single new entry.

---

## Interactive labs

A few highlights from the **18 hands-on labs**:

| Lab | What you do |
| --- | --- |
| **Gradient Descent** | Tune the learning rate and watch the ball roll down (or diverge out of) the loss bowl. |
| **K-Means / KNN / DBSCAN** | Drop points, move the query, watch clusters and decision regions update live. |
| **Neural Net** | Adjust an MLP and see the decision surface bend. |
| **PyTorch — Autograd** | A define-by-run computation graph; flip Forward/Backward to watch `loss.backward()` fill the gradients. |
| **TensorFlow — Playground** | A *trainable* net (à la playground.tensorflow.org): per-neuron heatmaps, weight-colored links, press **Train** and watch it learn the circle. |
| **Embeddings** | A 2-D semantic space — click a word, see cosine-similarity bars to the rest. |
| **Vector Search** | Drag a query, tune top-k, watch approximate-nearest-neighbor retrieval. |
| **RAG** | Pick a question and watch real retrieval → augmented prompt → grounded answer. |
| **Broadcasting / DataFrame** | NumPy shape broadcasting and a pandas `groupby` you can drive. |

Labs are registered by key in [`src/components/learn/labs/index.tsx`](src/components/learn/labs/index.tsx)
and shared math helpers live in [`src/lib/ml.ts`](src/lib/ml.ts).

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack, Server Actions) |
| UI | **React 19**, **TypeScript 5** (strict) |
| Styling | **Tailwind CSS v4** with a custom design-token system |
| Motion | **Framer Motion 12** |
| Auth | **Clerk** (`@clerk/nextjs`) |
| Database | **Supabase** (`@supabase/supabase-js`, service-role, server-only) |
| Icons | Phosphor Icons, Simple Icons |
| Tooling | ESLint 9 |

> **Note:** This project targets Next.js 16, where conventions differ from
> earlier versions — most visibly, middleware now lives in
> [`src/proxy.ts`](src/proxy.ts) (the Clerk middleware), not `middleware.ts`.

---

## Getting started

### Prerequisites

- **Node.js 20+**
- A **Clerk** application ([dashboard.clerk.com](https://dashboard.clerk.com))
- A **Supabase** project ([supabase.com](https://supabase.com))

### 1. Install

```bash
git clone https://github.com/Hassanmahmood4/Gradient.git
cd Gradient
npm install
```

### 2. Configure environment

Copy the example and fill in your keys:

```bash
cp .env.local.example .env.local
```

```dotenv
# Clerk — Dashboard → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase — Project Settings → API (service-role key is secret, server-only)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

> Make sure the project ref in `SUPABASE_URL` matches the `ref` inside your
> service-role key — a mismatch silently fails auth against the wrong project.

### 3. Set up the database

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor to
create the `quiz_scores` table and its index.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The learn app lives at
[`/learn`](http://localhost:3000/learn).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## Architecture

A few decisions worth knowing before you dive in:

- **Answer keys never reach the client.** Full quizzes (with answers) live in
  [`src/lib/quizzes.ts`](src/lib/quizzes.ts), which imports `server-only`. The
  browser receives sanitized questions; the `gradeQuiz` **Server Action**
  recomputes the score on the server and persists the user's *best* result per
  quiz, so re-taking can only raise a score.

- **Auth is Clerk, persistence is Supabase.** Clerk middleware (`src/proxy.ts`)
  attaches auth context to every request. Database writes run server-side with
  the Supabase **service-role** key, scoped by hand to the Clerk `userId` — the
  key is never exposed to the browser
  ([`src/lib/supabase.ts`](src/lib/supabase.ts) is `server-only`).

- **Points are derived, not stored.** `total_points = SUM(best_correct) * 10`.
  A module is complete when its quiz is passed; the final exam unlocks once
  every module quiz has `passed = true`.

- **Progress syncs both ways.** Sidebar completion ticks are seeded from the
  database (`getMyStats`) on load and updated live after each grade, backed by a
  small external store in [`src/components/learn/progress.tsx`](src/components/learn/progress.tsx).

### Project structure

```
src/
├─ app/
│  ├─ page.tsx                 # marketing landing page (/)
│  ├─ layout.tsx               # ClerkProvider + fonts
│  └─ learn/
│     ├─ layout.tsx            # learn app shell (Workspace)
│     ├─ page.tsx              # curriculum index
│     ├─ actions.ts            # Server Actions: gradeQuiz, getMyStats
│     ├─ [topic]/page.tsx      # a lesson (content + lab + quiz)
│     ├─ playground/page.tsx   # all labs in one console
│     └─ final-exam/page.tsx   # unlock-gated capstone
├─ components/
│  ├─ sections/                # landing-page sections
│  ├─ learn/                   # learn-app UI (Sidebar, Quiz, Playground…)
│  │  └─ labs/                 # the interactive lab components + registry
│  └─ ui/ · motion/ · viz/     # primitives, motion, hero visuals
├─ lib/
│  ├─ curriculum.ts            # the curriculum (plain data)
│  ├─ quizzes.ts               # quizzes + answer keys (server-only)
│  ├─ ml.ts                    # shared math helpers for labs
│  └─ supabase.ts              # server-only Supabase admin client
└─ proxy.ts                    # Clerk middleware (Next 16 convention)
supabase/schema.sql            # database schema
```

---

## Extending the app

- **Add a lesson** — append a `Topic` (slug, summary, content blocks, optional
  `lab`/`labCode`) to a category in `src/lib/curriculum.ts`, and optionally a
  quiz keyed by the same slug in `src/lib/quizzes.ts`. It automatically appears
  in the sidebar, gets prev/next navigation, and counts toward the final exam.
- **Add a lab** — create a component under `src/components/learn/labs/`, add its
  key to the `LabKey` union in `curriculum.ts`, and register it in
  `labs/index.tsx`. Reference it from a topic via `lab: "your-key"`.

---

## License

This project is provided as-is for educational purposes. See the repository for
details.

<div align="center">
<sub>Built with Next.js · React · Clerk · Supabase — and a lot of moving math.</sub>
</div>
