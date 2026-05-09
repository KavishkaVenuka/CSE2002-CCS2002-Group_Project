import express from "express";
import { createRequirement } from "../controllers/requirementController.js";
import { uploadRequirementProof } from "../middleware/uploadMiddleware.js";



const requirementRouter = express.Router();

requirementRouter.post(
  "/create",
  uploadRequirementProof.single("attachedDocument"), 
  createRequirement 
);

export default requirementRouter;