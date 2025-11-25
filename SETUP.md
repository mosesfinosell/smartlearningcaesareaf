# Caesarea Smart School - Frontend Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation Steps

1. **Navigate to project directory**
```bash
cd caesarea-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
caesarea-frontend/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login
│   ├── register/page.tsx           # Registration
│   ├── admin/
│   │   └── dashboard/page.tsx      # Admin dashboard
│   ├── tutor/
│   │   ├── dashboard/page.tsx      # Tutor dashboard
│   │   ├── classes/
│   │   │   ├── create/page.tsx     # Create class
│   │   │   └── [id]/page.tsx       # Class detail
│   │   └── assignments/
│   │       ├── create/page.tsx     # Create assignment
│   │       └── [id]/page.tsx       # Grade submissions
│   ├── student/
│   │   ├── dashboard/page.tsx      # Student dashboard
│   │   ├── classes/
│   │   │   └── [id]/page.tsx       # Class detail
│   │   └── assignments/
│   │       ├── [id]/page.tsx       # View results
│   │       └── [id]/submit/page.tsx # Submit work
│   └── parent/
│       ├── dashboard/page.tsx      # Parent dashboard
│       └── children/
│           ├── add/page.tsx        # Add child
│           └── [id]/
│               ├── enroll/page.tsx  # Enroll in class
│               └── progress/page.tsx # View progress
├── tailwind.config.ts              # Tailwind config
└── package.json
```

---

## 🎨 Brand Colors (Configured in Tailwind)

```css
maroon: #800020    /* Primary */
gold: #FFD700      /* Accent */
cream: #FFFDD0     /* Background */
```

---

## 🔧 Configuration

### Backend API Endpoint
All API calls are currently set to `http://localhost:5000`

To change this, search and replace in all files:
```
http://localhost:5000
```

### Environment Variables (Optional)
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then update fetch calls to use:
```javascript
process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
```

---

## 🧪 Testing User Flows

### 1. Test Admin Flow
1. Register as admin (or use existing admin account)
2. Login → redirects to `/admin/dashboard`
3. View pending tutor applications
4. Click on a tutor to review documents
5. Approve or reject application

### 2. Test Tutor Flow
1. Register as tutor with subjects and qualifications
2. Wait for admin approval (or approve via admin panel)
3. Login → redirects to `/tutor/dashboard`
4. Click "Create New Class"
5. Fill in class details and schedule
6. View class in dashboard
7. Click class to see details
8. Create assignment for the class
9. View submissions and grade them

### 3. Test Student Flow
1. Register as student with grade
2. Login → redirects to `/student/dashboard`
3. View enrolled classes (need parent to enroll)
4. Click on class to see details
5. Submit assignment
6. View graded assignments

### 4. Test Parent Flow
1. Register as parent
2. Login → redirects to `/parent/dashboard`
3. Click "Add Child"
4. Create child account
5. Click "Enroll in New Class" for child
6. Browse and select a class
7. Confirm enrollment
8. View child's progress

---

## 📱 Pages by User Role

### Public (Not Logged In)
- `/` - Landing page
- `/login` - Login
- `/register` - Registration

### Admin
- `/admin/dashboard` - Main dashboard with tutor verification

### Tutor
- `/tutor/dashboard` - Main dashboard
- `/tutor/classes/create` - Create new class
- `/tutor/classes/[id]` - Manage specific class
- `/tutor/assignments/create` - Create assignment
- `/tutor/assignments/[id]` - Grade submissions

### Student
- `/student/dashboard` - Main dashboard
- `/student/classes/[id]` - View class details
- `/student/assignments/[id]/submit` - Submit assignment
- `/student/assignments/[id]` - View graded work

### Parent
- `/parent/dashboard` - Main dashboard
- `/parent/children/add` - Add new child
- `/parent/children/[id]/enroll` - Enroll child in class
- `/parent/children/[id]/progress` - View child's progress

---

## 🔐 Authentication

### How It Works
1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in `localStorage`:
   - `token` - JWT authentication token
   - `userRole` - User's role (admin, tutor, student, parent)
   - `userId` - User's ID
4. Token sent with every API request in `Authorization` header
5. Role-based redirect to appropriate dashboard

### Logout (Manual)
```javascript
localStorage.removeItem('token');
localStorage.removeItem('userRole');
localStorage.removeItem('userId');
window.location.href = '/login';
```

---

## 🛠️ Common Tasks

### Add New Page
1. Create file in appropriate `app/` folder
2. Use existing pages as template
3. Include authentication check:
```typescript
const token = localStorage.getItem('token');
if (!token) {
  router.push('/login');
  return;
}
```

### Update API Endpoint
Search project for `http://localhost:5000` and replace with new URL

### Add New Color
Edit `tailwind.config.ts`:
```typescript
colors: {
  maroon: '#800020',
  gold: '#FFD700',
  cream: '#FFFDD0',
  'your-color': '#HEXCODE'
}
```

---

## 🐛 Troubleshooting

### "Failed to fetch" errors
- ✅ Check backend is running on `http://localhost:5000`
- ✅ Check CORS is enabled in backend
- ✅ Check API endpoints match backend routes

### Redirect to login repeatedly
- ✅ Check token is being saved to localStorage
- ✅ Check backend is returning valid JWT
- ✅ Check token is being sent in Authorization header

### Styling not applying
- ✅ Run `npm run dev` to rebuild
- ✅ Check Tailwind classes are correct
- ✅ Clear browser cache

### 404 on page refresh
- ✅ This is normal with Next.js dynamic routes in dev
- ✅ Use `next build` and `next start` for production testing

---

## 📦 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Or export static site
npm run build
# Then deploy the `out/` folder
```

---

## 🎯 Next Steps (Optional Enhancements)

1. **Profile Pages** - Allow users to edit their profiles
2. **Analytics Charts** - Add visual charts to dashboards
3. **Real-time Notifications** - WebSocket for live updates
4. **Search & Filters** - Advanced search across entities
5. **File Upload UI** - Direct document upload from frontend
6. **Calendar View** - Visual schedule display
7. **Dark Mode** - Theme toggle

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review STATUS.md for known limitations
3. Check PAGES_COMPLETE.md for page inventory
4. Review backend API documentation

---

**Status**: ✅ All core pages complete and functional!
**Ready for**: Testing, deployment, user feedback
