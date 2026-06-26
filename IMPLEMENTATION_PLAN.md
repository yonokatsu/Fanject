# Fanject Web App - Implementation Plan

## Project Overview
**Application:** Fanject - Fan club community platform for managing giveaways and exchanges at concerts/events  
**Tech Stack:** ReactJS + Bootstrap + Supabase (Backend/Auth) + Lucide Icons  
**Repository:** `/workspace`

---

## Phase 1: Project Setup & Foundation (Week 1)

### 1.1 Initial Project Configuration
- [ ] Initialize React app with Vite (modern build tool)
- [ ] Install core dependencies:
  - `react-router-dom` (navigation)
  - `bootstrap` (UI framework)
  - `@supabase/supabase-js` (backend/auth)
  - `lucide-react` (icons)
  - `@vitejs/plugin-react` (React support)
- [ ] Configure Bootstrap custom theme (brand colors: blue-purple accent)
- [ ] Set up project folder structure
- [ ] Configure environment variables (.env for Supabase credentials)

### 1.2 Supabase Backend Setup
- [ ] Create Supabase project
- [ ] Design and create database schema:
  - `users` table (profile data, interest_tags, is_first_time)
  - `artists` table (solo/group artists, members)
  - `events` table (event details, dates, locations)
  - `posts/giveaways` table (giveaway posts)
  - `interactions` table (favorites, participations)
  - `messages` table (chat system)
  - `bookmarks` table (saved items)
  - `notifications` table (user notifications)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Configure Google OAuth 2.0 provider in Supabase Auth
- [ ] Create storage buckets for user avatars and event images

### 1.3 Core Architecture Setup
- [ ] Create React context providers:
  - `AuthProvider` (authentication state)
  - `UserProfileProvider` (user profile data)
  - `ThemeProvider` (optional dark/light mode)
- [ ] Set up React Router configuration with protected routes
- [ ] Create reusable UI components library:
  - Custom Button components (primary, outline, FAB)
  - Card components (artist, event, post cards)
  - Modal components (Bootstrap-based)
  - Navigation components (Top Nav, Bottom Nav)
  - Loading/Skeleton components
- [ ] Create utility functions:
  - Date formatting helpers
  - Validation functions
  - API service layer for Supabase calls

---

## Phase 2: Authentication & Onboarding (Week 2)

### Module 1: Welcome & Authentication Flow
- [ ] Create `GetStarted` page component
  - Logo and "Fanject" branding
  - Slogan: "Join the signal - Catch the light"
  - Description: "Discover and join fan giveaways in one place."
  - CTA Button: "Get started" (btn-primary, btn-lg, w-100)
- [ ] Create `Login` page component
  - "Log in with Google" button (btn-dark, w-100)
  - Link to Sign up page
- [ ] Create `SignUp` page component
  - "Sign up with Google" button (btn-dark, w-100)
  - Link to Login page
- [ ] Implement Google OAuth integration with Supabase
  - `supabase.auth.signInWithOAuth({ provider: 'google' })`
- [ ] Create multi-step onboarding flow:
  - Progress bar component (4 stepper bars)
  - Step 1: Account Info form
    - Profile image (circle avatar, optional upload)
    - Display Name input (required, max 50 chars)
    - X Account input (required, max 50 chars)
    - Description textarea (optional, max 160 chars)
    - Birthday date picker (required)
    - Form validation logic
  - Step 2: Artist Categories selection (multi-select buttons)
    - Options: Solo Artist, Idol Group, Vtuber, Band, Actor/Actress
  - Step 3: Origins selection (multi-select buttons)
    - Options: Korean, Japanese, Thai, Chinese, Western
  - Step 4: Event Types selection (multi-select buttons)
    - Options: Concert/Fan meeting, Fan Cafe, Birthday project, Exhibition, Online Event
- [ ] Implement navigation guards and validation
  - Next button disabled until required fields completed
  - Final step submits all data to `users` table
- [ ] Map data to database schema:
  - `name`, `description`, `birthday`, `interest_tags` (array of strings)

### Module 2: Profile First-Entry & Dynamic Welcome Modal
- [ ] Create welcome modal component (Bootstrap Modal)
  - Step 1: Welcome screen
    - Checkmark icon (brand color)
    - Text: "Welcome! Hope you enjoy."
    - Next button
  - Step 2: Add to Home Screen instructions
    - Android: "Install App" button with PWA installation logic
    - iOS: Grid layout with GIF/steps illustration
- [ ] Implement `is_first_time` state management
  - Check value on profile page load
  - Update to `false` after modal closes via Supabase
- [ ] Configure PWA manifest and service worker
  - `beforeinstallprompt` event handling
  - iOS-specific instructions display

---

## Phase 3: Profile & Dashboard System (Week 3)

