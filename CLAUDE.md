# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies, generate Prisma client, run migrations
npm run setup

# Development server (Turbopack)
npm run dev

# Run all tests
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx

# Lint
npm run lint

# Build for production
npm run build

# Reset database (destructive)
npm run db:reset
```

## Architecture

**Component Studio** is an AI-powered React component generator with live preview. Users describe components in natural language; an AI generates React code that runs in a sandboxed iframe.

### Request flow

```
Chat input → POST /api/chat (streaming) → Vercel AI SDK streamText
    → AI tools (str_replace_editor, file_manager)
    → FileSystemContext (in-memory virtual FS)
    → PreviewFrame (iframe + Babel JSX transform) + CodeEditor (Monaco)
    → Prisma/SQLite (if authenticated)
```

### Key directories

- `src/app/api/chat/route.ts` — AI streaming endpoint; configures model, tools, and system prompt
- `src/lib/provider.ts` — AI provider factory: Azure OpenAI GPT-4.1 in prod, `MockLanguageModel` when env vars are absent
- `src/lib/prompts/generation.tsx` — System prompt instructing the AI to write React + Tailwind components
- `src/lib/tools/` — Two AI tools: `str_replace_editor` (create/view/replace files) and `file_manager` (rename/delete)
- `src/lib/file-system.ts` — In-memory virtual file system (Map-based tree); serialized to JSON for DB storage
- `src/lib/transform/jsx-transformer.ts` — Client-side Babel transpiler turning JSX → JS for the preview iframe
- `src/lib/contexts/` — `FileSystemContext` (virtual FS state) and `ChatContext` (Vercel AI SDK `useChat` wrapper)
- `src/app/main-content.tsx` — Root layout: three resizable panels (chat | preview | code editor)
- `src/actions/` — Next.js Server Actions for auth and project CRUD
- `src/lib/auth.ts` — JWT sessions via `jose`; cookie `auth-token`, 7-day expiry

### Data model (Prisma/SQLite)

- `User` — email + bcrypt password
- `Project` — belongs to optional `User`; `messages` (JSON chat history) and `data` (serialized virtual FS)

Anonymous projects exist only in browser session; authenticated projects are persisted to the database.

### AI provider

Set these environment variables to use the real model:
```
AZURE_API_KEY=
AZURE_RESOURCE_NAME=
AZURE_DEPLOYMENT_NAME=
JWT_SECRET=          # defaults to "development-secret-key"
```

Without `AZURE_API_KEY`, the app falls back to `MockLanguageModel` which returns a static example component.

### Path alias

`@/*` resolves to `src/*` (configured in `tsconfig.json` and `vitest.config.mts`).
