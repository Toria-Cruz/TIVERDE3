import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------------
// DADOS MOCKADOS (PARA RESOLVER O ERRO 404 E CARREGAR OS GRÁFICOS)
// ----------------------------------------------------------------------
const mockData = {
    // Anos disponíveis para os selects
    anos: [2023, 2024, 2025],

    // Dados de consumo mensal (para gráfico de barras e linhas)
    consumoMensal: [
        { mes: "Janeiro", ano: 2024, consumo: 150.5 },
        { mes: "Fevereiro", ano: 2024, consumo: 120.2 },
        { mes: "Março", ano: 2024, consumo: 180.1 },
        { mes: "Abril", ano: 2024, consumo: 95.7 },
        { mes: "Janeiro", ano: 2025, consumo: 165.8 },
        { mes: "Fevereiro", ano: 2025, consumo: 130.4 },
        { mes: "Março", ano: 2025, consumo: 210.0 }
    ],

    // Dados de consumo por tipo de equipamento por ano (para gráfico de pizza e tabela)
    consumoTipo: {
        2024: { "Iluminação": 80.5, "Aquecimento": 40.2, "Refrigeração": 30.1, "Computadores": 15.0 },
        2025: { "Iluminação": 95.0, "Aquecimento": 60.5, "Refrigeração": 45.3, "Outros": 5.0 }
    },
    
    // Resumo de dispositivos ativos
    dispositivos: [
        { nome: "Sensor de Corrente A", tipo: "Monitoramento", ativo: true, consumoKWh: 0.5 },
        { nome: "Ar Condicionado Sala", tipo: "Refrigeração", ativo: true, consumoKWh: 50 },
        { nome: "Aquecedor de Água", tipo: "Aquecimento", ativo: false, consumoKWh: 0 },
        { nome: "Iluminação Externa", tipo: "Iluminação", ativo: true, consumoKWh: 10 }
    ]
};


// ----------------------------------------------------------------------
// ROTAS DE DADOS (API) - CORREÇÃO DOS ERROS 404
// ----------------------------------------------------------------------

// Rota para o gráfico de linha (fetchAnalise) - Retorna todos os dados para o multi-ano
// ENDPOINT: /api/consumo
app.get('/api/consumo', (req, res) => {
    res.json(mockData.consumoMensal);
});

// Rota para o gráfico de barras (fetchConsumo) - Retorna dados filtrados por ano
// ENDPOINT: /api/consumo/por-ano
app.get('/api/consumo/por-ano', (req, res) => {
    const ano = parseInt(req.query.ano);
    if (!ano) return res.status(400).json({ error: "Parâmetro 'ano' é obrigatório." });
    
    const filtered = mockData.consumoMensal.filter(d => d.ano === ano);
    res.json(filtered);
});

// Rota para popular os selects de ano
// ENDPOINT: /api/consumo/anos-disponiveis
app.get('/api/consumo/anos-disponiveis', (req, res) => {
    res.json(mockData.anos);
});

// Rota para popular o select de ano do gráfico de pizza
// ENDPOINT: /api/consumo-equipamento/anos-disponiveis-consumo-tipo
app.get('/api/consumo-equipamento/anos-disponiveis-consumo-tipo', (req, res) => {
    res.json(mockData.anos);
});


// Rota para o gráfico de pizza e detalhes da tabela (Consumo por Tipo)
// ENDPOINT: /api/consumo-equipamento/consumo-tipo/:ano
app.get('/api/consumo-equipamento/consumo-tipo/:ano', (req, res) => {
    const ano = parseInt(req.params.ano);
    const dados = mockData.consumoTipo[ano] || {};
    res.json(dados);
});

// Rota para o resumo de dispositivos ativos
// ENDPOINT: /api/dispositivos/resumo-ativos
app.get('/api/dispositivos/resumo-ativos', (req, res) => {
    const ativos = mockData.dispositivos.filter(d => d.ativo);
    res.json(ativos);
});


// ... (outros imports e configs)

// Inicializa o cliente da API Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Adicionando a instrução de sistema (System Instruction) para concisão
const systemInstruction = `Você é um assistente de chatbot para a EcoTech Energy Solutions. Seja sempre cordial, mas seu principal objetivo é responder às perguntas do usuário de forma extremamente concisa, direta, sem rodeios e usando no máximo 3 frases curtas. Não adicione saudações ou encerramentos. Vá direto ao ponto.`;

// Modelo atualizado, incluindo a instrução de sistema na configuração
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-pro",
    config: {
        systemInstruction: systemInstruction, // AQUI está o segredo
    }
});

// Rota de Chat (existente)
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ reply: "Mensagem vazia." });
  }

  try {
    const result = await model.generateContent(message);
    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return res.status(500).json({
      reply: "Erro ao se comunicar com o Gemini.",
      details: error.message || "Erro desconhecido",
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});