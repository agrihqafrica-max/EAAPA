import { Router } from "express";
import { db } from "@workspace/db";
import { systemSettingsTable, auditLogsTable, errorLogsTable, featureFlagsTable, apiKeysTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

// System Settings
router.get("/system/settings", async (req, res) => {
  try {
    const { category, isPublic } = req.query as Record<string, string>;
    let results = await db.select().from(systemSettingsTable).orderBy(systemSettingsTable.category);
    if (category) results = results.filter(s => s.category === category);
    if (isPublic === "true") results = results.filter(s => s.isPublic);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing system settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/system/settings/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const [setting] = await db.update(systemSettingsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(systemSettingsTable.key, key)).returning();
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    res.json(setting);
  } catch (err) {
    req.log.error({ err }, "Error updating system setting");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Audit Logs
router.get("/system/audit-logs", async (req, res) => {
  try {
    const { entityType, action } = req.query as Record<string, string>;
    let results = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.createdAt)).limit(100);
    if (entityType) results = results.filter(l => l.entityType === entityType);
    if (action) results = results.filter(l => l.action === action);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing audit logs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/system/audit-logs", async (req, res) => {
  try {
    const [log] = await db.insert(auditLogsTable).values(req.body).returning();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error Logs
router.get("/system/error-logs", async (req, res) => {
  try {
    const { level, isResolved } = req.query as Record<string, string>;
    let results = await db.select().from(errorLogsTable).orderBy(desc(errorLogsTable.createdAt)).limit(50);
    if (level) results = results.filter(l => l.level === level);
    if (isResolved !== undefined) results = results.filter(l => l.isResolved === (isResolved === "true"));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing error logs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/system/error-logs/:id/resolve", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [log] = await db.update(errorLogsTable).set({ isResolved: true, resolvedAt: new Date() }).where(eq(errorLogsTable.id, id)).returning();
    res.json(log);
  } catch (err) {
    req.log.error({ err }, "Error resolving error log");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Feature Flags
router.get("/system/feature-flags", async (req, res) => {
  try {
    const results = await db.select().from(featureFlagsTable).orderBy(featureFlagsTable.name);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing feature flags");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/system/feature-flags/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [flag] = await db.update(featureFlagsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(featureFlagsTable.id, id)).returning();
    if (!flag) return res.status(404).json({ error: "Feature flag not found" });
    res.json(flag);
  } catch (err) {
    req.log.error({ err }, "Error updating feature flag");
    res.status(500).json({ error: "Internal server error" });
  }
});

// API Keys
router.get("/system/api-keys", async (req, res) => {
  try {
    const results = await db.select().from(apiKeysTable).orderBy(desc(apiKeysTable.createdAt));
    res.json(results.map(k => ({ ...k, keyHash: "***" })));
  } catch (err) {
    req.log.error({ err }, "Error listing API keys");
    res.status(500).json({ error: "Internal server error" });
  }
});

// System health check
router.get("/system/health", async (req, res) => {
  try {
    const dbCheck = await db.select().from(systemSettingsTable).limit(1);
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      modules: [
        "auth", "organizations", "geography", "agriculture",
        "trade", "logistics", "finance", "training", "analytics",
        "content", "community", "ai", "notifications", "marketing",
        "legal", "system"
      ],
    });
  } catch (err) {
    res.status(503).json({ status: "unhealthy", error: "Database connection failed" });
  }
});

export default router;
