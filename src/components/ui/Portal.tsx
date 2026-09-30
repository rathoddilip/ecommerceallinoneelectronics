"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

function subscribe() {
  return () => {};
}

export default function Portal({ children }: { children: ReactNode }) {
  // Renders false on the server (and on the client's first pass) and true
  // once mounted in the browser, without setState-in-effect cascades.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!mounted) return null;
  return createPortal(children, document.body);
}
