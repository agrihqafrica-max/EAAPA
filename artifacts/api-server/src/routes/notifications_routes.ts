import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable, conversationsTable, messagesTable, notificationPreferencesTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// Notifications
router.get("/notifications", async (req, res) => {
  try {
    const { memberId, isRead, type } = req.query as Record<string, string>;
    let results = await db.select().from(notificationsTable).orderBy(desc(notificationsTable.createdAt));
    if (memberId) results = results.filter(n => n.memberId === parseInt(memberId));
    if (isRead !== undefined) results = results.filter(n => n.isRead === (isRead === "true"));
    if (type) results = results.filter(n => n.type === type);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing notifications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/notifications/:id/read", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [notification] = await db.update(notificationsTable).set({ isRead: true, readAt: new Date() }).where(eq(notificationsTable.id, id)).returning();
    if (!notification) return res.status(404).json({ error: "Notification not found" });
    res.json(notification);
  } catch (err) {
    req.log.error({ err }, "Error marking notification as read");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notifications/read-all", async (req, res) => {
  try {
    const { memberId } = req.body;
    if (memberId) {
      await db.update(notificationsTable).set({ isRead: true, readAt: new Date() }).where(and(eq(notificationsTable.memberId, memberId), eq(notificationsTable.isRead, false)));
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error marking all as read");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notifications", async (req, res) => {
  try {
    const [notification] = await db.insert(notificationsTable).values(req.body).returning();
    res.status(201).json(notification);
  } catch (err) {
    req.log.error({ err }, "Error creating notification");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Conversations
router.get("/conversations", async (req, res) => {
  try {
    const { participantId } = req.query as Record<string, string>;
    let results = await db.select().from(conversationsTable).orderBy(desc(conversationsTable.updatedAt));
    if (participantId) {
      const pid = parseInt(participantId);
      results = results.filter(c => c.participantOneId === pid || c.participantTwoId === pid);
    }
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing conversations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const [conversation] = await db.insert(conversationsTable).values(req.body).returning();
    res.status(201).json(conversation);
  } catch (err) {
    req.log.error({ err }, "Error creating conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Messages
router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const results = await db.select().from(messagesTable).where(eq(messagesTable.conversationId, conversationId)).orderBy(messagesTable.createdAt);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const [message] = await db.insert(messagesTable).values({ ...req.body, conversationId }).returning();
    await db.update(conversationsTable).set({
      lastMessageAt: new Date(),
      lastMessagePreview: req.body.content?.slice(0, 100),
      updatedAt: new Date(),
    }).where(eq(conversationsTable.id, conversationId));
    res.status(201).json(message);
  } catch (err) {
    req.log.error({ err }, "Error sending message");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Notification Preferences
router.get("/notification-preferences/:memberId", async (req, res) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const [prefs] = await db.select().from(notificationPreferencesTable).where(eq(notificationPreferencesTable.memberId, memberId));
    res.json(prefs || { memberId, emailAlerts: true, pushNotifications: true, marketAlerts: true, weeklyDigest: true });
  } catch (err) {
    req.log.error({ err }, "Error getting notification preferences");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/notification-preferences/:memberId", async (req, res) => {
  try {
    const memberId = parseInt(req.params.memberId);
    const existing = await db.select().from(notificationPreferencesTable).where(eq(notificationPreferencesTable.memberId, memberId));
    let prefs;
    if (existing.length) {
      [prefs] = await db.update(notificationPreferencesTable).set({ ...req.body, updatedAt: new Date() }).where(eq(notificationPreferencesTable.memberId, memberId)).returning();
    } else {
      [prefs] = await db.insert(notificationPreferencesTable).values({ ...req.body, memberId }).returning();
    }
    res.json(prefs);
  } catch (err) {
    req.log.error({ err }, "Error updating notification preferences");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
