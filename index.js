const express = require("express");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
const PORT = 3000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Anilson Chat Server está funcionando!");
});

app.post("/chat", async (req, res) => {
  try {
    const mensagem = req.body.message;

    if (!mensagem) {
      return res.status(400).json({
        error: "Mensagem não enviada."
      });
    }

    const resposta = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "Você é o Anilson Chat, um assistente amigável. Responda em português de forma clara, natural e útil."
        },
        {
          role: "user",
          content: mensagem
        }
      ]
    });

    const texto = resposta.choices[0].message.content;

    res.json({
      reply: texto
    });

  } catch (error) {
    console.error("Erro na IA:", error);

    res.status(500).json({
      error: "Não foi possível obter uma resposta da IA."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Anilson Chat Server rodando na porta ${PORT}`);
});