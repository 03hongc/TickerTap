import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("ticker")
    .select("symbol, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching tickers:", error);
    return res.status(500).json({ error: "Failed to fetch tickers" });
  }

  res.status(200).json(data);
}
