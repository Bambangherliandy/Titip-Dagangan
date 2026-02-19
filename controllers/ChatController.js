const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

class ChatController {
  static async chat(req, res, next) {
    try {
      const { message } = req.body;
      if (!message)
        throw { name: "BadRequest", message: "Message is required" };

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Kamu adalah asisten belanja untuk TitipDagangan, sebuah platform e-commerce Indonesia. 
            Tugasmu adalah membantu pembeli dengan:
            - Rekomendasi produk
            - Pertanyaan seputar cara belanja
            - Informasi pengiriman (JNE, J&T, TIKI)
            - Informasi pembayaran (Midtrans)
            - Pertanyaan umum seputar platform
            Jawab dalam Bahasa Indonesia yang ramah dan helpful.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
      });

      const reply = completion.choices[0].message.content;
      res.status(200).json({ data: { reply } });
    } catch (error) {
      console.log("Groq Error:", error);
      next(error);
    }
  }
}

module.exports = ChatController;
