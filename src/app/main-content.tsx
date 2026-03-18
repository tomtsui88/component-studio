"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileSystemProvider } from "@/lib/contexts/file-system-context";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { ThemeProvider } from "@/lib/contexts/theme-context";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderActions } from "@/components/HeaderActions";
import { Sparkles } from "lucide-react";

interface MainContentProps {
  user?: {
    id: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    messages: any[];
    data: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function MainContent({ user, project }: MainContentProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  return (
    <ThemeProvider>
    <FileSystemProvider initialData={project?.data}>
      <ChatProvider projectId={project?.id} initialMessages={project?.messages}>
        <div
          className="h-screen w-screen overflow-hidden"
          style={{ backgroundColor: "var(--zen-bg)" }}
        >
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Chat */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div
                className="h-full flex flex-col fade-in"
                style={{ backgroundColor: "var(--zen-surface)" }}
              >
                {/* Chat Header */}
                <div
                  className="h-16 flex items-center justify-between px-6"
                  style={{
                    borderBottom: `1px solid var(--zen-border)`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg"
                      style={{
                        backgroundColor: "var(--zen-sage-bg)",
                      }}
                    >
                      <Sparkles
                        className="h-5 w-5"
                        style={{ color: "var(--zen-sage)" }}
                      />
                    </div>
                    <div>
                      <h1
                        className="text-base font-semibold text-display"
                        style={{ color: "var(--zen-text)" }}
                      >
                        Component Studio
                      </h1>
                      <p
                        className="text-xs"
                        style={{ color: "var(--zen-text-muted)" }}
                      >
                        AI-powered generator
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  <ChatInterface />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle
              className="w-px"
              style={{ backgroundColor: "var(--zen-border)" }}
            />

            {/* Right Panel - Preview/Code */}
            <ResizablePanel defaultSize={65}>
              <div
                className="h-full flex flex-col fade-in-delay-1"
                style={{ backgroundColor: "var(--zen-surface)" }}
              >
                {/* Top Bar */}
                <div
                  className="h-16 px-6 flex items-center justify-between"
                  style={{
                    borderBottom: `1px solid var(--zen-border)`,
                  }}
                >
                  <Tabs
                    value={activeView}
                    onValueChange={(v) =>
                      setActiveView(v as "preview" | "code")
                    }
                  >
                    <TabsList
                      className="h-10 p-1"
                      style={{
                        backgroundColor: "var(--zen-bg)",
                        border: `1px solid var(--zen-border)`,
                        borderRadius: "0.5rem",
                      }}
                    >
                      <TabsTrigger
                        value="preview"
                        className="px-4 py-1.5 text-sm font-medium rounded transition-smooth"
                        style={{
                          color: activeView === "preview" ? "var(--zen-text)" : "var(--zen-text-muted)",
                          backgroundColor: activeView === "preview" ? "var(--zen-surface)" : "transparent",
                          boxShadow: activeView === "preview" ? "var(--zen-shadow-sm)" : "none",
                        }}
                      >
                        Preview
                      </TabsTrigger>
                      <TabsTrigger
                        value="code"
                        className="px-4 py-1.5 text-sm font-medium rounded transition-smooth"
                        style={{
                          color: activeView === "code" ? "var(--zen-text)" : "var(--zen-text-muted)",
                          backgroundColor: activeView === "code" ? "var(--zen-surface)" : "transparent",
                          boxShadow: activeView === "code" ? "var(--zen-shadow-sm)" : "none",
                        }}
                      >
                        Code
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <HeaderActions user={user} projectId={project?.id} />
                </div>

                {/* Content Area */}
                <div
                  className="flex-1 overflow-hidden"
                  style={{ backgroundColor: "var(--zen-bg)" }}
                >
                  {activeView === "preview" ? (
                    <div className="h-full p-6">
                      <div
                        className="h-full rounded-lg overflow-hidden"
                        style={{
                          backgroundColor: "var(--zen-surface)",
                          border: `1px solid var(--zen-border)`,
                          boxShadow: "var(--zen-shadow)",
                        }}
                      >
                        <PreviewFrame />
                      </div>
                    </div>
                  ) : (
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="h-full"
                    >
                      {/* File Tree */}
                      <ResizablePanel
                        defaultSize={30}
                        minSize={20}
                        maxSize={50}
                      >
                        <div
                          className="h-full"
                          style={{
                            backgroundColor: "var(--zen-surface)",
                            borderRight: `1px solid var(--zen-border)`,
                          }}
                        >
                          <div
                            className="px-4 py-3"
                            style={{ borderBottom: `1px solid var(--zen-border)` }}
                          >
                            <span
                              className="text-xs font-semibold uppercase tracking-wide"
                              style={{ color: "var(--zen-text-muted)" }}
                            >
                              Files
                            </span>
                          </div>
                          <FileTree />
                        </div>
                      </ResizablePanel>

                      <ResizableHandle
                        className="w-px"
                        style={{ backgroundColor: "var(--zen-border)" }}
                      />

                      {/* Code Editor */}
                      <ResizablePanel defaultSize={70}>
                        <div
                          className="h-full"
                          style={{ backgroundColor: "var(--zen-surface)" }}
                        >
                          <CodeEditor />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ChatProvider>
    </FileSystemProvider>
    </ThemeProvider>
  );
}
