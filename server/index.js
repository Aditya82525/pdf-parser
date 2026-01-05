import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import uploadRoutes from "./routes/upload.js";
import chatRoutes from "./routes/chat.js";
import deleteRoutes from "./routes/delete.js"
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

app.use("/api/ingest", deleteRoutes);
app.get("/", (req, res) => {
  res.send("Server is running ");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});