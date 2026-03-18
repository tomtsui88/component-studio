"use client";

import { Message } from "ai";
import { cn } from "@/lib/utils";
import { User, Sparkles, Loader2 } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ToolCallMessage } from "./ToolCallMessage";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
          style={{
            backgroundColor: "var(--zen-sage-bg)",
          }}
        >
          <Sparkles
            className="h-8 w-8"
            style={{ color: "var(--zen-sage)" }}
          />
        </div>

        <h3
          className="text-lg font-semibold mb-2 text-display"
          style={{ color: "var(--zen-text)" }}
        >
          Welcome to Component Studio
        </h3>
        <p
          className="text-sm max-w-md"
          style={{ color: "var(--zen-text-muted)" }}
        >
          Describe the React component you&apos;d like to create, and I&apos;ll generate it with live preview
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-8">
      <div className="space-y-6 max-w-3xl mx-auto w-full">
        {messages.map((message, index) => (
          <div
            key={message.id || message.content}
            className={cn(
              "flex gap-4 slide-in",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--zen-sage-bg)",
                  }}
                >
                  <Sparkles
                    className="h-4 w-4"
                    style={{ color: "var(--zen-sage)" }}
                  />
                </div>
              </div>
            )}

            <div
              className={cn(
                "flex flex-col gap-2 max-w-[80%]",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className="rounded-2xl px-4 py-3 transition-smooth"
                style={{
                  backgroundColor:
                    message.role === "user"
                      ? "var(--zen-sage)"
                      : "var(--zen-surface)",
                  border:
                    message.role === "user"
                      ? "none"
                      : `1px solid var(--zen-border)`,
                  color:
                    message.role === "user" ? "#ffffff" : "var(--zen-text)",
                  boxShadow: "var(--zen-shadow-sm)",
                }}
              >
                <div className="text-[15px] leading-relaxed">
                  {message.parts ? (
                    <>
                      {message.parts.map((part, partIndex) => {
                        switch (part.type) {
                          case "text":
                            return message.role === "user" ? (
                              <span
                                key={partIndex}
                                className="whitespace-pre-wrap"
                              >
                                {part.text}
                              </span>
                            ) : (
                              <MarkdownRenderer
                                key={partIndex}
                                content={part.text}
                                className="prose-sm"
                              />
                            );
                          case "reasoning":
                            return (
                              <div
                                key={partIndex}
                                className="mt-3 p-3 rounded-lg"
                                style={{
                                  backgroundColor: "var(--zen-blue-bg)",
                                  border: "1px solid var(--zen-blue-light)",
                                }}
                              >
                                <span
                                  className="text-xs font-semibold block mb-1.5 uppercase tracking-wide"
                                  style={{ color: "var(--zen-blue)" }}
                                >
                                  Reasoning
                                </span>
                                <span
                                  className="text-sm leading-relaxed"
                                  style={{ color: "var(--zen-text)" }}
                                >
                                  {part.reasoning}
                                </span>
                              </div>
                            );
                          case "tool-invocation":
                            const tool = part.toolInvocation;
                            return (
                              <ToolCallMessage
                                key={partIndex}
                                toolInvocation={tool}
                              />
                            );
                          case "source":
                            return (
                              <div
                                key={partIndex}
                                className="mt-2 text-xs"
                                style={{ color: "var(--zen-text-light)" }}
                              >
                                Source: {JSON.stringify(part.source)}
                              </div>
                            );
                          case "step-start":
                            return partIndex > 0 ? (
                              <hr
                                key={partIndex}
                                className="my-4"
                                style={{ borderColor: "var(--zen-border)" }}
                              />
                            ) : null;
                          default:
                            return null;
                        }
                      })}
                      {isLoading &&
                        message.role === "assistant" &&
                        messages.indexOf(message) === messages.length - 1 && (
                          <div
                            className="flex items-center gap-2 mt-3"
                            style={{ color: "var(--zen-sage)" }}
                          >
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        )}
                    </>
                  ) : message.content ? (
                    message.role === "user" ? (
                      <span className="whitespace-pre-wrap">
                        {message.content}
                      </span>
                    ) : (
                      <MarkdownRenderer
                        content={message.content}
                        className="prose-sm"
                      />
                    )
                  ) : isLoading &&
                    message.role === "assistant" &&
                    messages.indexOf(message) === messages.length - 1 ? (
                    <div
                      className="flex items-center gap-2"
                      style={{ color: "var(--zen-sage)" }}
                    >
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--zen-sage)",
                  }}
                >
                  <User className="h-4 w-4" style={{ color: "#ffffff" }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
