export default async function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: "Missing ticker" });
  }

  const apiKey = process.env.NEWS_API_KEY; // api key on vercel
  const url = `https://newsapi.org/v2/everything?q=${ticker}&sortBy=publishedAt&pageSize=100&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("NewsAPI error");
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
