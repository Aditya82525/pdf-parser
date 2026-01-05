import { getAIResponse } from "../services/chat.services.js";

export const getResponse = async (req, res) => {
  try {
    const { question, docId, history } = req.body;

    if (!question || !docId) {
      return res.status(400).json({ message: "Question and docId are required" });
    }

    const aiResponse = await getAIResponse(question, docId, history || []);
    
    res.json(aiResponse);
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
};