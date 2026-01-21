# Kitchen Services

A comprehensive platform connecting customers with professional kitchen service technicians.

## 🚀 Features

- **Next.js 14.2.0** - Latest version with improved performance and features
- **React 18.2.0** - Latest React version with enhanced capabilities
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **TypeScript** - Strongly typed programming language that builds on JavaScript
- **Recharts** - Declarative charting library built on D3
- **Heroicons** - Beautiful hand-crafted SVG icons

## 📋 Prerequisites

- Node.js (v18.x or higher)
- npm or yarn


## 🛠️ Installation

1. Install dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```

2. Start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
3. Open [http://localhost:4028](http://localhost:4028) with your browser to see the result.

## 📁 Project Structure

```
# Kitchen Services Application

This is a Next.js application for connecting customers with kitchen service technicians.
├── public/             # Static assets
├── src/
│   ├── app/            # App router components
│   │   ├── book-a-service/
│   │   │   ├── components/
│   │   │   └── page.tsx
│   │   ├── find-a-technician/
│   │   │   ├── components/
│   │   │   └── page.tsx
│   │   ├── for-technicians/
│   │   │   ├── components/
│   │   │   └── page.tsx
│   │   ├── homepage/
│   │   │   ├── components/
│   │   │   └── page.tsx
│   │   ├── how-it-works/
│   │   │   ├── components/
│   │   │   └── page.tsx
│   │   ├── technician-profiles/
│   │   │   ├── components/
│   │   │   └── page.tsx
│   │   ├── layout.tsx  # Root layout component
│   │   └── not-found.tsx
│   ├── components/     # Reusable UI components
│   └── styles/         # Global styles and Tailwind configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration
```
```

## 📖 Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Runs the built application
- `npm run lint` - Runs ESLint
- `npm run lint:fix` - Runs ESLint and fixes auto-fixable issues
- `npm run format` - Formats code with Prettier
- `npm run serve` - Serves the built application
- `npm run type-check` - Runs TypeScript type checking

## 🚀 Deployment

### Vercel Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to a GitHub repository
2. Sign up/in to Vercel
3. Create a new project and import your repository
4. Vercel will automatically detect the Next.js framework and configure the build settings
5. Deploy!

### Netlify Deployment

This project also includes Netlify plugin support for easy deployment:

1. Push your code to a GitHub repository
2. Sign up/in to Netlify
3. Create a new site from Git
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Deploy!

## 🗄 Supabase Database Setup

This project uses Supabase for authentication and database management. The database schema and configuration are located in the `supabase/` directory.

### Configuration

Create a `.env.local` file in the project root with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

You can find these values in your [Supabase Dashboard](https://app.supabase.com) under Project Settings > API.

See `.env.example` for a template.

### Database Schema

The database includes:

- **Profiles table**: User accounts and authentication
- **Technicians table**: Service provider information
- **Services table**: Available service catalog
- **Bookings table**: Service booking management
- **Reviews table**: Customer feedback system

For detailed setup instructions, please see [README_SUPABASE_SETUP.md](./README_SUPABASE_SETUP.md).