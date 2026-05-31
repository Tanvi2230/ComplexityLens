<div align="center">

# 🔍 ComplexityLens

### *See your code's complexity in action — no more guessing*

**ComplexityLens actually runs your code at 7 different input sizes, records real timing data, fits it against mathematical complexity curves, and tells you exactly why it's O(n²).**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-2ea043?style=for-the-badge)](https://client-sandy-gamma-13.vercel.app)
[![Backend](https://img.shields.io/badge/⚙️_Backend-Railway-7c3aed?style=for-the-badge)](https://shimmering-creativity-production.up.railway.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)

</div>

---

## 🌐 Live Deployment

| Service | URL |
|---|---|
| 🖥️ **Frontend (Vercel)** | https://client-sandy-gamma-13.vercel.app |
| ⚙️ **Backend API (Railway)** | https://shimmering-creativity-production.up.railway.app |
| 🗄️ **Database** | Railway PostgreSQL (internal) |

---

## ✨ What Makes It Different

Most complexity analyzers just *count your loops* and guess. ComplexityLens is different:

1. **Runs your code for real** — sends it to Judge0 sandbox and executes it
2. **Tests 7 input sizes** — `[10, 50, 100, 500, 1000, 2000, 5000]`
3. **Fits a curve** — compares actual timings against O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ) using Mean Squared Error
4. **AI explains it** — Groq/Llama 70B writes a plain-English explanation of *why* your code has that complexity
5. **Shows you the proof** — interactive runtime chart so you can see the curve yourself

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🧠 **Real Execution** | Your code actually runs — not simulated |
| 📊 **Runtime Chart** | Live plot of actual timings vs theoretical O(n²) curve |
| 🤖 **AI Explanation** | Groq/Llama 70B explains why your code has its complexity |
| ⚖️ **Compare Algorithms** | Paste two functions, see both curves on one chart |
| 🎮 **Big O Explorer** | Interactive slider showing how each complexity class grows |
| 🏆 **Leaderboard** | Community-wide stats — most common complexities & languages |
| 📱 **10 Languages** | Python, JavaScript, TypeScript, Java, C++, C, Go, Rust, Kotlin, Ruby |
| 💾 **Save & History** | Save analyses, view history, personal dashboard |
| 🔐 **Auth System** | Register/login with JWT — analyses linked to your account |
| 📥 **Export PNG** | Download your results as an image |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI framework
- **React Router 7** — client-side routing
- **Chart.js + react-chartjs-2** — runtime curve charts
- **Monaco Editor** — VS Code-style code editor
- **Axios** — HTTP client with JWT interceptor
- **html2canvas** — export results as PNG

### Backend
- **Node.js 22 + Express 5** — REST API server
- **Prisma 7 + PostgreSQL** — database ORM
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT authentication
- **Groq SDK (Llama 3.3 70B)** — AI explanations
- **Judge0 API** — sandboxed code execution in 10 languages

### Infrastructure
- **Vercel** — frontend hosting
- **Railway** — backend + PostgreSQL database
- **Judge0 CE** — free public code execution API

---

## 🧠 How It Works

```
User pastes code
       ↓
Server wraps it with a timer + test array
       ↓
Sends to Judge0 × 7 input sizes (n = 10 → 5000)
       ↓
Collects timing data: [{ n: 10, ms: 0.3 }, { n: 100, ms: 8 }, ...]
       ↓
Normalizes and compares against 6 complexity curves using MSE
       ↓
Best fit wins → "O(n²)"
       ↓
Sends code + complexity to Groq AI for plain-English explanation
       ↓
Saves to PostgreSQL, returns everything to React
       ↓
React shows: badge + chart + AI explanation + recursion tree
```

---

## 📁 Project Structure

```
ComplexityLens/
├── client/                          # React frontend
│   └── src/
│       ├── pages/
│       │   ├── HomePage.js          # Main analyzer
│       │   ├── DashboardPage.js     # Personal stats
│       │   ├── ComparisonPage.js    # Side-by-side comparison
│       │   ├── ExplorerPage.js      # Interactive Big O explorer
│       │   ├── LeaderboardPage.js   # Community stats
│       │   ├── HistoryPage.js       # Analysis history
│       │   ├── SavedPage.js         # Bookmarked analyses
│       │   ├── ProfilePage.js       # User profile
│       │   └── AuthPage.js          # Login / Register
│       ├── components/
│       │   ├── CodeEditor.js        # Monaco editor wrapper
│       │   ├── RuntimeChart.js      # Chart.js timing chart
│       │   ├── ComplexityBadge.js   # O(n²) badge display
│       │   ├── AIExplanation.js     # AI text renderer
│       │   ├── RecursionTree.js     # SVG recursion visualizer
│       │   ├── ExampleLibrary.js    # Built-in code examples
│       │   ├── ComplexityGuide.js   # Big O reference guide
│       │   └── LoadingSteps.js      # Animated loading steps
│       ├── context/AuthContext.js   # Global auth state
│       └── services/api.js          # All HTTP calls (auto JWT)
│
└── server/                          # Node.js backend
    ├── index.js                     # Express app entry point
    ├── routes/                      # URL definitions
    ├── controllers/
    │   ├── analyzeController.js     # Core analysis logic
    │   ├── authController.js        # Register / Login
    │   ├── dashboardController.js   # Personal stats
    │   ├── savedController.js       # Bookmark analyses
    │   └── statsController.js       # Leaderboard data
    ├── services/
    │   ├── judge0Service.js         # Code execution (10 langs)
    │   ├── complexityService.js     # MSE curve fitting
    │   ├── geminiService.js         # Groq/Llama AI
    │   └── prismaClient.js          # DB connection
    ├── middleware/authMiddleware.js  # JWT protect + optionalAuth
    └── prisma/schema.prisma         # DB schema (User, Analysis, Saved)
```

---

## 🏃 Run Locally

### Prerequisites
- Node.js 22+
- A PostgreSQL database (Railway, Supabase, Neon, etc.)
- [Groq API key](https://console.groq.com) (free)

### 1. Clone the repo
```bash
git clone https://github.com/Tanvi2230/ComplexityLens.git
cd ComplexityLens
```

### 2. Setup the server
```bash
cd server
npm install
```

Create `server/.env`:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=5000
JUDGE0_API_URL=https://ce.judge0.com
GROQ_API_KEY=gsk_your_groq_key_here
JWT_SECRET=any_long_random_string_here
```

Push the database schema:
```bash
npx prisma db push
```

Start the server:
```bash
npm run dev
```

### 3. Setup the client
```bash
cd ../client
npm install
npm start
```

Open **http://localhost:3000** 🎉

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/analyze` | Optional | Run analysis on code |
| `GET` | `/api/history` | No | Recent analyses |
| `GET` | `/api/stats` | No | Leaderboard data |
| `POST` | `/api/auth/register` | No | Create account |
| `POST` | `/api/auth/login` | No | Login, get token |
| `GET` | `/api/auth/profile` | ✅ | Get profile + stats |
| `PUT` | `/api/auth/profile` | ✅ | Update name/avatar |
| `GET` | `/api/dashboard` | ✅ | Personal dashboard |
| `POST` | `/api/saved` | ✅ | Save an analysis |
| `GET` | `/api/saved` | ✅ | Get saved analyses |
| `DELETE` | `/api/saved/:id` | ✅ | Remove saved analysis |

---

## 🗄️ Database Schema

```prisma
model User {
  id        String          @id @default(cuid())
  name      String
  email     String          @unique
  password  String          // bcrypt hashed
  avatar    String?
  createdAt DateTime        @default(now())
  analyses  Analysis[]
  saved     SavedAnalysis[]
}

model Analysis {
  id              String   @id @default(cuid())
  code            String
  language        String   // python, javascript, java, cpp...
  complexity      String   // O(n²), O(n log n)...
  spaceComplexity String
  timings         Json     // [{ n: 10, ms: 0.3 }, ...]
  aiExplanation   String
  userId          String?  // null for guest analyses
  createdAt       DateTime @default(now())
}

model SavedAnalysis {
  id         String   @id @default(cuid())
  userId     String
  analysisId String
  note       String?
  createdAt  DateTime @default(now())
  @@unique([userId, analysisId])
}
```

---

## 📊 Supported Complexity Classes

| Class | Growth | Example |
|---|---|---|
| O(1) | Constant | Array index access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Simple loop |
| O(n log n) | Linearithmic | Merge sort, Quick sort |
| O(n²) | Quadratic | Bubble sort, nested loops |
| O(2ⁿ) | Exponential | Recursive Fibonacci |

---

## 💻 Supported Languages

Python • JavaScript • TypeScript • Java • C++ • C • Go • Rust • Kotlin • Ruby

---

<div align="center">

Built with ❤️ by **Tanvi Shrivastava**

⭐ Star this repo if you found it useful!

</div>
