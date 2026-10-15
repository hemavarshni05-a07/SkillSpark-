import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));
// Allow requests from your GitHub Pages website.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigin =
    "https://hemavarshni05-a07.github.io";

  if (origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.post("/api/spark-ai", async (req, res) => {
  try {
    const question = req.body?.question;

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    if (question.length > 4000) {
      return res.status(400).json({
        error: "Please use a shorter question."
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are Spark AI, a friendly learning assistant. " +
        "Help with learning, coding, projects and communication. " +
        "Answer clearly and simply.",
      input: question.trim()
    });

    res.json({
      answer: response.output_text
    });
  } catch (error) {
    console.error("Spark AI request failed:", error.message);

    res.status(500).json({
      error: "Spark AI could not reply. Please try again."
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Spark AI server running on port ${port}`);
});
