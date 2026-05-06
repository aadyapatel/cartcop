import { useState } from "react"
import axios from "axios"

export default function App() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const analyzeProduct = async () => {
    if (!url) return
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const response = await axios.post("http://localhost:8000/analyze", { url })
      setResult(response.data)
    } catch (err) {
      setError("Something went wrong. Make sure the backend is running.")
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
        🛒 CartCop
      </h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Paste any Amazon or Flipkart product URL — we'll analyze reviews and flag red flags instantly.
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Paste product URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
        />
        <button
          onClick={analyzeProduct}
          disabled={loading}
          style={{ padding: "12px 24px", borderRadius: "8px", background: "#111", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #ffcccc", borderRadius: "8px", padding: "16px", color: "#cc0000", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: "#f9f9f9", borderRadius: "12px", padding: "24px", border: "1px solid #eee" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ fontSize: "36px", fontWeight: "700", color: result.trust_score >= 7 ? "#16a34a" : result.trust_score >= 5 ? "#d97706" : "#dc2626" }}>
              {result.trust_score}/10
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "16px" }}>Trust Score</div>
              <div style={{ color: "#666", fontSize: "13px" }}>{result.verdict}</div>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#16a34a", marginBottom: "8px" }}>✅ Pros</h3>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#333", fontSize: "14px", lineHeight: "1.8" }}>
              {result.pros.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#dc2626", marginBottom: "8px" }}>❌ Cons</h3>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#333", fontSize: "14px", lineHeight: "1.8" }}>
              {result.cons.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#d97706", marginBottom: "8px" }}>⚠️ Red flags</h3>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#333", fontSize: "14px", lineHeight: "1.8" }}>
              {result.red_flags.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}