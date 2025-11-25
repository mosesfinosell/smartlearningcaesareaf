# Caesarea Smart School - Web Application

Frontend web application for Caesarea Smart School built with Next.js 14 and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
NEXT_PUBLIC_ZOOM_SDK_KEY=your_zoom_sdk_key
```

4. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
app/
├── (auth)/         # Authentication pages (login, register)
├── layout.tsx      # Root layout
└── page.tsx        # Landing page

components/
├── ui/             # Reusable UI components
├── layout/         # Layout components
└── auth/           # Authentication components

lib/
├── api.ts          # API client and endpoints
└── utils.ts        # Utility functions

styles/
└── globals.css     # Global styles and Tailwind
```

## 🎨 Brand Colors

- **Gold**: #C9A05C (Primary)
- **Deep Gold**: #B8904A
- **Light Gold**: #E8D4B0
- **Cream**: #F5F0E8 (Background)
- **Maroon**: #8B1538 (Accent)
- **Charcoal**: #1A1A1A

## 🔑 Features

- ✅ User authentication (login/register)
- ✅ Role-based registration (Parent, Student, Tutor)
- ✅ Responsive design
- ✅ Brand-specific styling
- ✅ API integration
- 🚧 Dashboard (coming soon)
- 🚧 Live classes with Zoom SDK (coming soon)
- 🚧 Paystack payment integration (coming soon)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **API Client**: Axios
- **Icons**: Lucide React

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
vercel
```

### Other Platforms
```bash
npm run build
npm run start
```

## 📄 License

MIT
# smartlearningcaesareaf
