# Digital Learning Platform for Rural School Students 🎓

A complete, full-stack, mobile-first web application designed specifically for students and educators in rural communities with low-bandwidth or intermittent internet access.

---

## 1. Project Overview & Problem Statement

### Problem Statement
In many rural areas, students face significant obstacles in accessing quality educational resources due to:
- Limited or low-bandwidth cellular connectivity (2G/3G speeds or high latency).
- Lack of desktop computers; smartphones are the primary digital access point.
- High cost of mobile cellular data, making heavy video streams or unoptimized web apps impractical.
- Lack of structured self-assessment tools, instant feedback, and gamified incentives to keep students motivated.

### Objectives
1. **Lightweight & Low Bandwidth First**: Keep payload small, optimize images, prevent autoplay video streams, and provide offline-friendly text notes.
2. **Accessible & Mobile-Responsive**: Built from mobile viewport upwards with high touch targets, readable typography, and semantic HTML.
3. **Interactive Self-Assessment**: Instant quiz grading, 4-option questions, and score calculations.
4. **Gamified Rewards**: Motivate students with performance-based badges (*Good Effort*, *Great Achievement*, *Excellent Learner*).
5. **Teacher / Admin Management**: Complete curriculum authoring tool to add subjects, notes, PDFs, videos, and quizzes.
6. **Zero-Configuration Demo Mode**: Instantly testable without requiring cloud keys.

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Tailwind Animate
- **UI Components**: shadcn/ui design tokens, Radix UI Primitives, Lucide React icons
- **Form Management & Validation**: React Hook Form, Zod
- **Data Visualization**: Recharts (Dynamic Bar & Progress Charts)
- **Backend & Cloud Services**: 
  - **Firebase Authentication**: Secure email/password authentication
  - **Cloud Firestore**: Real-time NoSQL cloud database
  - **Firebase Storage**: Cloud storage for uploaded PDFs and learning documents
- **Deployment Target**: Vercel-ready with zero server dependencies

---

## 3. Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                              Next.js Frontend                           |
|  (App Router, Tailwind CSS, Lucide Icons, Mobile-Optimized Interface)   |
+------------------------------------+------------------------------------+
                                     |
                +--------------------+--------------------+
                |                                         |
                v                                         v
     [Firebase Configured]                       [Firebase Unconfigured]
                |                                         |
                v                                         v
     +---------------------+                     +---------------------+
     | Firebase Auth       |                     | In-Memory & Session |
     | Cloud Firestore     |                     | Demo Mode Store     |
     | Firebase Storage    |                     | (Preloaded Data)    |
     +---------------------+                     +---------------------+
