"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";

/** Sign-in button when signed out, account menu when signed in. */
export function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text transition-colors hover:border-coral/50">
            Sign in
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
      </Show>
    </>
  );
}
