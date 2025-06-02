const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Ошибка при обращении к OpenAI:", error.response?.data || error.message);
    res.status(500).json({ error: "Ошибка генерации" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("✅ Сервер запущен");
});
