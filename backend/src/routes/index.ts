import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import contractRoutes from "./contract.routes";
import cpgRoutes from "./cpg.routes";
import dashboardRoutes from "./dashboard.routes";
import contractorRoutes from "./contractor.routes";
import registrationRoutes from "./registration.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/contracts", contractRoutes);
router.use("/cpgs", cpgRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/contractors", contractorRoutes);
router.use("/registrations", registrationRoutes);

export default router;
