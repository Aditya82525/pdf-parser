import express from "express";
import { deleteDocument } from "../controller/delete.controller.js";

const router = express.Router();


router.delete("/:docId", deleteDocument);

export default router;
