import { Router } from "express";
import { db } from "@workspace/db";
import { announcementsTable, faqsTable, newsTable, blogArticlesTable, knowledgeArticlesTable, researchDocumentsTable, caseStudiesTable, testimonialsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";

const router = Router();

// Announcements
router.get("/announcements", async (req, res) => {
  try {
    const results = await db.select().from(announcementsTable).where(eq(announcementsTable.isActive, true)).orderBy(desc(announcementsTable.createdAt));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing announcements");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/announcements", async (req, res) => {
  try {
    const [announcement] = await db.insert(announcementsTable).values(req.body).returning();
    res.status(201).json(announcement);
  } catch (err) {
    req.log.error({ err }, "Error creating announcement");
    res.status(500).json({ error: "Internal server error" });
  }
});

// FAQs
router.get("/faqs", async (req, res) => {
  try {
    const { category } = req.query as Record<string, string>;
    let results = await db.select().from(faqsTable).where(eq(faqsTable.isPublished, true)).orderBy(faqsTable.orderIndex);
    if (category) results = results.filter(f => f.category === category);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing FAQs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/faqs", async (req, res) => {
  try {
    const [faq] = await db.insert(faqsTable).values(req.body).returning();
    res.status(201).json(faq);
  } catch (err) {
    req.log.error({ err }, "Error creating FAQ");
    res.status(500).json({ error: "Internal server error" });
  }
});

// News
router.get("/news", async (req, res) => {
  try {
    const { category, isFeatured } = req.query as Record<string, string>;
    let results = await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
    results = results.filter(n => n.status === "published" || n.status === "featured");
    if (category) results = results.filter(n => n.category === category);
    if (isFeatured === "true") results = results.filter(n => n.isFeatured);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing news");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/news/:slug", async (req, res) => {
  try {
    const [article] = await db.select().from(newsTable).where(eq(newsTable.slug, req.params.slug));
    if (!article) return res.status(404).json({ error: "Article not found" });
    await db.update(newsTable).set({ views: article.views + 1 }).where(eq(newsTable.slug, req.params.slug));
    res.json({ ...article, views: article.views + 1 });
  } catch (err) {
    req.log.error({ err }, "Error getting news article");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/news", async (req, res) => {
  try {
    const [article] = await db.insert(newsTable).values({ ...req.body, publishedAt: new Date() }).returning();
    res.status(201).json(article);
  } catch (err) {
    req.log.error({ err }, "Error creating news article");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Blog Articles
router.get("/blog", async (req, res) => {
  try {
    const { category, isFeatured } = req.query as Record<string, string>;
    let results = await db.select().from(blogArticlesTable).orderBy(desc(blogArticlesTable.createdAt));
    results = results.filter(a => a.status === "published" || a.status === "featured");
    if (category) results = results.filter(a => a.category === category);
    if (isFeatured === "true") results = results.filter(a => a.isFeatured);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing blog articles");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/:slug", async (req, res) => {
  try {
    const [article] = await db.select().from(blogArticlesTable).where(eq(blogArticlesTable.slug, req.params.slug));
    if (!article) return res.status(404).json({ error: "Article not found" });
    await db.update(blogArticlesTable).set({ views: article.views + 1 }).where(eq(blogArticlesTable.slug, req.params.slug));
    res.json({ ...article, views: article.views + 1 });
  } catch (err) {
    req.log.error({ err }, "Error getting blog article");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blog", async (req, res) => {
  try {
    const [article] = await db.insert(blogArticlesTable).values({ ...req.body, publishedAt: new Date() }).returning();
    res.status(201).json(article);
  } catch (err) {
    req.log.error({ err }, "Error creating blog article");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Knowledge Articles
router.get("/knowledge-articles", async (req, res) => {
  try {
    const { category, commodityId } = req.query as Record<string, string>;
    let results = await db.select().from(knowledgeArticlesTable).orderBy(desc(knowledgeArticlesTable.createdAt));
    if (category) results = results.filter(a => a.category === category);
    if (commodityId) results = results.filter(a => a.commodityId === parseInt(commodityId));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing knowledge articles");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/knowledge-articles", async (req, res) => {
  try {
    const [article] = await db.insert(knowledgeArticlesTable).values(req.body).returning();
    res.status(201).json(article);
  } catch (err) {
    req.log.error({ err }, "Error creating knowledge article");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Research Documents
router.get("/research", async (req, res) => {
  try {
    const { topic, isOpenAccess } = req.query as Record<string, string>;
    let results = await db.select().from(researchDocumentsTable).orderBy(desc(researchDocumentsTable.createdAt));
    if (topic) results = results.filter(r => r.topic.toLowerCase().includes(topic.toLowerCase()));
    if (isOpenAccess === "true") results = results.filter(r => r.isOpenAccess);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing research documents");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Case Studies
router.get("/case-studies", async (req, res) => {
  try {
    const { sector, country } = req.query as Record<string, string>;
    let results = await db.select().from(caseStudiesTable).orderBy(desc(caseStudiesTable.createdAt));
    if (sector) results = results.filter(c => c.sector.toLowerCase().includes(sector.toLowerCase()));
    if (country) results = results.filter(c => c.country.toLowerCase() === country.toLowerCase());
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing case studies");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Testimonials
router.get("/testimonials", async (req, res) => {
  try {
    const results = await db.select().from(testimonialsTable).where(eq(testimonialsTable.isPublished, true)).orderBy(desc(testimonialsTable.createdAt));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing testimonials");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/testimonials", async (req, res) => {
  try {
    const [testimonial] = await db.insert(testimonialsTable).values(req.body).returning();
    res.status(201).json(testimonial);
  } catch (err) {
    req.log.error({ err }, "Error creating testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
