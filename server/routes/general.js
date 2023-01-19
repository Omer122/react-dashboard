import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";

const router = express.Router();

router.get("/user/:id", getUser); //have to pass the id so can grab it
router.get("/dashboard", getDashboardStats);

export default router;