### Module 3: Profile Dashboard & Dual-Tab Architecture
- [ ] Create main `Profile` page component
  - Header section with cover image and circular profile avatar
  - Profile info display (name, bio/description)
  - Interests tags rendering from `interest_tags` array
  - View mode detection (Owner vs Visitor)
  - Edit Profile button (owner only)
  - Floating Action Button (FAB) for creating posts
- [ ] Implement dual-tab navigation system
  - Tab 1: Feed
    - Chronological query of user's posts
    - Post card components with full post data
  - Tab 2: Activity
    - Sub-section: Favorites (privacy lock for visitors)
    - Sub-section: Events Participate (check-in history)
    - Sub-section: Giveaways Backup (giver history)
    - Sub-section: Giveaways Collection (receiver history)
- [ ] Implement data binding with React Hooks (`useEffect`)
- [ ] Create privacy rules for Favorites tab (owner-only visibility)
- [ ] Build Edit Profile modal/form component

### Module 18: User Profile Dashboard & Activity Tracking
- [ ] Enhance profile dashboard with activity metrics
- [ ] Implement statistics display (posts count, events attended, etc.)
- [ ] Create activity timeline visualization

---

## Phase 4: Discover & Content Discovery (Week 4)

### Module 4: Discover Screen & Smart Feed Logic
- [ ] Create `Discover` page component
  - Top Navigation Bar:
    - Profile avatar (opens Top Nav Profile Sheet)
    - App logo
    - Settings icon
    - Search input (form-control)
  - Artists Section:
    - Horizontal scroll with circular artist avatars
    - "See All" button
    - "+ New Artist" button
    - Filter icon
  - Events Section:
    - "+ New Event" button
    - Filter icon
    - Dynamic Calendar Strip (7-day current week)
      - Auto-calculated dates based on current date
      - Weekly reset logic
      - Active state highlighting
    - Event Cards Grid (2 columns with Bootstrap grid)
  - Bottom Navigation Bar (fixed-bottom):
    - Home, Discover, Bookmarks, Notification, Inbox
    - FAB [+] button (bottom-right)
- [ ] Implement smart cold-start content logic
  - Zero Marked State: Show suggested content based on onboarding interests
  - Marked State: Prioritize marked/followed artists and events
- [ ] Implement date-based filtering system
  - Default: Current date highlighted
  - On-click filter updates event cards via useEffect
- [ ] Create Top Nav Profile Sheet animation component

### Module 5: Artists Directory & Deep-Dive Profiles
- [ ] Create `ArtistsDirectory` page component
  - Search input and filter buttons
  - Category filter button group (All, Idol group, Solo Artist, Band, Actor/Actress)
  - Artists Grid (3 columns with row-cols-3)
  - Artist card components with mark button
- [ ] Create `GroupArtistProfile` page component
  - Header with cover image, profile photo, name, origin tag
  - Mark button for following
  - Tab system (Info / Event):
    - Info tab: Background info, Members section (vertical list)
    - Event tab: Upcoming/Latest event cards
- [ ] Create `SoloArtistProfile` / `MemberProfile` page components
  - Similar structure without Members section
  - Individual info: Nationality, Birthday, Debut, Description
  - Event tab with artist-specific events
- [ ] Implement deep linking from group profiles to member profiles

### Module 6: Events Directory & Dynamic Event Map
- [ ] Create `EventsDirectory` page component
  - Search and filter functionality
  - Event listing with map integration (optional)
  - Event card components
- [ ] Implement dynamic event calendar view
- [ ] Create event detail modal/page

### Module 7: Context-Aware Search Logic
- [ ] Create global search component
- [ ] Implement search across multiple entities:
  - Artists
  - Events
  - Posts/Giveaways
  - Users
- [ ] Implement search result categorization
- [ ] Add recent searches and suggestions

---

## Phase 5: Content Creation & Management (Week 5)

### Module 8: User-Generated Event Creation & Guardrails
- [ ] Create event creation form component
- [ ] Implement form validation and guardrails
- [ ] Add event submission workflow
- [ ] Create admin/approval queue (if needed)

### Module 9: Home Feed Dynamics & Profile Navigation Matrix
- [ ] Create `Home` feed page component
- [ ] Implement feed algorithm (chronological + relevance)
- [ ] Create profile navigation matrix from feed posts
- [ ] Implement infinite scroll or pagination

### Module 10: Giveaway Post Creation & Thread Logic
- [ ] Create giveaway post creation form
  - Post type selection (giveaway, exchange)
  - Event association
  - Item description and images
  - Quantity/stock settings
  - Terms and conditions
- [ ] Implement thread/post creation logic
- [ ] Add image upload functionality to Supabase Storage
- [ ] Create post preview before submission

