# Fanject - Fan Club Community Platform

A responsive web/mobile application for fan club communities to manage giveaways and exchanges at concerts/events.

## Tech Stack

- **Frontend:** ReactJS + Vite
- **UI Framework:** Bootstrap 5
- **Icons:** Lucide React
- **Backend/Auth:** Supabase
- **Routing:** React Router DOM

## Project Structure

```
fanject-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   ├── dashboard/    # Dashboard components
│   │   ├── artists/      # Artist-related components
│   │   ├── events/       # Event-related components
│   │   ├── giveaways/    # Giveaway components
│   │   ├── exchanges/    # Exchange components
│   │   └── messages/     # Messaging components
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   ├── auth/         # Auth pages (SignIn, SignUp)
│   │   ├── onboarding/   # Onboarding flow
│   │   ├── dashboard/    # Dashboard page
│   │   ├── discover/     # Discover page
│   │   ├── artists/      # Artists pages
│   │   ├── events/       # Events pages
│   │   ├── giveaways/    # Giveaways pages
│   │   ├── exchanges/    # Exchanges pages
│   │   ├── messages/     # Messages pages
│   │   └── settings/     # Settings pages
│   ├── services/         # API services (Supabase client)
│   ├── utils/            # Utility functions
│   └── assets/           # Static assets
├── public/               # Public static files
├── .env.example          # Environment variables template
├── SUPABASE_SETUP.md     # Supabase setup instructions
└── package.json          # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   cd fanject-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Follow the instructions in `SUPABASE_SETUP.md` to:
   - Create a Supabase project
   - Run the SQL schema
   - Configure Google OAuth (optional)

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Features

### Implemented (Phase 1)
- ✅ User authentication (Email/Password, Google OAuth)
- ✅ Multi-step onboarding flow
- ✅ Profile dashboard with Feed/Activity tabs
- ✅ Responsive navigation
- ✅ Protected routes

### Coming Soon
- 🔄 Discover screen with smart feed
- 🔄 Artists directory and profiles
- 🔄 Events calendar and listings
- 🔄 Giveaways management
- 🔄 Item exchange system
- 🔄 Real-time messaging
- 🔄 Notifications
- 🔄 PWA support

## Modules Overview

Based on the PRD, the app includes 20 modules:

1. **Welcome & Authentication** - Sign in/up with X-only or Google OAuth
2. **Profile First-Entry** - Dynamic welcome modal & PWA prompts
3. **Profile Dashboard** - Dual-tab architecture (Feed/Activity)
4. **Discover Screen** - Smart feed with artist/event sections
5. **Artists Directory** - Browse and deep-dive artist profiles
6. **Events Calendar** - 7-day dynamic calendar strip
7. **Giveaways** - Create and manage giveaways
8. **Exchanges** - Request and manage item exchanges
9. **Messages** - Real-time chat between users
10. **Notifications** - Push and in-app notifications
11. **Profile Settings** - Account and preference management
12. **Search** - Global search across artists, events, posts
13. **Favorites** - Bookmark favorite content
14. **Activity Tracking** - Track participation history
15. **PWA Installation** - Mobile app installation prompts
16. **Cold Start Logic** - Personalized content for new users
17. **Privacy Controls** - Manage visibility settings
18. **Data Export** - Export user data
19. **Help & Support** - FAQ and contact support
20. **Admin Panel** - Content moderation tools

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
