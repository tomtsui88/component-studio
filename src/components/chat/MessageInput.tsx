"use client";

import { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative p-6"
      style={{
        backgroundColor: "var(--zen-surface)",
        borderTop: `1px solid var(--zen-border)`,
      }}
    >
      <div className="relative max-w-3xl mx-auto">
        {/* Input Container */}
        <div className="relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe the component you want to create..."
            disabled={isLoading}
            className="w-full min-h-[100px] max-h-[200px] pl-5 pr-14 py-4 rounded-xl resize-none transition-smooth text-[15px] leading-relaxed"
            style={{
              backgroundColor: "var(--zen-bg)",
              border: `1px solid var(--zen-border)`,
              color: "var(--zen-text)",
            }}
            rows={3}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--zen-sage-light)";
              e.target.style.boxShadow = "var(--zen-shadow)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--zen-border)";
              e.target.style.boxShadow = "none";
            }}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 bottom-3 p-2.5 rounded-lg transition-smooth hover-lift disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isLoading || !input.trim()
                ? "var(--zen-border)"
                : "var(--zen-sage)",
              border: "none",
            }}
          >
            <Send
              className="h-4 w-4"
              style={{
                color: isLoading || !input.trim()
                  ? "var(--zen-text-muted)"
                  : "#ffffff",
              }}
            />
          </button>
        </div>

        {/* Help Text */}
        <div
          className="mt-3 flex items-center justify-between text-xs"
          style={{ color: "var(--zen-text-muted)" }}
        >
          <span>
            Press{" "}
            <kbd
              className="px-2 py-0.5 rounded font-mono"
              style={{
                backgroundColor: "var(--zen-bg)",
                border: `1px solid var(--zen-border)`,
                color: "var(--zen-text)",
              }}
            >
              Enter
            </kbd>{" "}
            to send
          </span>
          {input.length > 0 && (
            <span style={{ color: "var(--zen-text-light)" }}>
              {input.length} characters
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
