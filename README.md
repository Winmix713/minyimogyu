# WinMix TipsterHub

A modern football analytics and prediction platform built with React 18, TypeScript, Vite, and Tailwind CSS.

## 🚀 Technology Stack

- **Frontend**: React 18.3.1 with TypeScript 5.9+
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.0
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd winmix-tipsterhub
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment variables

Copy the environment template and configure your variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- `VITE_API_BASE_URL`: Your API base URL
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

### 4. Development

Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run test` - Run tests with Vitest

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── lib/           # Utility functions and configurations
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── utils/         # Helper utilities
├── test/          # Test setup and utilities
├── App.tsx        # Main application component
├── main.tsx       # Application entry point
└── index.css      # Global styles with Tailwind
```

## 🔧 Configuration

### TypeScript

The project uses strict TypeScript mode with path aliases:
- `~/` → `src/`
- `@/components/` → `src/components/`
- `@/pages/` → `src/pages/`
- `@/lib/` → `src/lib/`
- `@/hooks/` → `src/hooks/`
- `@/types/` → `src/types/`
- `@/utils/` → `src/utils/`

### ESLint & Prettier

- ESLint is configured with React and TypeScript rules
- Prettier formats code with 2 spaces, semicolons, and trailing commas
- Run `pnpm run format` to format all files

### Tailwind CSS

- Uses Tailwind CSS 4.0 with PostCSS
- Configuration in `tailwind.config.js`
- Responsive design utilities included

## 🚀 Deployment

### Vercel

The project is configured for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build

```bash
pnpm run build
```

The build output will be in the `dist/` directory.

## 🧪 Testing

Run tests with:

```bash
pnpm run test
```

Tests are configured with:
- Vitest as the test runner
- React Testing Library for component testing
- jsdom environment for DOM testing
- Global test setup in `src/test/setup.ts`

## 🔄 CI/CD

GitHub Actions pipeline includes:
- Node.js 18.x and 20.x matrix testing
- Dependency installation with pnpm
- Linting and type checking
- Test execution
- Production build verification

## 📊 Monitoring & Analytics

The application includes:
- Error boundaries for graceful error handling
- Performance monitoring setup
- Analytics integration points

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Links

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
