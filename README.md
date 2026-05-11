# Let's Learn Language 🌍

A React Native mobile app built with [Expo](https://expo.dev) for learning languages. This project uses file-based routing with [Expo Router](https://docs.expo.dev/router/introduction) for a modern app structure.

## 📁 Project Structure

```
letslearnlanguage/
├── app/                          # File-based routing (Expo Router)
│   ├── _layout.tsx              # Root layout & main navigation setup
│   ├── modal.tsx                # Modal screen (example)
│   └── (tabs)/                  # Tab-based navigation group
│       ├── _layout.tsx          # Tab layout with bottom tabs
│       ├── index.tsx            # Home screen (first tab)
│       └── explore.tsx          # Explore screen (second tab)
├── components/                   # Reusable UI components
│   ├── ThemedText.tsx           # Text component with theme support
│   ├── ThemedView.tsx           # View component with theme support
│   ├── ui/                      # Atomic UI components
│   │   ├── Collapsible.tsx      # Collapsible/expandable component
│   │   ├── IconSymbol.tsx       # Icon component
│   │   └── ...
│   └── ...
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts      # Device color scheme detection
│   ├── use-theme-color.ts       # Theme color management
│   └── ...
├── types/                        # TypeScript types & interfaces
│   └── index.ts                 # Centralized type definitions
├── utils/                        # Helper functions & utilities
│   └── index.ts                 # String formatters, validators, etc.
├── services/                     # API calls & business logic
│   └── index.ts                 # API client setup and endpoints
├── constants/                    # App-wide constants
│   └── theme.ts                 # Theme colors & styling constants
├── assets/                       # Static files (images, fonts, icons)
│   └── images/                  # Image assets
├── scripts/                      # Utility scripts
│   └── reset-project.js         # Reset to blank app
├── app.json                      # Expo app configuration
├── eas.json                      # EAS build & submit configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies & scripts
```

## 📖 Folder Details

### `app/` - File-Based Routing
Contains all screens and navigation structure. Uses [Expo Router](https://docs.expo.dev/router/introduction) for automatic routing based on file paths.

**Key files:**
- `_layout.tsx` — Defines navigation structure (tabs, stacks, modals)
- `index.tsx` — Default screen for a folder (home page)
- `modal.tsx` — Modal screens accessible from other screens

**How routing works:**
- `/` → `app/(tabs)/index.tsx`
- `/explore` → `app/(tabs)/explore.tsx`
- `/modal` → `app/modal.tsx`

### `components/` - Reusable UI Components
Shared, reusable React components used across multiple screens. Prevents code duplication and maintains consistency.

**Examples:**
- `ThemedText.tsx` — Text that adapts to light/dark theme
- `Collapsible.tsx` — Expandable sections
- `IconSymbol.tsx` — Icon rendering

### `hooks/` - Custom React Hooks
Encapsulates shared logic that can be used in any component.

**Examples:**
- `use-color-scheme.ts` — Detects system dark/light mode preference
- `use-theme-color.ts` — Gets current theme color values

### `types/` - TypeScript Types
Centralized location for all custom TypeScript types and interfaces. Improves type safety and prevents duplication.

**Examples:**
- `User` — User data type
- `ApiResponse<T>` — Generic API response wrapper
- Custom domain models

### `utils/` - Helper Functions
Pure utility functions for common operations like formatting, validation, and calculations.

**Examples:**
- `toTitleCase()` — String formatter
- `isValidEmail()` — Email validator
- Date utilities, math helpers, etc.

### `services/` - API & Business Logic
Handles all external API calls and business logic. Keeps API details separate from UI components.

**Examples:**
- `userService.getUser()` — Fetch user data
- `userService.updateUser()` — Update user info
- API client configuration and base URLs

### `constants/` - App Constants
Centralized constants used throughout the app (theme colors, API URLs, etc.).

**Includes:**
- Theme colors and styling values
- API endpoints and configuration
- String literals and enums

### `assets/` - Static Files
Images, fonts, icons, and other static resources.

**Organized by:**
- `images/` — App icons, splash screens, in-app images

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development
For Expo Go (fast, requires QR scan):
```bash
npx expo start
```

For Development Client (supports native modules):
```bash
npx expo start --dev-client
```

### 3. Build & Deploy

**Development APK** (for testing):
```bash
eas build --platform android --profile development
```

**Production APK** (for release):
```bash
eas build --platform android --profile production
```

## � Supabase Authentication Setup

This app uses [Supabase](https://supabase.com) for user authentication. Follow these steps to set up:

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to **Settings** > **API** to find your credentials:
   - Project URL
   - Anon (public) Key

### 2. Add Credentials to Your App
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Restart Metro: `npx expo start -c` (clear cache)

### 3. Authentication Features
- **Sign Up**: Create a new account with email/password
- **Sign In**: Log in with existing credentials
- **Session Persistence**: Sessions persist across app restarts
- **Sign Out**: Clear session and return to login

### 4. Database Setup (Optional)
To store user lessons or quiz data:
1. In Supabase dashboard, go to **SQL Editor**
2. Create tables for your data (e.g., `lessons`, `quiz_results`)
3. Set up Row Level Security (RLS) policies for user data
4. Call Supabase API from `services/` folder

## �📋 Common Tasks

### Add a New Screen
1. Create a new file in `app/` (e.g., `app/settings.tsx`)
2. Expo Router automatically creates the route

### Create a Reusable Component
1. Add to `components/` (e.g., `components/my-button.tsx`)
2. Import and use in screens

### Add Helper Functions
1. Add to `utils/index.ts`
2. Import as: `import { myHelper } from '@/utils'`

### Add API Calls
1. Add to `services/index.ts`
2. Import and use in components or hooks

## 🔗 Links

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
