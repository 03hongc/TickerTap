const apiKey = "OcsXJ37PqMhbjOZxQUj1U3IyNgnbpVzc";

// Get ticker from URL
const params = new URLSearchParams(window.location.search);
const ticker = params.get("ticker");

// DOM elements
const titleEl = document.getElementById("stock-title");
const subtitleEl = document.getElementById("stock-subtitle");
const metricsList = document.getElementById("metrics-list");
const ddScoreEl = document.getElementById("dd-score-box");

let financialScore = null;
let sentimentScore = null;

function updateDDScore() {
  if (financialScore === null || sentimentScore === null) return;
  const totalScore = financialScore + sentimentScore;
  ddScoreEl.textContent = `DD Score: ${totalScore}/100`;
  document.getElementById("dd-score-section").style.display = "block";
}

// Header update
if (ticker) {
  titleEl.textContent = ticker;
  fetchCurrentPrice(ticker);
  fetchMetrics(ticker);
  fetchPriceHistory(ticker, "30");
  fetchNewsSentiment(ticker);
} else {
  document.getElementById("analysis-content").style.display = "none";
  document.getElementById("no-ticker-message").style.display = "block";
}

function fetchMetrics(ticker) {
  const url = `https://financialmodelingprep.com/api/v3/key-metrics-ttm/${ticker}?apikey=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (!data || !data.length) {
        renderError("No financial data found.");
        return;
      }

      const metrics = data[0];

      const displayMetrics = {
        "P/E Ratio": metrics.peRatioTTM?.toFixed(2),
        EPS: metrics.netIncomePerShareTTM?.toFixed(2),
        "Revenue Per Share (TTM)": `$${metrics.revenuePerShareTTM?.toFixed(2)}`,
        "Market Cap": `$${(metrics.marketCapTTM / 1e12).toFixed(2)}T`,
        "Dividend Yield": `${metrics.dividendYieldPercentageTTM?.toFixed(2)}%`,
        "Debt to Equity": metrics.debtToEquityTTM?.toFixed(2),
        "Return on Equity (ROE)": `${(metrics.roeTTM * 100).toFixed(2)}%`,
        "Current Ratio": metrics.currentRatioTTM?.toFixed(2),
      };

      let score = 0;

      // Add points for good financial indicators
      if (
        metrics.peRatioTTM &&
        metrics.peRatioTTM > 5 &&
        metrics.peRatioTTM < 30
      )
        score += 10;
      if (metrics.netIncomePerShareTTM && metrics.netIncomePerShareTTM > 0)
        score += 10;
      if (metrics.roeTTM && metrics.roeTTM > 0.1) score += 10;
      if (
        metrics.currentRatioTTM &&
        metrics.currentRatioTTM >= 1.2 &&
        metrics.currentRatioTTM <= 3
      )
        score += 10;
      if (metrics.debtToEquityTTM && metrics.debtToEquityTTM < 2) score += 10;

      financialScore = score;
      updateDDScore();

      for (const [label, value] of Object.entries(displayMetrics)) {
        const li = document.createElement("li");
        li.textContent = `${label}: ${value ?? "N/A"}`;
        metricsList.appendChild(li);
      }
    })
    .catch((err) => {
      console.error("API error:", err);
      renderError("Failed to load financial metrics.");
    });
}

function fetchCurrentPrice(ticker) {
  const priceUrl = `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${apiKey}`;

  fetch(priceUrl)
    .then((response) => response.json())
    .then((data) => {
      const priceEl = document.getElementById("stock-price");

      if (data && data[0] && data[0].price) {
        const price = data[0].price.toFixed(2);
        const now = new Date();
        priceEl.textContent = `is currently trading at $${price} (as of ${now.toLocaleTimeString()})`;
      } else {
        priceEl.textContent = "Price unavailable";
      }
    })
    .catch((err) => {
      console.error("Price fetch error:", err);
      document.getElementById("stock-price").textContent = "Price unavailable";
    });
}

function renderError(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  li.style.color = "red";
  metricsList.appendChild(li);
}

function fetchPriceHistory(ticker, range = "30") {
  if (range === "max") {
    range = "5000";
  }
  let url = `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line&apikey=${apiKey}`;
  if (range !== "max") {
    url += `&timeseries=${range}`;
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const history = data.historical;

      if (!history || history.length === 0) {
        console.warn("No price history found.");
        return;
      }

      const labels = history.map((entry) => entry.date).reverse();
      const prices = history.map((entry) => entry.close).reverse();

      renderChart(labels, prices);
    })
    .catch((err) => {
      console.error("Error fetching price history:", err);
    });
}

let chartInstance = null;

function fetchNewsSentiment(ticker) {
  const url = `/api/fetchNews?ticker=${ticker}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.articles || data.articles.length === 0) {
        renderSentiment("No recent news articles found.");
        return;
      }

      const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
      const positiveWords = [
        "beats",
        "soars",
        "rises",
        "growth",
        "record",
        "strong",
        "surge",
        "outperform",
        "gain",
        "improves",
        "expands",
        "optimistic",
        "bullish",
        "tops",
        "profits",
        "increases",
        "exceeds",
        "buy",
        "upgraded",
        "momentum",
        "booming",
        "dominates",
      ];
      const negativeWords = [
        "misses",
        "falls",
        "drops",
        "weak",
        "concern",
        "down",
        "lawsuit",
        "cuts",
        "underperforms",
        "loss",
        "declines",
        "crash",
        "sell",
        "downgraded",
        "disappoints",
        "layoffs",
        "slump",
        "fear",
        "uncertain",
        "volatile",
        "struggles",
        "plunge",
      ];

      data.articles.forEach((article) => {
        const text = (article.title + " " + article.description).toLowerCase();

        let score = 0;
        positiveWords.forEach((word) => {
          if (text.includes(word)) score++;
        });
        negativeWords.forEach((word) => {
          if (text.includes(word)) score--;
        });

        if (score > 0) sentimentCounts.positive++;
        else if (score < 0) sentimentCounts.negative++;
        else sentimentCounts.neutral++;
      });

      renderSentiment(
        `News Sentiment (recent 100 articles):  
        🟢 Positive: ${sentimentCounts.positive}  
        🔴 Negative: ${sentimentCounts.negative}  
        ⚪ Neutral: ${sentimentCounts.neutral}`
      );

      const netScore = sentimentCounts.positive - sentimentCounts.negative;
      const normalized = Math.max(0, Math.min(50, 25 + netScore)); // Keeps it within 0–50
      sentimentScore = Math.round(normalized);
      updateDDScore();
    })
    .catch((err) => {
      console.error("Error fetching news:", err);
      renderSentiment("News sentiment unavailable.");
    });
}

function renderSentiment(message) {
  const sentimentBox = document.getElementById("sentiment-summary");
  sentimentBox.textContent = message;
}

function renderChart(labels, prices) {
  const ctx = document.getElementById("priceChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Closing Price ($)",
          data: prices,
          borderColor: "green",
          backgroundColor: "rgba(0, 128, 0, 0.1)",
          tension: 0.2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: { maxTicksLimit: 7 },
        },
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

const rangeSelect = document.getElementById("rangeSelect");

if (rangeSelect && ticker) {
  rangeSelect.addEventListener("change", () => {
    const selectedRange = rangeSelect.value;
    fetchPriceHistory(ticker, selectedRange);
  });
}