### Module 11: Post Detail Dynamics & Status Synchronization
- [ ] Create `PostDetail` page component
  - Full post information display
  - Status indicators (available, claimed, completed)
  - Action buttons based on user role (owner/requester/viewer)
- [ ] Implement real-time status synchronization
- [ ] Add comment/interaction section (if applicable)

---

## Phase 6: Exchange & Transaction System (Week 6)

### Module 12: Outbound Exchange Request Flow & Same-Event Filtering
- [ ] Create exchange request form component
- [ ] Implement same-event filtering logic
- [ ] Build request submission workflow
- [ ] Create request status tracking

### Module 13: Inbox & Private Chat System
- [ ] Create `Inbox` page component
  - Conversation list view
  - Unread message indicators
  - Last message preview
- [ ] Create `Chat` page component
  - Message thread display
  - Message input with send functionality
  - Image/file sharing capability
- [ ] Implement real-time messaging with Supabase Realtime
- [ ] Add typing indicators and read receipts
- [ ] Implement chat notification system

### Module 14: QR Verification & Stock Inventory (Exchange Mode)
- [ ] Create QR code generation component
- [ ] Implement QR code scanner component
- [ ] Build exchange mode verification flow
- [ ] Track stock/inventory changes during exchanges
- [ ] Implement exchange confirmation workflow

### Module 15: QR Verification & Stock Inventory (General Claim Mode)
- [ ] Create general claim mode QR verification
- [ ] Implement different verification flows for claim vs exchange
- [ ] Build claim confirmation and completion logic
- [ ] Update inventory/stock tracking

---

## Phase 7: Engagement & Retention Features (Week 7)

### Module 16: Bookmarks Hub & Categorized Lists Navigation
- [ ] Create `Bookmarks` page component
  - Categorized bookmark lists
  - Bookmark management (add/remove)
  - Quick access to bookmarked content
- [ ] Implement bookmark categorization system
- [ ] Create bookmark organization UI

### Module 17: Notification Center & Aggregated Detail Views
- [ ] Create `Notifications` page component
  - Notification list with categories
  - Unread/read status management
  - Notification detail views
- [ ] Implement notification aggregation logic
- [ ] Create notification types:
  - New messages
  - Exchange requests
  - Event reminders
  - Post interactions
  - System announcements
- [ ] Add push notification support (PWA)

### Module 19: System Settings & Account Management
- [ ] Create `Settings` page component
  - Account settings section
  - Privacy settings
  - Notification preferences
  - App preferences (theme, language if needed)
- [ ] Implement account management features:
  - Edit profile
  - Change email/phone
  - Delete account option
  - Logout functionality
- [ ] Add help/support section
- [ ] Implement terms of service and privacy policy pages

---

## Phase 8: Advanced Features & Polish (Week 8)

### Module 20: Deep Linking & Guest Mode Restrictions
- [ ] Implement deep linking for:
  - Artist profiles
  - Event pages
  - Post threads
  - User profiles
- [ ] Create guest mode experience
  - Limited content viewing
  - Authentication redirect triggers
  - Clear CTAs for sign-up/login
- [ ] Implement route guards for protected content
- [ ] Handle expired/invalid deep links gracefully

### Cross-Cutting Enhancements
- [ ] Implement comprehensive error handling
- [ ] Add loading states and skeleton screens throughout
- [ ] Optimize for mobile responsiveness (Bootstrap breakpoints)
- [ ] Implement accessibility features (ARIA labels, keyboard navigation)
- [ ] Add analytics tracking (optional)
- [ ] Performance optimization:
  - Code splitting
  - Lazy loading components
  - Image optimization
  - Caching strategies
- [ ] Testing:
  - Unit tests for utility functions
  - Component tests with React Testing Library
  - Integration tests for critical flows
  - E2E tests with Playwright or Cypress

---

## File Structure Proposal

```
/workspace
├── public/
│   ├── manifest.json (PWA)
│   └── icons/
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ...
│   │   ├── navigation/
│   │   │   ├── TopNav.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   └── ProfileSheet.jsx
│   │   ├── artists/
│   │   │   ├── ArtistCard.jsx
│   │   │   ├── ArtistGrid.jsx
│   │   │   └── ...
│   │   ├── events/
│   │   │   ├── EventCard.jsx
│   │   │   ├── CalendarStrip.jsx
│   │   │   └── ...
│   │   ├── posts/
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   └── ...
│   │   └── chat/
│   │       ├── ConversationList.jsx
│   │       ├── ChatWindow.jsx
│   │       └── ...
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── UserProfileContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProfile.js
│   │   └── ...
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── GetStarted.jsx
│   │   │   ├── Login.jsx
│   │   │   └── SignUp.jsx
│   │   ├── onboarding/
│   │   │   └── OnboardingFlow.jsx
│   │   ├── Home.jsx
│   │   ├── Discover.jsx
│   │   ├── Profile.jsx
│   │   ├── Artists.jsx
│   │   ├── Events.jsx
│   │   ├── Bookmarks.jsx
│   │   ├── Notifications.jsx
│   │   ├── Inbox.jsx
│   │   ├── Chat.jsx
│   │   ├── Settings.jsx
│   │   └── ...
│   ├── services/
│   │   ├── supabase.js
│   │   ├── api.js
│   │   └── ...
│   ├── utils/
│   │   ├── validation.js
│   │   ├── dateHelpers.js
│   │   └── ...
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── vite.config.js
└── docs/
    └── PRD.md
```

