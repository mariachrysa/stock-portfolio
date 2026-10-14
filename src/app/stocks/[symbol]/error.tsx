"use client";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error;
  retry: () => void;
};

export default function Error({
  error,
  retry,
}: ErrorProps) {
  return (
    <main>
      <p>{error.message}</p>

      <Button
        type="button"
        onClick={() => retry()}
      >
        Retry
      </Button>
    </main>
  );
}