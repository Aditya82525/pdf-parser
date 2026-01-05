import { chroma } from "./chroma.client.js";
import { createEmbedding } from "./embedding.services.js";

export const getAIResponse = async (question, docId, history = []) => {
  const collectionName = `pdf_${docId}.pdf`;
  const collection = await chroma.getCollection({ name: collectionName });

  // 1. Generate the vector for the question
  const questionVector = await createEmbedding(question);
  console.log("Vector generated successfully. Length:", questionVector.length);

  // 2. Query ChromaDB
  const results = await collection.query({
    queryEmbeddings: [questionVector],
    nResults: 3,
  });

  // CHECK: Did we find any text in the PDF?
  if (!results.documents || results.documents[0].length === 0) {
    console.log("No matching text found in ChromaDB for this PDF.");
    return { role: "assistant", content: "I couldn't find any relevant information in that document." };
  }

  const context = results.documents[0].join("\n\n");
  console.log("Context found:", context.substring(0, 100) + "...");

  // 3. Talk to Ollama
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      messages: [
        { role: "system", content: `Use this context: ${context}` },
        ...history,
        { role: "user", content: question }
      ],
      stream: false
    })
  });

  const data = await response.json();
  console.log("Ollama Raw Response:", data);

  return data.message;
};