---

## Database Schema Summary

### Core Tables
1. **users**
   - id (UUID, PK)
   - x_id
   - username
   - name (display name)
   - profile_image_url
   - description
   - birthday
   - interest_tags (TEXT[])
   - is_first_time (BOOLEAN)
   - created_at
   - updated_at

2. **artists**
   - id (UUID, PK)
   - name
   - type (solo, group, vtuber, band, actor)
   - origin (korean, japanese, thai, chinese, western)
   - profile_image_url
   - cover_image_url
   - description
   - debut_date
   - is_group (BOOLEAN)
   - created_at

3. **artist_members**
   - id (UUID, PK)
   - artist_id (FK → artists)
   - member_id (FK → artists, for solo profiles)
   - role

4. **events**
   - id (UUID, PK)
   - name
   - artist_id (FK → artists)
   - event_type
   - event_date
   - location
   - description
   - cover_image_url
   - created_by (FK → users)
   - created_at

5. **posts/giveaways**
   - id (UUID, PK)
   - user_id (FK → users)
   - event_id (FK → events)
   - type (giveaway, exchange)
   - title
   - description
   - item_images (TEXT[])
   - quantity_total
   - quantity_remaining
   - status (active, claimed, completed)
   - created_at
   - updated_at

6. **interactions**
   - id (UUID, PK)
   - user_id (FK → users)
   - post_id (FK → posts)
   - event_id (FK → events)
   - type (favorite, participate, backup, collection)
   - created_at

7. **messages**
   - id (UUID, PK)
   - conversation_id
   - sender_id (FK → users)
   - receiver_id (FK → users)
   - content
   - image_url
   - is_read (BOOLEAN)
   - created_at

8. **conversations**
   - id (UUID, PK)
   - participant_ids (UUID[])
   - last_message_at
   - updated_at

9. **bookmarks**
   - id (UUID, PK)
   - user_id (FK → users)
   - entity_type (artist, event, post)
   - entity_id (UUID)
   - category
   - created_at

10. **notifications**
    - id (UUID, PK)
    - user_id (FK → users)
    - type
    - title
    - message
    - entity_type
    - entity_id
    - is_read (BOOLEAN)
    - created_at

11. **exchange_requests**
    - id (UUID, PK)
    - post_id (FK → posts)
    - requester_id (FK → users)
    - target_event_id (FK → events)
    - status (pending, accepted, rejected, completed)
    - qr_code_data
    - verified_at
    - created_at

---

## Milestones & Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1 | Week 1 | Project setup, Supabase backend, core architecture |
| Phase 2 | Week 2 | Authentication, onboarding flow, PWA setup |
| Phase 3 | Week 3 | Profile dashboard, dual-tab system, activity tracking |
| Phase 4 | Week 4 | Discover screen, artists directory, events directory, search |
| Phase 5 | Week 5 | Event creation, home feed, giveaway post creation |
| Phase 6 | Week 6 | Exchange system, chat/messaging, QR verification |
| Phase 7 | Week 7 | Bookmarks, notifications, settings |
| Phase 8 | Week 8 | Deep linking, guest mode, testing, polish |

**Total Estimated Time:** 8 weeks for MVP completion

---

## Success Criteria

1. ✅ All 20 modules implemented according to PRD specifications
2. ✅ Responsive design working on mobile and desktop
3. ✅ PWA functionality (installable on Android/iOS)
4. ✅ Google OAuth authentication working
5. ✅ Real-time chat and notifications functional
6. ✅ QR code generation and scanning operational
7. ✅ All CRUD operations for core entities (artists, events, posts)
8. ✅ Privacy rules enforced correctly
9. ✅ Performance optimized (< 3s initial load time)
10. ✅ Accessibility standards met (WCAG 2.1 AA)

---

## Risk Mitigation

- **Supabase Free Tier Limits:** Monitor usage, optimize queries, implement caching
- **PWA iOS Limitations:** Provide clear manual installation instructions
- **Real-time Sync Complexity:** Use Supabase Realtime subscriptions efficiently
- **Mobile Responsiveness:** Test on multiple devices throughout development
- **Authentication Edge Cases:** Handle token expiration, network failures gracefully
