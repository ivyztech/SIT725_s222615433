import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

function parseNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// GET /api/add?a=..&b=..
app.get("/api/add", (req, res) => {
  const a = parseNum(req.query.a);
  const b = parseNum(req.query.b);
  if (a === null || b === null) {
    return res.status(400).json({
      error: "Invalid query params. Use /api/add?a=1&b=2 with numbers."
    });
  }
  return res.json({ result: a + b });
});

// POST /api/calc { op, a, b }
app.post("/api/calc", (req, res) => {
  const { op, a, b } = req.body || {};
  const A = parseNum(a), B = parseNum(b);
  if (!op || A === null || B === null) {
    return res.status(400).json({
      error: "Provide JSON { op, a, b } where a & b are numbers and op in add|sub|mul|div"
    });
  }
  let result;
  switch (op) {
    case "add": result = A + B; break;
    case "sub": result = A - B; break;
    case "mul": result = A * B; break;
    case "div":
      if (B === 0) return res.status(400).json({ error: "Division by zero" });
      result = A / B;
      break;
    default:
      return res.status(400).json({ error: "Unsupported op. Use add|sub|mul|div" });
  }
  res.json({ op, a: A, b: B, result });
});

// 404 json for API routes
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Serve index.html for any NON-API path
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});


