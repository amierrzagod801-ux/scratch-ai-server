import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Scratch AI Server is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const question = String(req.body?.question || "").trim();

    if (!question) {
      return res.status(400).json({
        error: "question is required"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "تو یک دستیار هوش مصنوعی فارسی برای پروژه Scratch هستی. " +
        "پاسخ را واضح و قابل فهم بده. " +
        "اگر سؤال به اطلاعات جدید یا اینترنت نیاز دارد، از جستجوی وب استفاده کن.",
      tools: [
        {
          type: "web_search"
        }
      ],
      input: question
    });

    res.json({
      answer: response.output_text || "پاسخی دریافت نشد."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "خطا در ارتباط با هوش مصنوعی"
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Scratch AI Server running on port ${PORT}`);
});
