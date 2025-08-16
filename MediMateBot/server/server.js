import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms are required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a medical triage bot. You MUST always reply in exactly this format, with each section present in a a very concise and structured manner:
    Severity: (one word: Low, Moderate, High)
    Immediate Need for Attention: (Yes/No)
    See a Doctor If: (max 2 short bullet points, each starting with "- ")
    Next Steps: (max 3 bullet points, each starting with "- ")
    Possible Conditions: (max 3 bullet points, each starting with "- ")
    Disclaimer: (one short sentence)
    Symptoms: "${symptoms}"`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

app.listen(8080, () => console.log("Bot API running on http://localhost:8080"));
