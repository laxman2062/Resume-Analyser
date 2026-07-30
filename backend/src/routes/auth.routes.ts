import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);


router.get("/me", verifyToken, (req, res) => {
    res.json({message: "you are wuthenticated!", user: req.user});
});
export default router;