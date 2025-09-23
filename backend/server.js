import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// ou use "gemini-1.5-pro" se quiser mais qualidade em vez de velocidade


app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Mensagem vazia." });
  }

  try {
    const completion = await model.generateContent({
      contents: [
        {
          parts: [
            { text: "Você é um assistente especializado em monitoramento inteligente e eficiência energética. Responda de forma clara e didática." },
            { text: message }
          ]
        }
      ]
    });

    const reply = completion.response.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.error("Erro no Gemini:", error);
    res.status(500).json({ reply: "Erro ao se comunicar com o Gemini." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
