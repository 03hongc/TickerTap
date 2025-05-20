// /api/saveTicker.js
import { createClient } from "@supabase/supabase-js";

// Initialize client with env vars (set in Vercel)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { symbol } = req.body;

  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({ error: "Invalid or missing ticker symbol" });
  }

  const { data, error } = await supabase
    .from("tickers")
    .insert([{ symbol }])
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ error: "Failed to save ticker" });
  }

  res.status(200).json(data);
}
