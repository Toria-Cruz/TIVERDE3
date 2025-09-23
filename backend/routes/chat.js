// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Carrega chave da OpenAI da variável de ambiente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rota POST para /api/chat
router.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  // Se mensagem estiver vazia
  if (!userMessage) {
    return res.status(400).json({ reply: "Mensagem vazia." });
  }

  try {
    // Chamada para o ChatGPT
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ou outro modelo
      messages: [
        { role: "system", content: "Você é um assistente inteligente da EcoTech Energy Solutions." },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
    });

    // Extrai resposta do GPT
    const reply = response.choices[0].message.content;
    res.json({ reply }); // envia resposta para o frontend
  } catch (error) {
    console.error("Erro no ChatGPT:", error);
    res.status(500).json({ reply: "Erro ao se comunicar com o assistente." });
  }
});

module.exports = router;
