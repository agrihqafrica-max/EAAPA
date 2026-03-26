import { Router, type IRouter } from "express";
import healthRouter from "./health";
import membersRouter from "./members";
import marketRouter from "./market";
import opportunitiesRouter from "./opportunities";
import projectsRouter from "./projects";
import eventsRouter from "./events";
import organizationsRouter from "./organizations";
import agricultureRouter from "./agriculture";
import tradeRouter from "./trade";
import logisticsRouter from "./logistics";
import financeRouter from "./finance";
import trainingRouter from "./training_routes";
import analyticsRouter from "./analytics";
import contentRouter from "./content_routes";
import aiRouter from "./ai_routes";
import notificationsRouter from "./notifications_routes";
import geographyRouter from "./geography";
import systemRouter from "./system";

const router: IRouter = Router();

router.use(healthRouter);

// Core modules (existing)
router.use("/members", membersRouter);
router.use("/", marketRouter);
router.use("/opportunities", opportunitiesRouter);
router.use("/", projectsRouter);
router.use("/", eventsRouter);

// New modules
router.use("/", organizationsRouter);
router.use("/", agricultureRouter);
router.use("/", tradeRouter);
router.use("/", logisticsRouter);
router.use("/", financeRouter);
router.use("/", trainingRouter);
router.use("/", analyticsRouter);
router.use("/", contentRouter);
router.use("/", aiRouter);
router.use("/", notificationsRouter);
router.use("/", geographyRouter);
router.use("/", systemRouter);

export default router;
