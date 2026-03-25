import { Router, type IRouter } from "express";
import healthRouter from "./health";
import membersRouter from "./members";
import marketRouter from "./market";
import opportunitiesRouter from "./opportunities";
import projectsRouter from "./projects";
import eventsRouter from "./events";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/members", membersRouter);
router.use("/", marketRouter);
router.use("/opportunities", opportunitiesRouter);
router.use("/", projectsRouter);
router.use("/", eventsRouter);

export default router;
