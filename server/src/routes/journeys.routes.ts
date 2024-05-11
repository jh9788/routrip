import JourneysController from "@/controller/journeys.ctl";
import { authenticateUser } from "@/middlewares/authentication";
import express from "express";

const router = express.Router();
router.use(express.json());

router.get("/:id");
router.get("/");
router.post("/", authenticateUser, JourneysController.addJourney);
router.put("/:id");
router.delete("/:id");

export default router;
