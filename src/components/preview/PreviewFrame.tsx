"use client";

import { useEffect, useRef, useState } from "react";
import { useFileSystem } from "@/lib/contexts/file-system-context";
import {
  createImportMap,
  createPreviewHTML,
} from "@/lib/transform/jsx-transformer";
import { Eye, AlertCircle } from "lucide-react";

export function PreviewFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getAllFiles, refreshTrigger } = useFileSystem();
  const [error, setError] = useState<string | null>(null);
  const [entryPoint, setEntryPoint] = useState<string>("/App.jsx");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const updatePreview = () => {
      try {
        const files = getAllFiles();

        // Clear error first when we have files
        if (files.size > 0 && error) {
          setError(null);
        }

        // Find the entry point - look for App.jsx, App.tsx, index.jsx, or index.tsx
        let foundEntryPoint = entryPoint;
        const possibleEntries = [
          "/App.jsx",
          "/App.tsx",
          "/index.jsx",
          "/index.tsx",
          "/src/App.jsx",
          "/src/App.tsx",
        ];

        if (!files.has(entryPoint)) {
          const found = possibleEntries.find((path) => files.has(path));
          if (found) {
            foundEntryPoint = found;
            setEntryPoint(found);
          } else if (files.size > 0) {
            // Just use the first .jsx/.tsx file found
            const firstJSX = Array.from(files.keys()).find(
              (path) => path.endsWith(".jsx") || path.endsWith(".tsx")
            );
            if (firstJSX) {
              foundEntryPoint = firstJSX;
              setEntryPoint(firstJSX);
            }
          }
        }

        if (files.size === 0) {
          if (isFirstLoad) {
            setError("firstLoad");
          } else {
            setError("No files to preview");
          }
          return;
        }

        // We have files, so it's no longer the first load
        if (isFirstLoad) {
          setIsFirstLoad(false);
        }

        if (!foundEntryPoint || !files.has(foundEntryPoint)) {
          setError(
            "No React component found. Create an App.jsx or index.jsx file to get started."
          );
          return;
        }

        const { importMap, styles, errors } = createImportMap(files);
        const previewHTML = createPreviewHTML(foundEntryPoint, importMap, styles, errors);

        if (iframeRef.current) {
          const iframe = iframeRef.current;

          // Need both allow-scripts and allow-same-origin for blob URLs in import map
          iframe.setAttribute(
            "sandbox",
            "allow-scripts allow-same-origin allow-forms"
          );
          iframe.srcdoc = previewHTML;

          setError(null);
        }
      } catch (err) {
        console.error("Preview error:", err);
        setError(err instanceof Error ? err.message : "Unknown preview error");
      }
    };

    updatePreview();
  }, [refreshTrigger, getAllFiles, entryPoint, error, isFirstLoad]);

  if (error) {
    if (error === "firstLoad") {
      return (
        <div
          className="h-full flex items-center justify-center p-8"
          style={{ backgroundColor: "var(--zen-surface)" }}
        >
          <div className="text-center max-w-md fade-in">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
              style={{
                backgroundColor: "var(--zen-blue-bg)",
              }}
            >
              <Eye
                className="h-10 w-10"
                style={{ color: "var(--zen-blue)" }}
              />
            </div>

            <h3
              className="text-xl font-semibold mb-3 text-display"
              style={{ color: "var(--zen-text)" }}
            >
              Preview Ready
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--zen-text-muted)" }}
            >
              Start a conversation to generate your first React component. You&apos;ll see the live preview here as soon as it&apos;s created.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="h-full flex items-center justify-center p-8"
        style={{ backgroundColor: "var(--zen-surface)" }}
      >
        <div className="text-center max-w-md">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{
              backgroundColor: "var(--zen-terracotta-bg)",
            }}
          >
            <AlertCircle
              className="h-8 w-8"
              style={{ color: "var(--zen-terracotta)" }}
            />
          </div>

          <h3
            className="text-lg font-semibold mb-2 text-display"
            style={{ color: "var(--zen-text)" }}
          >
            Preview Unavailable
          </h3>
          <p
            className="text-sm mb-2"
            style={{ color: "var(--zen-terracotta)" }}
          >
            {error}
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--zen-text-muted)" }}
          >
            Create a React component using the AI assistant to see it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0"
      style={{ backgroundColor: "#ffffff" }}
      title="Preview"
    />
  );
}
