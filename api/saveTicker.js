import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  console.log("Incoming request to saveTicker");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { symbol } = req.body;

  console.log("Symbol received:", symbol);

  if (!symbol || typeof symbol !== "string") {
    console.error("Invalid or missing symbol");
    return res.status(400).json({ error: "Invalid or missing symbol" });
  }

  const { data, error } = await supabase
    .from("ticker")
    .insert([{ symbol }])
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ error: "Failed to insert" });
  }

  console.log("Insert successful:", data);
  res.status(200).json(data);
}
