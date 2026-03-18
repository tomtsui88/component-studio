# Component Studio

AI-powered React component generator with live preview.

## Features

- 🤖 AI-powered component generation using Azure OpenAI
- 👁️ Live preview with instant hot reload
- 📁 Virtual file system (no files written to disk during generation)
- ✨ Syntax highlighting with Monaco code editor
- 💾 Component persistence for registered users
- 🎨 Beautiful flat design with calm, readable interface
- 🔓 Anonymous usage supported (work saved in session)
- 📤 Export generated code


## Prerequisites

- Node.js 18+
- npm or pnpm

## Setup

### 1. Configure Azure OpenAI (Optional)

Create a `.env` file in the project root and add your Azure OpenAI credentials:

```env
AZURE_API_KEY=your-azure-api-key
AZURE_RESOURCE_NAME=your-azure-resource-name
AZURE_DEPLOYMENT_NAME=gpt-4.1
```

**Note:** The project will run without API credentials using a mock provider that generates static example components. To use real AI generation, you need Azure OpenAI access.

### 2. Install Dependencies and Initialize Database

```bash
npm run setup
```

This command will:
- Install all dependencies
- Generate Prisma client
- Run database migrations

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Usage

### For Anonymous Users
1. Open the app - no signup required
2. Describe the React component you want in the chat
3. View the generated component in real-time preview
4. Switch to Code view to see and edit files
5. Continue iterating with AI to refine components
6. **Note:** Work is saved in browser session only (lost on close)

### For Registered Users
1. Click "Sign Up" to create an account
2. All your projects are saved to the database
3. Access your work from any device
4. Create multiple projects
5. Switch between projects easily

## Tech Stack

- **Frontend:** Next.js 15 with App Router, React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Prisma ORM with SQLite
- **AI:** Azure OpenAI GPT-4 (with mock provider fallback)
- **AI SDK:** Vercel AI SDK
- **Code Editor:** Monaco Editor (VS Code engine)
- **Authentication:** JWT-based with bcrypt

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/chat/          # AI chat endpoint
│   └── [projectId]/       # Dynamic project routes
├── components/            # React components
│   ├── auth/             # Authentication dialogs
│   ├── chat/             # Chat interface
│   ├── editor/           # Code editor & file tree
│   ├── preview/          # Live preview frame
│   └── ui/               # Reusable UI components
├── lib/                  # Core utilities
│   ├── contexts/         # React contexts
│   ├── tools/            # AI tools (file operations)
│   ├── transform/        # JSX transformer
│   ├── file-system.ts    # Virtual file system
│   ├── provider.ts       # AI provider configuration
│   └── auth.ts           # Authentication logic
└── actions/              # Server actions

prisma/
└── schema.prisma         # Database schema
```

## Development Commands

```bash
# Run development server
npm run dev

# Run in background (logs to logs.txt)
npm run dev:daemon

# Run tests
npm test

# Run specific test file
npx vitest run src/path/to/test.test.tsx

# Build for production
npm run build

# Database commands
npm run db:reset          # Reset database (WARNING: deletes all data)
npx prisma studio         # Open database GUI
npx prisma generate       # Regenerate Prisma client
npx prisma migrate dev    # Create and apply migration
```

## How It Works

1. **User Input:** Describe a component in natural language
2. **AI Processing:** Azure OpenAI generates component code
3. **Tool Execution:** AI uses tools to create/edit files in virtual file system
4. **JSX Transform:** Babel transpiles JSX to JavaScript with import maps
5. **Live Preview:** Component renders in isolated iframe with esm.sh CDN
6. **Persistence:** Registered users' work saves to SQLite database

## Virtual File System

All generated code lives in an in-memory virtual file system:
- No files written to disk during generation
- Changes tracked and serialized for database storage
- Supports full file operations (create, edit, delete, rename)
- Preserves file tree structure

## Browser Support

- Modern browsers with ES modules support
- Chrome, Firefox, Safari, Edge (latest versions)

## Contributing

This is a demo project showcasing AI-powered component generation with a beautiful, calm interface design.

## License

MIT
