// api/saveTicker.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { symbol } = req.body;

  const response = await fetch("https://yqgfigzkdljtfobtxeyq.supabase.co/rest/v1/tickers", {
    method: "POST",
    headers: {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZ2ZpZ3prZGxqdGZvYnR4ZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTc2OTAsImV4cCI6MjA2MzE5MzY5MH0.ekd9QDXGDw7zJZ5Yo0hB87CipFEOJNqWLDoDF75yF0Q",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZ2ZpZ3prZGxqdGZvYnR4ZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTc2OTAsImV4cCI6MjA2MzE5MzY5MH0.ekd9QDXGDw7zJZ5Yo0hB87CipFEOJNqWLDoDF75yF0Q",
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ symbol })
  });

  const data = await response.json();
  res.status(200).json(data);
}
