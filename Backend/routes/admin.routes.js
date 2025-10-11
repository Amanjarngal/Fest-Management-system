import express from "express";
import { makeAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/make-admin", makeAdmin);

export default router;
