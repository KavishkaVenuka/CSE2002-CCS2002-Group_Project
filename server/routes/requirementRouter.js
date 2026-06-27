import express from "express";
import {
  getAllRequirements,
  getRequirementStats,
  getRequirementById,
  createRequirement,
  updateRequirementStatus,
} from "../controllers/requirementController.js";
import { uploadRequirementProof } from "../middleware/uploadMiddleware.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const requirementRouter = express.Router();

// Base path: /api/requirements
// NOTE: /stats must be defined BEFORE /:id so Express doesn't treat "stats" as an id param.

// ── Shared (any authenticated user) ───────────────────────────────────────
// Customers filter by ?customerId=, suppliers/admins may see broader results.
requirementRouter.get("/stats", requireAuth, getRequirementStats);
requirementRouter.get("/",      requireAuth, getAllRequirements);
requirementRouter.get("/:id",   requireAuth, getRequirementById);

// ── Create — authenticated customers submit requirements ───────────────────
requirementRouter.post(
  "/",
  requireAuth,
  uploadRequirementProof.single("attachedDocument"),
  createRequirement
);

// ── Status update — Admin only ─────────────────────────────────────────────
requirementRouter.patch("/:id/status", requireAuth, requireAdmin, updateRequirementStatus);

export default requirementRouter;