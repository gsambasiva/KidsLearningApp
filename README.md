# 🧠 SmartKids Learning App

A production-ready kids learning mobile app built with **React Native (Expo)**, **Node.js + Express**, and **MongoDB**.

---

## 📁 Project Structure

```
KidsLearningApp/
├── frontend/           ← React Native (Expo) app
│   ├── App.js
│   ├── app.json
│   ├── package.json
│   └── src/
│       ├── screens/
│       │   ├── SplashScreen.js
│       │   ├── auth/
│       │   │   ├── LoginScreen.js
│       │   │   ├── SignupScreen.js
│       │   │   └── RoleSelectionScreen.js
│       │   ├── child/
│       │   │   ├── HomeScreen.js
│       │   │   ├── GradeSelectionScreen.js
│       │   │   ├── TopicSelectionScreen.js
│       │   │   ├── QuizScreen.js
│       │   │   ├── ResultScreen.js
│       │   │   └── LeaderboardScreen.js
│       │   └── parent/
│       │       ├── ParentDashboard.js
│       │       └── ManageChildrenScreen.js
│       ├── components/
│       │   ├── common/         ← Button, Card, ProgressBar
│       │   ├── quiz/           ← MultipleChoice, FillInBlank, QuizTimer
│       │   ├── dashboard/      ← ProgressChart
│       │   └── gamification/   ← RewardPopup, StreakBadge, LevelBadge
│       ├── navigation/
│       │   └── AppNavigator.js
│       ├── services/           ← API, Auth, Quiz, Progress, Notifications
│       ├── context/            ← AuthContext, AppContext
│       ├── hooks/
│       ├── utils/              ← storage, adaptive, helpers
│       ├── styles/             ← colors, typography, theme
│       └── data/
│           └── localQuestions.js  ← Offline fallback questions
│
└── backend/            ← Node.js + Express API
    ├── server.js
    ├── package.json
    ├── .env.example
    ├── config/
    │   └── database.js
    ├── models/
    │   ├── User.js
    │   ├── QuizResult.js
    │   └── Progress.js
    ├── controllers/
    │   ├── authController.js
    │   ├── quizController.js
    │   └── progressController.js
    ├── routes/
    │   ├── auth.js
    │   ├── quiz.js
    │   ├── progress.js
    │   ├── leaderboard.js
    │   ├── notifications.js
    │   └── rewards.js
    ├── services/
    │   ├── quizGenerator.js    ← Dynamic question generation
    │   ├── adaptiveEngine.js   ← Adaptive learning engine
    │   ├── emailService.js
    │   └── notificationService.js
    ├── middleware/
    │   ├── auth.js             ← JWT middleware
    │   └── errorHandler.js
    └── utils/
        └── helpers.js
```

---

## 🚀 Quick Setup

### Prerequisites
- **Node.js** v18+
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** app on your phone (for testing)

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and email settings

# Start backend (development)
npm run dev

# Backend runs at: http://localhost:5001
# Health check: http://localhost:5001/api/health
```

**Required .env values:**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/smartkids
JWT_SECRET=your_very_secret_key_here_change_this
JWT_EXPIRES_IN=7d

# Email (optional for weekly reports)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set your backend URL
# Edit src/services/api.js and update BASE_URL
# OR create a .env file:
echo "EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api" > .env

# Start Expo
npx expo start

# Scan the QR code with Expo Go app
```

> ⚠️ **Important:** Replace `localhost` with your machine's local IP address (e.g., `192.168.1.100`) when testing on a real device. Use `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find your IP.