```

---

## 4. Key Features

1. **Dual Mode (Cloud Firebase + Zero-Config Demo Mode)**: If Firebase credentials are not supplied in `.env.local`, the application runs in a fully functional Demo Mode with pre-populated subjects, materials, and quizzes.
2. **Role-Based Protected Routing**:
   - `/student/*`: Protected for student accounts.
   - `/admin/*`: Protected for teachers/administrators.
3. **Interactive Subject Catalog**:
   - Mathematics, Science, English, Social Science, and Computer Science.
4. **Learning Materials Reader**:
   - Markdown-rendered notes (low bandwidth).
   - PDF viewer and file upload.
   - Video lessons with no autoplay.
5. **Quiz Engine & Grading**:
   - Automated score calculation: `percentage = (correct / total) * 100`.
   - Option selection palette and instant answer review.
6. **Gamified Reward System**:
   - **90% – 100%**: 🌟 *Excellent Learner* (Gold Tier)
   - **80% – 89%**: 🏆 *Great Achievement* (Silver Tier)
   - **75% – 79%**: 👍 *Good Effort* (Bronze Tier)
   - **< 75%**: *"Keep Practicing! Review the lesson and try again."*
7. **Analytics Dashboard**:
   - Recharts visual charts comparing syllabus completion vs. quiz scores.
   - Historical quiz attempts log.

---

## 5. Folder Structure

```
digital-learning-platform/
├── .env.local                    # Firebase environment configuration
├── firestore.rules               # Cloud Firestore security rules
├── storage.rules                 # Cloud Storage security rules
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind styling setup
├── tsconfig.json                 # TypeScript compiler options
├── src/
│   ├── app/                      # Next.js App Router routes
│   │   ├── globals.css           # Design tokens and styles
│   │   ├── layout.tsx            # Global Root Layout
│   │   ├── page.tsx              # Landing page
│   │   ├── login/page.tsx        # Login page with demo quick-fill
│   │   ├── register/page.tsx     # Student registration page
│   │   ├── student/              # Student portal routes
│   │   │   ├── layout.tsx        # Student layout & route guard
│   │   │   ├── dashboard/        # Student KPI dashboard
│   │   │   ├── subjects/         # Subjects catalog & [subjectId] details
│   │   │   ├── materials/        # Learning materials library & reader
│   │   │   ├── quizzes/          # Quizzes list, [quizId] taking, & history
│   │   │   ├── progress/         # Recharts visual analytics
│   │   │   ├── rewards/          # Badges & achievements
│   │   │   └── profile/          # Student profile & school details
│   │   └── admin/                # Teacher / Admin portal routes
│   │       ├── layout.tsx        # Admin layout & route guard
│   │       ├── dashboard/        # Admin overview & stats
│   │       ├── subjects/         # CRUD subjects
│   │       ├── materials/        # CRUD materials & PDF upload
│   │       ├── quizzes/          # 4-option quiz authoring
│   │       ├── results/          # Student quiz submissions
│   │       ├── progress/         # Class progress analytics
│   │       └── students/         # Student directory
│   ├── components/               # Reusable UI & presentation components
│   │   ├── ui/                   # Button, Input, Card, Progress, Badge, etc.
│   │   ├── navbar.tsx            # Navigation bar with responsive mobile menu
│   │   ├── protected-route.tsx   # Auth and role access guard
│   │   ├── subject-card.tsx      # Subject card with action buttons
│   │   ├── material-card.tsx     # Material preview card
│   │   ├── quiz-card.tsx         # Quiz card with questions count
│   │   ├── reward-badge.tsx      # Reward badge with tiers & messages
│   │   └── loading-state.tsx     # Low-bandwidth loading state
│   ├── lib/
│   │   ├── firebase.ts           # Firebase SDK initialization
│   │   ├── auth-context.tsx      # Unified AuthProvider (Firebase + Demo)
│   │   ├── data-service.ts       # Unified CRUD service layer
│   │   ├── demo-data.ts          # Sample subjects, materials, & quizzes
│   │   └── utils.ts              # Tailwind class merging utility
│   └── types/
│       └── index.ts              # TypeScript interface definitions
```

---

## 6. Installation & Running Locally

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open your browser
http://localhost:3000
```

---

## 7. Demo Mode Credentials

The platform includes built-in demo credentials that allow complete evaluation without any Firebase configuration:

| Role | Email | Password |
|---|---|---|
| **Student** | `student@example.com` | `demo123` |
| **Admin / Teacher** | `admin@example.com` | `admin123` |

On the `/login` page, you can also click the quick **"Fill Student Demo"** or **"Fill Admin Demo"** buttons to auto-populate credentials.

---

## 8. Step-by-Step Complete Demo Flow

To verify all features from start to finish:

1. **Student Login**:
   - Go to `/login` and sign in with `student@example.com` / `demo123`.
2. **Student Dashboard**:
   - View your enrolled subjects, completion progress, and quick statistics.
3. **Subjects & Learning Materials**:
   - Click **Subjects** in the top navigation.
   - Select **Science** (`/student/subjects/sub-1`).
   - Click **Open Material** on *"The Human Body - An Introduction"*.
   - Read the study notes and click **Mark Completed**.
4. **Taking the Quiz**:
   - Navigate to **Quizzes** -> **Human Body Quiz** (`/student/quizzes/quiz-1`).
   - Answer the 10 multiple-choice questions. *(Tip: Click "⚡ Auto-fill 80% (Demo)" to instantly fill 8 correct and 2 wrong answers)*.
   - Click **Submit Quiz**.
5. **Score & Reward Verification**:
   - Observe the score: **80% (8/10)**.
   - See the unlocked **"Great Achievement"** badge banner and appreciation message.
6. **Review Achievements & Analytics**:
   - Click **View Rewards** (`/student/rewards`) to see your badge.
   - Click **View Progress** (`/student/progress`) to observe updated Recharts analytics.
   - Click **Quiz History** (`/student/quizzes/history`) to see the saved attempt.
7. **Sign Out**:
   - Click the logout icon in the navigation bar.
8. **Admin / Teacher Login**:
   - Sign in with `admin@example.com` / `admin123`.
9. **Admin Verification**:
   - Observe the 6 KPI stat cards on `/admin/dashboard`.
   - Click **Results** (`/admin/results`) to view the student's 80% submission and Great Achievement badge.
   - Navigate to **Subjects** or **Materials** or **Quizzes** to test authoring new questions.

---

## 9. Firebase Configuration (Optional Production Setup)

To connect your live Google Firebase project:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password provider).
3. Enable **Cloud Firestore** in production or test mode.
4. Enable **Firebase Storage**.
5. Add your credentials to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

6. Deploy security rules:
```bash
firebase deploy --only firestore:rules,storage
```

---

## 10. Security & Low Bandwidth Architecture

- **No Passwords Stored in Database**: Authentication is managed securely via Firebase Auth or in-memory session.
- **Role Isolation**: Strict security rules guarantee students cannot alter subjects, materials, or other students' progress records.
- **Low-Bandwidth Optimizations**:
  - Pure SVG icons via Lucide.
  - Zero heavy video autoplay; external media is linked.
  - Minimal CSS bundle size using Tailwind CSS.
  - Fully responsive from 320px mobile screens to desktop.
