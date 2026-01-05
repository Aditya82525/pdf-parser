import { readFile } from "fs/promises";
import pdf from "pdf-parse/lib/pdf-parse.js";
import crypto from "crypto";
import { createEmbedding } from "./embedding.services.js";
import { chroma } from "./chroma.client.js";

const chunkText = (text, size = 500) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

export const ingestDocument = async (filePath, docId) => {
  const buffer = await readFile(filePath);
  const data = await pdf(buffer);

  const chunks = chunkText(data.text);

  const collection = await chroma.getOrCreateCollection({
    name: `pdf_${docId}`,
  });

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);

    await collection.add({
      documents: [chunk],
      embeddings: [embedding],
      ids: [crypto.randomUUID()],
    });
  }

  console.log(`Embedded ${chunks.length} chunks for doc ${docId}`);

  return {
    docId,
    chunksEmbedded: chunks.length,
  };
};

