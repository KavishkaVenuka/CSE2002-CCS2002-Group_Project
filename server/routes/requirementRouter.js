import express from "express";
import {
    getAllRequirements,
    getRequirementStats,
    getRequirementById,
    createRequirement,
    updateRequirementStatus,
} from "../controllers/requirementController.js";
import { uploadRequirementProof } from "../middleware/uploadMiddleware.js";

const requirementRouter = express.Router();

// ──────────────────────────────────────────────
// GET  /api/requirements             → list (filtered by customerId, status, search)
// GET  /api/requirements/stats       → stats for the frontend boxes
// GET  /api/requirements/:id         → single record detail
// POST /api/requirements             → create (multipart/form-data + optional file)
// PATCH /api/requirements/:id/status → admin updates lifecycle status
// ──────────────────────────────────────────────

// NOTE: /stats must be defined BEFORE /:id so Express doesn't treat "stats" as an id param
requirementRouter.get("/stats", getRequirementStats);

requirementRouter.get("/", getAllRequirements);
requirementRouter.get("/:id", getRequirementById);

requirementRouter.post(
    "/",
    uploadRequirementProof.single("attachedDocument"),
    createRequirement
);

requirementRouter.patch("/:id/status", updateRequirementStatus);

export default requirementRouter;