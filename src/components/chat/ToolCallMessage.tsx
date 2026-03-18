"use client";

import type { ReactNode } from "react";
import { FileEdit, FileCode, Trash2, ArrowRightLeft, Eye, Loader2, AlertCircle } from "lucide-react";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: string;
  args: {
    command?: string;
    path?: string;
    new_path?: string;
    [key: string]: any;
  };
  result?: any;
}

interface ToolCallMessageProps {
  toolInvocation: ToolInvocation;
}

function getToolCallDescription(toolInvocation: ToolInvocation): {
  icon: ReactNode;
  message: string;
} {
  const { toolName, args } = toolInvocation;
  const command = args?.command;
  const path = args?.path;
  const newPath = args?.new_path;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return {
          icon: <FileCode className="w-3 h-3" />,
          message: `Creating ${path}`,
        };
      case "str_replace":
      case "insert":
        return {
          icon: <FileEdit className="w-3 h-3" />,
          message: `Editing ${path}`,
        };
      case "view":
        return {
          icon: <Eye className="w-3 h-3" />,
          message: `Viewing ${path}`,
        };
      default:
        return {
          icon: <FileEdit className="w-3 h-3" />,
          message: `Modifying ${path || "file"}`,
        };
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "delete":
        return {
          icon: <Trash2 className="w-3 h-3" />,
          message: `Deleting ${path}`,
        };
      case "rename":
        return {
          icon: <ArrowRightLeft className="w-3 h-3" />,
          message: `Renaming ${path} to ${newPath}`,
        };
      default:
        return {
          icon: <ArrowRightLeft className="w-3 h-3" />,
          message: `Managing ${path || "file"}`,
        };
    }
  }

  // Fallback for unknown tools
  return {
    icon: <FileEdit className="w-3 h-3" />,
    message: toolName,
  };
}

export function ToolCallMessage({ toolInvocation }: ToolCallMessageProps) {
  const { icon, message } = getToolCallDescription(toolInvocation);
  const isError = toolInvocation.state === "error";
  const isComplete =
    !isError && toolInvocation.state === "result" && toolInvocation.result;

  const iconToRender = isError ? (
    <AlertCircle className="w-3 h-3 text-red-600" />
  ) : (
    icon
  );

  const messageText = isError ? `Failed: ${message}` : message;
  const textColor = isError ? "text-red-700" : "text-neutral-700";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
          <div className={`flex items-center gap-1.5 ${textColor}`}>
            {iconToRender}
            <span className="font-medium">{messageText}</span>
          </div>
        </>
      ) : isError ? (
        <>
          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
          <div className={`flex items-center gap-1.5 ${textColor}`}>
            {iconToRender}
            <span className="font-medium">{messageText}</span>
          </div>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
          <div className={`flex items-center gap-1.5 ${textColor}`}>
            {iconToRender}
            <span className="font-medium">{messageText}</span>
          </div>
        </>
      )}
    </div>
  );
}
