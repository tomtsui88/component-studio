"use client";

import dynamic from "next/dynamic";

// MainContent uses useChat from @ai-sdk/react which accesses localStorage during
// render. Disable SSR to prevent failures on the server (Node.js 22 creates a
// broken localStorage global via --localstorage-file).
const MainContentDynamic = dynamic(
  () => import("./main-content").then((mod) => ({ default: mod.MainContent })),
  { ssr: false }
);

export { MainContentDynamic as MainContent };
