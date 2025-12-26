# CortexAI 🧠

**Next-Gen Natural Language Database Analytics & Explorer**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-cyan)

CortexAI is a modern intelligence dashboard that transforms how you interact with your data. By leveraging LLMs (Large Language Models), it converts plain English questions into optimized SQL queries, executes them against a PostgreSQL database, and instantly visualizes the results.

It also features a robust **Database Explorer** to navigate and inspect the underlying schema of the **Pagila** dataset (a DVD Rental Store simulation).

## ✨ Features

- **🤖 Natural Language to SQL**: Ask complex questions like *"Which movies have the highest replacement cost?"* and get accurate results instantly.
- **📊 Auto-Visualization**: The system automatically determines the best way to present data (Bar Charts, Line Graphs, Pie Charts, or Tables).
- **🗄️ Database Explorer**: A dedicated interface to browse all public tables, view schemas, and inspect raw row data.
- **⚡ Modern Tech Stack**: Built with Next.js 15 App Router, Server Actions, and Tailwind CSS v4.
- **🎨 Premium UI**: Features a "Glassmorphism" design system with deep gradients, `framer-motion` animations, and a responsive layout.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [PostCSS](https://postcss.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Neon/Supabase)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **AI/LLM**: Vercel AI SDK (with Gemini/OpenAI models)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js 18+ installed.
- A PostgreSQL database (the app uses the **Pagila** schema).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/llm-db-query.git
    cd llm-db-query
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory and add your database credentials and API keys:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
    GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

5.  **Open the App:**
    Navigate to `http://localhost:3000` in your browser.

## 📂 Project Structure

```bash
├── app/
│   ├── api/            # Next.js Server Functions (AI logic, DB queries)
│   ├── components/     # Reusable UI components (Charts, Inputs)
│   ├── dashboard/      # Main Analytics & DB Explorer interfaces
│   └── page.tsx        # Landing Page
├── db/                 # Drizzle ORM Schema & Relations
├── public/             # Static assets
└── scripts/            # Helper scripts (e.g., API testing)
```

## 🎥 Usage Highlights

### 1. The Dashboard
Type a question into the main input field. CortexAI will:
1.  **Generate SQL**: Convert your text to SQL.
2.  **Execute**: Run the query safely against your read-only DB user.
3.  **Visualize**: Render a chart or table based on the response.

### 2. Database Explorer
Click **"Explore Database"** on the landing page (or schema link in the dashboard) to view a grid of all tables. Click any table (e.g., `film`, `customer`) to see the first 30 rows of live data.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.
