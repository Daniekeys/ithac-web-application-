# ITHAC Learning Management System - Stage 1

A modern Learning Management System built with Next.js 14, TypeScript, and REST API integration.

## 🚀 Stage 1 - Authentication & Base Setup ✅

### Features Implemented

- ✅ **Full folder structure** with App Router
- ✅ **Base configuration** (Tailwind, shadcn/ui, global layout)
- ✅ **HTTP client** (Axios with interceptors)
- ✅ **React Query** for data fetching
- ✅ **Zustand** for state management
- ✅ **Authentication system** (login/register)
- ✅ **Route protection** middleware
- ✅ **Login & Register** UI pages
- ✅ **User & Admin** dashboard pages
- ✅ **/me endpoint** integration for user profile

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query + Axios
- **Forms**: React Hook Form + Zod
- **Authentication**: HttpOnly cookies
- **Icons**: Lucide React

### Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── user/page.tsx
│   │   └── admin/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── api/
│   ├── endpoints.ts
│   └── ITHAC.postman_collection.json
├── services/
│   ├── http.ts
│   └── auth.service.ts
├── hooks/
│   ├── queryClient.tsx
│   └── useAuth.ts
├── store/
│   └── auth.store.ts
├── components/
│   └── ui/ (shadcn/ui components)
├── utils/
│   └── env.ts
└── middleware.ts
```

### API Integration

Based on the ITHAC Postman collection, the following endpoints are integrated:

- `POST /authentication/login` - User login
- `POST /authentication/register` - User registration
- `POST /authentication/admin/login` - Admin login
- `GET /user` - Get current user profile

### Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open browser**: Navigate to `http://localhost:3000`

### Authentication Flow

1. **Unauthenticated users** → Redirected to login/register
2. **Login/Register** → HTTP-only cookies set + user info in Zustand
3. **Fetch /user profile** → Update user data + role
4. **Route protection** → Middleware checks cookies
5. **Role-based redirects** → Users → `/dashboard/user`, Admins → `/admin`

### Pages

- **Landing Page** (`/`) - Hero section with CTA buttons
- **Login Page** (`/login`) - Authentication form
- **Register Page** (`/register`) - Registration form
- **User Dashboard** (`/dashboard/user`) - Student interface
- **Admin Dashboard** (`/admin`) - Admin interface

### Security Features

- HttpOnly cookies for token storage
- Route protection middleware
- Role-based access control
- Form validation with Zod
- CSRF protection ready
- Secure API interceptors

### Next Steps (Stage 2)

- Course management system
- Lesson content delivery
- User enrollments
- Video streaming
- Progress tracking
- Payment integration

### Notes

- Backend API endpoints must match Postman collection structure
- Tokens are stored in HttpOnly cookies (not localStorage)
- User session persists in Zustand store
- Middleware protects `/dashboard/*` routes
- Admin access requires `role: 'admin'` in user object

## Development

The application is ready for Stage 1 testing. Start the dev server and test:

1. Register a new user
2. Login with credentials
3. View appropriate dashboard
4. Test logout functionality
5. Test route protection
