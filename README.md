# Analytics Dashboard

A comprehensive admin dashboard with authentication, user management, and statistics visualization.

## Features

- **Authentication System**
  - Sign in / Sign up functionality
  - JWT token-based authentication
  - Protected routes with role-based access

- **Dashboard**
  - Key Performance Indicators (KPIs) display
  - Raw data visualization (JSON format)
  - Data table with filter capabilities
  - Interactive charts (coming soon)

- **User Management** (Admin only)
  - Approve/reject pending user registrations
  - View user details and status
  - Real-time pending user count

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: CSS with custom design system
- **Authentication**: JWT tokens with context-based state management
- **API Integration**: RESTful API calls with error handling
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Montserrat from Google Fonts

## API Integration

The application integrates with the following API endpoints:

### Authentication
- `POST /auth/signin` - User login
- `POST /auth/signup` - User registration
- `POST /auth/forgot-password` - Password reset request

### User Management
- `GET /users/pending` - Get pending users (Admin only)
- `PATCH /users/{id}/approve` - Approve user (Admin only)
- `PATCH /users/{id}/reject` - Reject user (Admin only)
- `GET /users/profile` - Get current user profile

### Statistics
- `GET /statistics` - Get all statistics records

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```
   
   Replace `http://localhost:3001` with your actual API server URL.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Default Credentials

For testing purposes, the sign-in form is pre-filled with:
- **Email**: admin@example.com
- **Password**: admin123

*Note: These credentials must be configured in your backend API.*

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/
│   │   └── signup/         # Sign up page
│   ├── dashboard/          # Dashboard page
│   ├── users/              # User management page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects to sign in)
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx
│   │   ├── SignInPage.tsx
│   │   └── SignUpPage.tsx
│   └── layout/
│       └── DashboardLayout.tsx
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── services/
│   └── api.ts              # API service layer
└── types/
    └── api.ts              # TypeScript type definitions
```

## Key Features Explained

### Authentication Flow
1. Users land on the sign-in page
2. Upon successful authentication, JWT token is stored in localStorage
3. Protected routes check authentication status
4. Admin users get access to user management features

### Dashboard Components
- **KPI Cards**: Display calculated metrics from statistics data
- **Raw Data Viewer**: Shows JSON data exactly as received from API
- **Data Table**: Tabular view with Excel-like filter buttons (UI only)
- **Charts Section**: Placeholder for future interactive visualizations

### User Management
- Admin-only access with role-based protection
- Real-time pending user count in navigation badge
- Approve/reject functionality with API integration
- Success/error feedback for all actions

### Responsive Design
- Mobile-friendly responsive layout
- Collapsible sidebar on mobile devices
- Optimized table viewing on smaller screens

## API Error Handling

The application includes comprehensive error handling:
- Network errors are caught and displayed to users
- Invalid credentials show appropriate error messages
- 401/403 errors trigger automatic logout/redirect
- Loading states prevent multiple simultaneous requests

## Customization

### Styling
All styles are in `src/app/globals.css` using a custom CSS design system with:
- Dark theme with purple accent colors
- Consistent spacing and typography
- Hover effects and smooth transitions
- Responsive breakpoints

### API Configuration
Update the API base URL in `.env.local` to point to your backend server.

### Branding
The logo "A" and application title "Analytics" can be customized in:
- `src/app/layout.tsx` (page metadata)
- Component templates (search for "Analytics" or "A" logo)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
