import { Router } from "express";

import { validateBody } from "../middlewares/validate";
import { authenticate } from "../middlewares/authenticate";
import * as allergyController from "../controller/allergies";
import { checkUserExists } from "../middlewares/checkUserExists";
import { allergySchema, updateAllergySchema } from "../utils/schema";

const router = Router();

router.use(authenticate);
router.use(checkUserExists);

router
  .route("/")
  .get(allergyController.getAllergies)
  .post(validateBody(allergySchema), allergyController.createAllergy);

router
  .route("/:id")
  .get(allergyController.getAllergy)
  .put(validateBody(updateAllergySchema), allergyController.updateAllergy)
  .delete(allergyController.deleteAllergy);

router.put(
  "/mark-as-high-risk/:id",
  validateBody(updateAllergySchema),
  allergyController.markAsHighRisk
);

router.post("/search", allergyController.searchAllergy);
router.post("/upload-image", allergyController.imageUpload);

router.get("/get-comments/:id", allergyController.getComments);
router.put("/add-comment/:id", allergyController.addComment);
router.put("/delete-comment/:id", allergyController.deleteComment);

export default router;
