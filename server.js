import express from "express";

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static("."));

app.post("/api/spark-ai", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt: `You are Spark AI, a helpful learning assistant. Answer simply: ${question}`,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error("Ollama is not responding");
    }

    const data = await response.json();

    res.json({
      answer: data.response
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Ollama connect aagala. Ollama running-la irukka nu check pannu."
    });
  }
});

app.listen(port, () => {
  console.log(`SkillSpark running at http://localhost:${port}`);
});