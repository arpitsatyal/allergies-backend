import { Router } from "express";
import { userSchema } from "../utils/schema";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import { authenticate } from "../middlewares/authenticate";
import { register, login, refresh, getUser, getUsers } from "../controller/auth";

const router = Router();

router.post("/login", login);
router.post("/register", validateBody(userSchema), register);
router.post("/refresh", refresh);

router.get("/users", authenticate, authorize, getUsers);
router.get("/user/:id", authenticate, getUser);

export default router;
