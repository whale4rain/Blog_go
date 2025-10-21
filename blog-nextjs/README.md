# Inspiration Blog - Next.js Edition

A modern, high-performance blog platform built with Next.js 14, React 18, TypeScript, and Tailwind CSS, featuring a clean Google-inspired design.

## 🎨 Design Philosophy

This project follows Google's Material Design principles:
- **Minimalist**: Clean interfaces with ample whitespace
- **Fast**: Optimized for performance and quick loading
- **Accessible**: ARIA labels, keyboard navigation, high contrast
- **Responsive**: Mobile-first design that works on all devices

## ✨ Features

### Core Functionality
- 📝 **Article Management**: Create, read, update, and delete articles with rich text support
- 🔍 **Advanced Search**: Full-text search with category and tag filtering
- 💬 **Comments System**: Nested comments with reply functionality
- 👤 **User Authentication**: JWT-based login/registration
- 🎨 **Rich Text Editor**: Markdown support for article content
- 📊 **Admin Dashboard**: Comprehensive management interface
- 🏷️ **Tags & Categories**: Organize content efficiently
- 📱 **Responsive Design**: Seamless experience across all devices

### Technical Features
- ⚡ **Next.js 14 App Router**: Modern routing with server components
- 🎯 **TypeScript**: Full type safety throughout the application
- 🎨 **Tailwind CSS**: Utility-first styling with custom Google theme
- 🔄 **Zustand**: Lightweight state management
- 📡 **Axios**: Type-safe API client with interceptors
- 🚀 **Performance Optimized**: Code splitting, lazy loading, image optimization
- ♿ **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- 🔒 **Security**: XSS protection, CSRF tokens, secure headers

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Go Backend**: The backend API server must be running (see `../server/`)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd go_blog/blog-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update the values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=Inspiration Blog
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start the Backend Server

Make sure your Go backend is running on `http://localhost:8080`:

```bash
cd ../server
go run main.go
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

```
blog-nextjs/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public pages group
│   │   ├── page.tsx            # Home page
│   │   ├── about/              # About page
│   │   ├── search/             # Search/Archive page
│   │   └── article/[id]/       # Article detail page
│   ├── dashboard/               # Admin dashboard
│   │   ├── page.tsx            # Dashboard home
│   │   ├── articles/           # Article management
│   │   ├── images/             # Image management
│   │   └── layout.tsx          # Dashboard layout
│   ├── login/                   # Login page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx          # Site header/navbar
│   │   └── Footer.tsx          # Site footer
│   ├── ui/                      # UI components
│   │   ├── Button.tsx          # Button component
│   │   ├── Input.tsx           # Input component
│   │   ├── Card.tsx            # Card component
│   │   └── ...                 # Other UI components
│   └── features/                # Feature-specific components
│       ├── ArticleCard.tsx     # Article card
│       ├── CommentList.tsx     # Comment list
│       └── ...                 # Other features
├── lib/                         # Core libraries
│   ├── api/                    # API functions
│   │   ├── client.ts          # Axios client
│   │   ├── article.ts         # Article API
│   │   ├── user.ts            # User API
│   │   └── comment.ts         # Comment & other APIs
│   ├── store/                  # Zustand stores
│   │   ├── userStore.ts       # User state
│   │   └── uiStore.ts         # UI state
│   └── utils/                  # Utility functions
│       └── index.ts           # Helper functions
├── types/                       # TypeScript types
│   └── index.ts                # Type definitions
├── public/                      # Static assets
│   ├── favicon.ico             # Favicon
│   └── images/                 # Images
├── .env.local                   # Environment variables
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies

```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server (port 3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🎨 Key Technologies

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **Axios**: HTTP client

### UI/UX
- **Lucide React**: Icon library
- **React Markdown**: Markdown rendering
- **date-fns**: Date formatting
- **clsx + tailwind-merge**: Class name utilities

## 🌈 Design System

### Colors (Google-inspired)
```css
--google-blue: #4285f4    /* Primary actions */
--google-green: #34a853   /* Success states */
--google-yellow: #fbbc05  /* Warning states */
--google-red: #ea4335     /* Error states */
```

### Typography
- Font Family: Inter (fallback to system fonts)
- Sizes: xs (12px) → 4xl (36px)
- Line Heights: Optimized for readability

### Spacing
- Scale: 4px base unit (1, 2, 3, 4, 6, 8, 12, 16, 20, 24px)
- Consistent padding and margins

### Shadows
- Subtle elevation with Google-style shadows
- Light diffusion for depth

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px)

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px)

/* Desktop */
@media (min-width: 1025px)
```

## 🔐 Authentication Flow

1. User submits login credentials
2. Backend validates and returns JWT token
3. Token stored in localStorage and Zustand store
4. Axios interceptor adds token to all requests
5. Protected routes check authentication status
6. Token refresh handled automatically

## 📡 API Integration

All API calls are made through centralized functions in `lib/api/`:

```typescript
import { getArticleList, getArticleById } from '@/lib/api/article';

// Fetch articles
const articles = await getArticleList({ page: 1, page_size: 10 });

// Fetch single article
const article = await getArticleById(123);
```

## 🎯 Core Pages

### Public Pages
- **Home (`/`)**: Featured articles, categories, tags
- **Article Detail (`/article/[id]`)**: Full article with comments
- **Search/Archive (`/search`)**: Search and filter articles
- **About (`/about`)**: About the blog
- **Login (`/login`)**: User authentication

### Protected Pages (Dashboard)
- **Dashboard Home (`/dashboard`)**: Overview and statistics
- **Articles (`/dashboard/articles`)**: Manage articles
- **Images (`/dashboard/images`)**: Manage images
- **User Center (`/dashboard/user-center`)**: Profile settings

## 🚧 State Management

### User Store (Zustand)
```typescript
const { user, isLoggedIn, login, logout } = useUserStore();
```

### UI Store (Zustand)
```typescript
const { 
  sidebarOpen, 
  loginModalOpen, 
  openLoginModal, 
  closeLoginModal 
} = useUIStore();
```

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_URL`: Application URL

### Next.js Config
- Image optimization for remote patterns
- Security headers (X-Frame-Options, CSP, etc.)
- Custom redirects and rewrites

## 📊 Performance Optimization

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Lazy Loading**: Components and images loaded on demand
- **Caching**: Browser caching with proper headers
- **Compression**: Gzip/Brotli compression enabled

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators
- Skip to content link

## 🐛 Troubleshooting

### Common Issues

**Issue**: `Cannot connect to API`
- **Solution**: Ensure backend server is running on port 8080

**Issue**: `Module not found`
- **Solution**: Run `npm install` to install dependencies

**Issue**: `Port 3000 already in use`
- **Solution**: Kill the process or use a different port:
  ```bash
  PORT=3001 npm run dev
  ```

**Issue**: `Type errors`
- **Solution**: Run `npm run type-check` to see detailed errors

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Test thoroughly
5. Submit a pull request

## 📝 Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Prefer composition over inheritance
- Write self-documenting code
- Add comments for complex logic

## 🔒 Security

- XSS protection via React's built-in sanitization
- CSRF tokens for mutations
- Secure headers configured
- Input validation on frontend and backend
- JWT tokens with expiration
- HTTPS in production

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables in Production
Set the following in your deployment platform:
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

This project is part of the Go Blog application.

## 👥 Support

For issues and questions:
- Check the troubleshooting section
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ using Next.js and Google-inspired design principles**