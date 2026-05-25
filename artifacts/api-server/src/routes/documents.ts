import { Router } from "express";
import { db } from "@workspace/db";
import { documentsTable } from "@workspace/db";
import { eq, and, ilike, gte, lte, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/documents", async (req, res) => {
  try {
    const { category, status, search, dateFrom, dateTo, module: mod, isSystemGenerated, page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: ReturnType<typeof eq>[] = [];
    if (category) conditions.push(eq(documentsTable.category, category as any));
    if (status) conditions.push(eq(documentsTable.status, status as any));
    if (mod) conditions.push(eq(documentsTable.module, mod));
    if (isSystemGenerated === "true") conditions.push(eq(documentsTable.isSystemGenerated, true));
    if (search) conditions.push(ilike(documentsTable.title, `%${search}%`));
    if (dateFrom) conditions.push(gte(documentsTable.createdAt, new Date(dateFrom)));
    if (dateTo) conditions.push(lte(documentsTable.createdAt, new Date(dateTo)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const docs = await db.select().from(documentsTable)
      .where(where)
      .orderBy(desc(documentsTable.createdAt))
      .limit(limitNum)
      .offset(offset);

    const [countResult] = await db.select({ count: sql<number>`count(*)::int` })
      .from(documentsTable).where(where);

    res.json({
      documents: docs.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description,
        category: d.category,
        documentType: d.documentType,
        status: d.status,
        fileUrl: d.fileUrl,
        fileSizeKb: d.fileSizeKb ?? 0,
        mimeType: d.mimeType,
        module: d.module,
        referenceId: d.referenceId,
        referenceType: d.referenceType,
        ownerName: d.ownerName,
        ownerRole: d.ownerRole,
        tags: d.tags ?? [],
        isSystemGenerated: d.isSystemGenerated,
        isConfidential: d.isConfidential,
        downloadCount: d.downloadCount,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
      })),
      total: countResult?.count ?? 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((countResult?.count ?? 0) / limitNum),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing documents");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/documents/stats", async (req, res) => {
  try {
    const rows = await db.select({
      category: documentsTable.category,
      count: sql<number>`count(*)::int`,
    }).from(documentsTable).groupBy(documentsTable.category);

    const stats: Record<string, number> = {};
    for (const row of rows) stats[row.category] = row.count;
    res.json(stats);
  } catch (err) {
    req.log.error({ err }, "Error getting document stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/documents/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const [doc] = await db.select().from(documentsTable).where(eq(documentsTable.id, id));
    if (!doc) return res.status(404).json({ error: "Document not found" });

    await db.update(documentsTable)
      .set({ downloadCount: (doc.downloadCount ?? 0) + 1 })
      .where(eq(documentsTable.id, id));

    res.json({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      documentType: doc.documentType,
      status: doc.status,
      fileUrl: doc.fileUrl,
      fileSizeKb: doc.fileSizeKb ?? 0,
      mimeType: doc.mimeType,
      module: doc.module,
      referenceId: doc.referenceId,
      referenceType: doc.referenceType,
      ownerName: doc.ownerName,
      ownerRole: doc.ownerRole,
      tags: doc.tags ?? [],
      isSystemGenerated: doc.isSystemGenerated,
      isConfidential: doc.isConfidential,
      downloadCount: (doc.downloadCount ?? 0) + 1,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting document");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/documents", async (req, res) => {
  try {
    const { title, description, category, documentType, status, ownerName, ownerRole, module: mod, tags, isConfidential } = req.body;
    if (!title || !category) return res.status(400).json({ error: "title and category are required" });

    const [created] = await db.insert(documentsTable).values({
      title,
      description: description ?? null,
      category,
      documentType: documentType ?? "pdf",
      status: status ?? "active",
      ownerName: ownerName ?? "System",
      ownerRole: ownerRole ?? "User",
      module: mod ?? null,
      tags: tags ?? [],
      isConfidential: isConfidential ?? false,
      isSystemGenerated: false,
      downloadCount: 0,
    }).returning();

    res.status(201).json({ id: created.id, message: "Document created successfully" });
  } catch (err) {
    req.log.error({ err }, "Error creating document");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/documents/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(documentsTable).where(eq(documentsTable.id, id));
    res.json({ message: "Document deleted" });
  } catch (err) {
    req.log.error({ err }, "Error deleting document");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
