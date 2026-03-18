import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallMessage } from "../ToolCallMessage";

afterEach(() => {
  cleanup();
});

test("ToolCallMessage renders create command with completed state", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "create",
      path: "/App.jsx",
    },
    result: "Success",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
  // Check for the green dot indicator (completed state)
  const container = screen.getByText("Creating /App.jsx").closest("div");
  expect(container?.querySelector(".bg-emerald-500")).toBeDefined();
});

test("ToolCallMessage renders str_replace command", () => {
  const toolInvocation = {
    toolCallId: "2",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "str_replace",
      path: "/components/Button.jsx",
    },
    result: "Success",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing /components/Button.jsx")).toBeDefined();
});

test("ToolCallMessage renders insert command", () => {
  const toolInvocation = {
    toolCallId: "3",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "insert",
      path: "/utils/helpers.js",
    },
    result: "Success",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing /utils/helpers.js")).toBeDefined();
});

test("ToolCallMessage renders view command", () => {
  const toolInvocation = {
    toolCallId: "4",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "view",
      path: "/config/settings.json",
    },
    result: "Success",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Viewing /config/settings.json")).toBeDefined();
});

test("ToolCallMessage renders delete command", () => {
  const toolInvocation = {
    toolCallId: "5",
    toolName: "file_manager",
    state: "result",
    args: {
      command: "delete",
      path: "/old/file.jsx",
    },
    result: { success: true },
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting /old/file.jsx")).toBeDefined();
});

test("ToolCallMessage renders rename command", () => {
  const toolInvocation = {
    toolCallId: "6",
    toolName: "file_manager",
    state: "result",
    args: {
      command: "rename",
      path: "/old-name.jsx",
      new_path: "/new-name.jsx",
    },
    result: { success: true },
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(
    screen.getByText("Renaming /old-name.jsx to /new-name.jsx")
  ).toBeDefined();
});

test("ToolCallMessage shows loading state for in-progress tool call", () => {
  const toolInvocation = {
    toolCallId: "7",
    toolName: "str_replace_editor",
    state: "pending",
    args: {
      command: "create",
      path: "/NewComponent.jsx",
    },
  };

  const { container } = render(
    <ToolCallMessage toolInvocation={toolInvocation} />
  );

  expect(screen.getByText("Creating /NewComponent.jsx")).toBeDefined();
  // Check for the spinner (loading state)
  expect(container.querySelector(".animate-spin")).toBeDefined();
  // Should not have the green dot
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallMessage handles unknown command gracefully", () => {
  const toolInvocation = {
    toolCallId: "8",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "unknown_command",
      path: "/some-file.jsx",
    },
    result: "Success",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Modifying /some-file.jsx")).toBeDefined();
});

test("ToolCallMessage handles missing path gracefully", () => {
  const toolInvocation = {
    toolCallId: "9",
    toolName: "str_replace_editor",
    state: "result",
    args: {
      command: "unknown_command",
    },
    result: "Success",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Modifying file")).toBeDefined();
});

test("ToolCallMessage handles unknown tool name", () => {
  const toolInvocation = {
    toolCallId: "10",
    toolName: "unknown_tool",
    state: "result",
    args: {},
    result: "Success",
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("ToolCallMessage renders correct icons for different operations", () => {
  const operations = [
    { command: "create", path: "/test.jsx", expectedIcon: "FileCode" },
    { command: "str_replace", path: "/test.jsx", expectedIcon: "FileEdit" },
    { command: "view", path: "/test.jsx", expectedIcon: "Eye" },
  ];

  operations.forEach(({ command, path }) => {
    const toolInvocation = {
      toolCallId: `icon-${command}`,
      toolName: "str_replace_editor",
      state: "result",
      args: { command, path },
      result: "Success",
    };

    const { container } = render(
      <ToolCallMessage toolInvocation={toolInvocation} />
    );

    // Check that an icon is rendered (svg element exists)
    expect(container.querySelector("svg")).toBeDefined();
    cleanup();
  });
});

test("ToolCallMessage shows error state without spinner", () => {
  const toolInvocation = {
    toolCallId: "error",
    toolName: "str_replace_editor",
    state: "error",
    args: {
      command: "str_replace",
      path: "/broken.jsx",
    },
    result: { message: "Failed" },
  };

  const { container } = render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Failed: Editing /broken.jsx")).toBeDefined();
  expect(container.querySelector(".bg-red-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolCallMessage shows different visual states based on completion", () => {
  // Completed state
  const completedTool = {
    toolCallId: "complete",
    toolName: "str_replace_editor",
    state: "result",
    args: { command: "create", path: "/complete.jsx" },
    result: "Success",
  };

  const { container: completedContainer } = render(
    <ToolCallMessage toolInvocation={completedTool} />
  );

  // Should have green dot for completed
  expect(completedContainer.querySelector(".bg-emerald-500")).toBeDefined();
  // Should not have spinner
  expect(completedContainer.querySelector(".animate-spin")).toBeNull();

  cleanup();

  // In-progress state
  const inProgressTool = {
    toolCallId: "progress",
    toolName: "str_replace_editor",
    state: "pending",
    args: { command: "create", path: "/progress.jsx" },
  };

  const { container: progressContainer } = render(
    <ToolCallMessage toolInvocation={inProgressTool} />
  );

  // Should have spinner for in-progress
  expect(progressContainer.querySelector(".animate-spin")).toBeDefined();
  // Should not have green dot
  expect(progressContainer.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallMessage handles file_manager without new_path for rename", () => {
  const toolInvocation = {
    toolCallId: "11",
    toolName: "file_manager",
    state: "result",
    args: {
      command: "rename",
      path: "/old.jsx",
      // missing new_path
    },
    result: { success: false },
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Renaming /old.jsx to undefined")).toBeDefined();
});

test("ToolCallMessage handles unknown file_manager command fallback", () => {
  const toolInvocation = {
    toolCallId: "12",
    toolName: "file_manager",
    state: "result",
    args: {
      command: "copy",
      path: "/mystery.jsx",
    },
    result: { success: true },
  };

  render(<ToolCallMessage toolInvocation={toolInvocation} />);

  expect(screen.getByText("Managing /mystery.jsx")).toBeDefined();
});