---

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# macOS: brew install mongodb/brew/mongodb-community
# Ubuntu: sudo apt install mongodb
mongod --dbpath /data/db
```

**Option B: MongoDB Atlas (Recommended for production)**
1. Create free account at https://www.mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Set `MONGODB_URI` in .env

---

## 🎮 Features Implemented

### ✅ Authentication
- Email/password signup and login
- JWT tokens (7-day expiry)
- Parent and Child roles
- Parent can create/manage multiple child profiles
- Secure password hashing (bcrypt)

### ✅ Learning Modules
- **Math:** Counting, Addition, Subtraction, Multiplication, Division, Fractions, Word Problems
- **Reading:** Comprehension, Vocabulary, Stories (Grade K-5)
- Grade selection (K, 1, 2, 3, 4, 5)
- Easy / Medium / Hard difficulty levels

### ✅ Quiz System
- **Dynamic question generation** — unique questions every time
- Multiple choice questions
- Fill-in-the-blank questions
- 60-second timer per question
- Instant feedback (green correct, red wrong + explanation)
- Progress tracking dots at bottom
- Offline fallback with local question bank

### ✅ Adaptive Learning Engine
- Tracks mastery per topic (0-100%)
- Adjusts difficulty based on performance
- Detects weak areas automatically
- Recommends topics to practice
- Both frontend (local) and backend (API) versions

### ✅ Gamification
- ⭐ Stars earned per quiz (based on score + difficulty)
- 🪙 Coins earned per correct answer
- ⚡ XP points with level calculation
- 🏆 Badges for achievements (first quiz, perfect score, streaks, levels)
- 🔥 Daily streak tracking
- Level system (Beginner → Explorer → Scholar → Expert → Master)
- Animated reward popup with celebration effects

### ✅ Parent Dashboard
- Select and switch between children
- Weekly/monthly stats: quizzes taken, average score, time spent
- Progress trend charts (line/bar)
- Weak area detection with mastery percentages
- Smart recommendations
- Manage children (add/edit/remove)

### ✅ Leaderboard
- Global rankings by total score
- Weekly rankings
- Streak leaderboard
- Podium display for top 3
- Shows your personal rank

### ✅ Notifications
- Push notifications via Expo (Expo Push API)
- Daily learning reminders (6 PM)
- Achievement notifications
- Weekly progress emails to parents (via Nodemailer)
- Scheduled via node-cron

### ✅ UI/UX
- Kid-friendly design: bright greens, oranges, blues
- Large fonts and rounded buttons
- Smooth spring/bounce animations throughout
- Press animations on all buttons
- Progress bars with animations
- Sliding quiz transitions

### ✅ Offline Mode
- Questions cached locally (AsyncStorage, 24hr TTL)
- Results saved offline and synced when online
- Built-in local question database for full offline play

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/children` | Add child (parent) |
| GET | `/api/auth/children` | Get children (parent) |
| PUT | `/api/auth/children/:id` | Update child |
| DELETE | `/api/auth/children/:id` | Remove child |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz/generate` | Generate quiz questions |
| POST | `/api/quiz/results` | Submit quiz result |
| GET | `/api/quiz/history` | Get quiz history |
| GET | `/api/quiz/stats` | Get statistics |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/report` | Full progress report |
| GET | `/api/progress/topics` | Topic breakdown |
| GET | `/api/progress/weak-areas` | Weak topic detection |
| GET | `/api/progress/recommendations` | Personalized recommendations |
| GET | `/api/progress/chart` | Chart data (weekly/monthly) |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard?type=global` | Global leaderboard |
| GET | `/api/leaderboard?type=weekly` | Weekly leaderboard |
| GET | `/api/leaderboard?type=streak` | Streak leaderboard |

---

## 🗄️ Database Schema

### Users Collection
```
{
  firstName, lastName, email, password (hashed), role (parent|child),
  grade, age, avatar, parentId (for children),
  rewards: { stars, coins, xp, level, badges[] },
  streak: { current, best, lastActivityDate },
  settings: { soundEnabled, notificationsEnabled, preferredSubject },
  pushToken
}
```

### QuizResults Collection
```
{
  userId, subject, topic, grade, difficulty,
  totalQuestions, correctAnswers, score,
  timeTaken, answers[], earnedRewards{},
  completedAt
}
```

### Progress Collection
```
{
  userId, subject, topic, grade,
  totalAttempts, totalCorrect, masteryLevel (0-100),
  easyStats, mediumStats, hardStats,
  recommendedDifficulty
}
```

---

## 📱 Tested On
- iOS (Expo Go)
- Android (Expo Go)

---

## 🔧 Customization

### Adding New Quiz Topics
1. Add topic to `MATH_TOPICS` or `READING_TOPICS` in `TopicSelectionScreen.js`
2. Add generator function in `backend/services/quizGenerator.js`
3. Add local fallback questions in `src/data/localQuestions.js`

### Changing Colors
Edit `src/styles/colors.js` — all colors are defined there.

### Timer Duration
Change `TIMER_DURATION` in `QuizScreen.js` (default: 60 seconds)

### Adding New Subjects
Follow the pattern in `HomeScreen.js` and add a new subject to the `SUBJECTS` array.

---

## 📦 Key Dependencies

### Frontend
- `expo` - App framework
- `@react-navigation/native` - Navigation
- `axios` - HTTP client
- `expo-secure-store` - Secure token storage
- `@react-native-async-storage/async-storage` - Local storage
- `expo-linear-gradient` - Gradient backgrounds
- `react-native-chart-kit` - Progress charts
- `expo-notifications` - Push notifications
- `lottie-react-native` - Animations

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT auth
- `bcryptjs` - Password hashing
- `nodemailer` - Email sending
- `expo-server-sdk` - Expo push notifications
- `node-cron` - Scheduled tasks
- `helmet` + `express-rate-limit` - Security

---

## 🛡️ Security Features
- JWT authentication on all protected routes
- Password hashing with bcrypt (12 rounds)
- Rate limiting on API and auth routes
- Helmet.js security headers
- Input validation with express-validator
- Parent can only access their own children's data
- CORS configuration

---

## 💡 Tips for Production

1. **Use MongoDB Atlas** for hosted database
2. **Set up a real SMTP** provider (SendGrid, AWS SES) for emails
3. **Get Expo Push Token** from expo.dev for push notifications
4. **Use HTTPS** with SSL certificate
5. **Set `NODE_ENV=production`** in environment
6. **Use PM2** to keep Node.js server running: `pm2 start server.js`
7. **Build the app** with `eas build` for App Store / Play Store submission

---

## 🙏 Credits

Built with ❤️ for kids who love to learn!

**SmartKids Learning App** — Making education fun, one quiz at a time! 🌟
