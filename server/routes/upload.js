import express from "express";
import {getdocument} from "../controller/upload.controller.js";

const router = express.Router();


router.post("/", getdocument);

export default router;