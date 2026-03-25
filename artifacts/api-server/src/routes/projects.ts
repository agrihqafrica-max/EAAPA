import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, forumThreadsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status } = req.query as Record<string, string>;
    let projects = await db.select().from(projectsTable);
    if (status) projects = projects.filter((p) => p.status === status);
    res.json(projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      leader: p.leader,
      leaderId: p.leaderId,
      status: p.status,
      commodity: p.commodity,
      region: p.region,
      startDate: p.startDate,
      memberCount: p.memberCount,
      isJoined: false,
      tags: p.tags as string[],
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing projects");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, commodity, region, startDate, tags } = req.body;
    const [project] = await db.insert(projectsTable).values({
      title, description, commodity, region, startDate,
      leader: "Current User", leaderId: 1, memberCount: 1,
      tags: tags ?? [],
    }).returning();
    res.status(201).json({ ...project, isJoined: true, tags: project.tags as string[] });
  } catch (err) {
    req.log.error({ err }, "Error creating project");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/join", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
    if (!project) return res.status(404).json({ error: "Project not found" });
    await db.update(projectsTable).set({ memberCount: project.memberCount + 1 }).where(eq(projectsTable.id, id));
    res.json({ ...project, memberCount: project.memberCount + 1, isJoined: true, tags: project.tags as string[] });
  } catch (err) {
    req.log.error({ err }, "Error joining project");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/forum/threads", async (req, res) => {
  try {
    const { category } = req.query as Record<string, string>;
    let threads = await db.select().from(forumThreadsTable);
    if (category) threads = threads.filter((t) => t.category === category);
    res.json(threads.map((t) => ({
      id: t.id,
      title: t.title,
      content: t.content,
      category: t.category,
      author: t.author,
      authorId: t.authorId,
      replies: t.replies,
      views: t.views,
      createdAt: t.createdAt.toISOString(),
      tags: t.tags as string[],
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing forum threads");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/forum/threads", async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const [thread] = await db.insert(forumThreadsTable).values({
      title, content, category, author: "Current User", authorId: 1, tags: tags ?? [],
    }).returning();
    res.status(201).json({ ...thread, createdAt: thread.createdAt.toISOString(), tags: thread.tags as string[] });
  } catch (err) {
    req.log.error({ err }, "Error creating forum thread");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
