# Developer Manual – TickerTap

Welcome to the TickerTap Developer Manual. This guide will help you get the application up and running locally, understand the API structure, and continue development smoothly.

---

## 🛠 Installation & Setup

### Prerequisites

- Git
- Supabase account + project
- Vercel account (for deployment)

### 1. Clone the repository

```bash
git clone https://github.com/03hongc/tickertap.git
cd tickertap
```

### 2. Set environment variables

SUPABASE_URL=your_supabase_url

SUPABASE_ANON_KEY=your_supabase_anon_key

### 3. Deployment

We use Vercel for deployment. This project is automatically deployed when code is pushed to the main branch.

To manually deploy:

Go to https://vercel.com

Connect your GitHub repository

Set the environment variables in Vercel under Project Settings → Environment Variables

Click Deploy

### API Reference

POST /api/saveTicker
Description: Saves a stock ticker to Supabase.

Request Body:

json
Copy
Edit
{
"symbol": "AAPL"
}
Responses:

200 OK: Insert succeeded

400 Bad Request: Invalid or missing symbol

500 Internal Server Error: Supabase insert failed

⚠ Note: Ensure your Supabase Row Level Security (RLS) policies allows both anon and public roles to INSERT and optionally SELECT on the ticker table.

### Known Bugs

Supabase RLS policies must be configured correctly or inserts/selects may silently fail.

Some edge cases for invalid ticker input are not handled.

Rate limits may apply if Financial Modeling Prep API is added later

Recently searched tickers:
   Are not user-specific
   Do not update to show only the most recent if the same ticker is entered again
   Do not filter out invalid tickers

### Roadmap

Add user authentication via Supabase Auth

Implement ticker deletion feature

Improve error messages and frontend validation

Add tests for backend API routes

Show sentiment and technical trend visualizations

Add loading states and UX improvements
