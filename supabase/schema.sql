-- ---------------------------------------------------------------------------
-- Gradient — database schema
-- Run this in the Supabase SQL editor (or via the CLI) to create the tables.
--
-- Auth is handled by Clerk, so `user_id` holds the Clerk user id (a text id
-- like "user_2 abc..."). All writes happen server-side with the service-role
-- key, scoped to the authenticated user, so Row Level Security is left off
-- here. If you later expose the anon key to the client, enable RLS.
-- ---------------------------------------------------------------------------

create table if not exists quiz_scores (
  user_id         text        not null,
  quiz_slug       text        not null,
  best_correct    integer     not null default 0,
  total_questions integer     not null,
  passed          boolean     not null default false,
  updated_at      timestamptz not null default now(),
  primary key (user_id, quiz_slug)
);

-- Fast lookup of everything a user has scored (points total, unlock check).
create index if not exists quiz_scores_user_idx on quiz_scores (user_id);

-- Points are derived: total_points = SUM(best_correct) * 10 for a user.
-- A module is "complete" when passed = true (all questions correct).
-- The final exam unlocks when every module quiz has passed = true.
