import { chroma } from "../services/chroma.client.js";
export const deleteDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const collectionName = `pdf_${docId}.pdf`;
    
    console.log(`Attempting to delete: ${collectionName}`);

    await chroma.deleteCollection({ name: collectionName });

    res.json({ message: "Success: Data wiped from database." });
  } catch (error) {
    // Check if the error is specifically a "Not Found" error
    if (error.name === "ChromaNotFoundError" || error.message.includes("not found")) {
      console.log("Collection already gone. Nothing to delete.");
      return res.json({ message: "Session was already empty or deleted." });
    }

    console.error("Actual Delete Error:", error);
    res.status(500).json({ error: "System error during deletion." });
  }
};