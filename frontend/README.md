# Posity Frontend 🎨

The frontend application for Posity blog platform built with React, TypeScript, and modern web technologies.

## 🚀 Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** for beautiful UI components
- **TipTap** for rich text editing
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** with **Zod** for form validation
- **Zustand** for state management
- **Lucide React** for icons

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── auth/          # Authentication components
│   │   ├── blog/          # Blog-related components
│   │   └── layout/        # Layout components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── services/          # API service functions
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global styles
├── public/                # Static assets
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Getting Started

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**

   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

5. **Start development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📱 Features

### Authentication

- User registration with email verification
- Secure login/logout
- Password reset with OTP
- Protected routes and role-based access

### Blog Management

- Rich text editor with TipTap
- Create, edit, and delete posts
- Image upload and management
- Category-based filtering
- Pagination support

### User Experience

- Responsive design for all devices
- Loading states and error handling
- Toast notifications
- Form validation with Zod schemas

### Admin Features

- User role management
- Category management
- User analytics dashboard

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🎨 Styling

### TailwindCSS

This project uses TailwindCSS for utility-first styling:

- Responsive design classes
- Custom color palette
- Component-based styling

### shadcn/ui Components

Pre-built, accessible components:

- Button, Input, Card, Dialog
- Form components with validation
- Navigation and layout components

### Custom Themes

- Consistent color scheme
- Typography scale

## 📋 Form Validation

### Zod Integration

This project uses Zod for runtime type validation:

- Schema-based form validation
- TypeScript type inference
- Custom validation rules
- Error message handling

### React Hook Form

Form management with:

- Optimized re-renders
- Built-in validation
- Easy form state management
- Integration with Zod schemas

**Example Usage:**

```typescript
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const form = useForm<z.infer<typeof loginSchema>>({
  resolver: zodResolver(loginSchema),
});
```

## 🔌 API Integration

### Services

Located in `src/services/`:

- `authService.ts` - Authentication APIs
- `blogService.ts` - Blog post operations
- `userService.ts` - User management
- `categoryService.ts` - Category operations

### HTTP Client

Using Axios with:

- Request/response interceptors
- Authentication token handling
- Error handling middleware
- Base URL configuration

## 🧩 Components Architecture

### Component Structure

```
components/
├── ui/              # Base UI components (shadcn/ui)
├── auth/            # Authentication forms
├── blog/            # Blog-specific components
├── layout/          # App layout components
└── common/          # Shared components
```

### Key Components

- **BlogEditor**: Rich text editor with TipTap
- **AuthForms**: Login, register, reset password
- **PostCard**: Blog post preview component
- **Navigation**: Header and navigation
- **ProtectedRoute**: Route protection wrapper

## 🚀 Deployment

### Build Process

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Environment Variables

For production deployment, ensure these environment variables are set:

```env
VITE_API_URL=https://your-backend-api.com/api/v1
```

### Deployment Platforms

- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use custom hooks for logic reuse
- Implement proper error boundaries

## 🗄️ State Management

### Zustand Store

This project uses Zustand for lightweight state management:

- Simple, unopinionated state management
- TypeScript support
- No boilerplate code
- Excellent performance

**Store Structure:**

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### Store Organization

- `authStore.ts` - Authentication state
- `blogStore.ts` - Blog posts and categories

### Performance

- Code splitting with React.lazy()
- Image optimization
- Bundle size monitoring
- Lazy loading for large components

## 🐛 Troubleshooting

### Common Issues

**1. Vite dev server not starting:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**2. API connection issues:**

- Check `VITE_API_URL` in `.env`
- Ensure backend server is running
- Verify CORS configuration

**3. Build failures:**

```bash
npm run type-check  # Check for TypeScript errors
npm run lint        # Check for linting issues
```

**4. Styling issues:**

- Clear browser cache
- Check TailwindCSS classes
- Verify shadcn/ui component imports

## 📖 Documentation Links

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TipTap Editor](https://tiptap.dev/)

## 🤝 Contributing

1. Follow the existing code structure
2. Write TypeScript types for new components
3. Add proper error handling
4. Test responsive design
5. Update documentation for new features

## 📝 License

This project is part of the Posity application and follows the same [MIT License](../LICENSE).

---

For backend API documentation, see [Backend README](../backend/README.md)  
For Docker setup, see [Docker README](../DOCKER.md)  
For general project info, see [Main README](../README.md)
