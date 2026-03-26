import { Router } from "express";
import { db } from "@workspace/db";
import { trainingProgramsTable, trainingModulesTable, trainingSessionsTable, programEnrollmentsTable, mentorshipMatchesTable, mentorshipSessionsTable, certificationsTable, userCertificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// Training Programs
router.get("/training-programs", async (req, res) => {
  try {
    const { category, level, delivery, status, country } = req.query as Record<string, string>;
    let results = await db.select().from(trainingProgramsTable).orderBy(desc(trainingProgramsTable.createdAt));
    if (category) results = results.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    if (level) results = results.filter(p => p.level === level);
    if (delivery) results = results.filter(p => p.delivery === delivery);
    if (status) results = results.filter(p => p.status === status);
    if (country) results = results.filter(p => p.country.toLowerCase() === country.toLowerCase());
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing training programs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/training-programs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [program] = await db.select().from(trainingProgramsTable).where(eq(trainingProgramsTable.id, id));
    if (!program) return res.status(404).json({ error: "Program not found" });
    const modules = await db.select().from(trainingModulesTable).where(eq(trainingModulesTable.programId, id));
    const sessions = await db.select().from(trainingSessionsTable).where(eq(trainingSessionsTable.programId, id));
    res.json({ ...program, modules, sessions });
  } catch (err) {
    req.log.error({ err }, "Error getting training program");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/training-programs", async (req, res) => {
  try {
    const [program] = await db.insert(trainingProgramsTable).values(req.body).returning();
    res.status(201).json(program);
  } catch (err) {
    req.log.error({ err }, "Error creating training program");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/training-programs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [program] = await db.update(trainingProgramsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(trainingProgramsTable.id, id)).returning();
    if (!program) return res.status(404).json({ error: "Program not found" });
    res.json(program);
  } catch (err) {
    req.log.error({ err }, "Error updating training program");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Enrollments
router.get("/enrollments", async (req, res) => {
  try {
    const { programId, memberId, status } = req.query as Record<string, string>;
    let results = await db.select().from(programEnrollmentsTable).orderBy(desc(programEnrollmentsTable.createdAt));
    if (programId) results = results.filter(e => e.programId === parseInt(programId));
    if (memberId) results = results.filter(e => e.memberId === parseInt(memberId));
    if (status) results = results.filter(e => e.status === status);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing enrollments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/enrollments", async (req, res) => {
  try {
    const { programId } = req.body;
    const [enrollment] = await db.insert(programEnrollmentsTable).values(req.body).returning();
    const [program] = await db.select().from(trainingProgramsTable).where(eq(trainingProgramsTable.id, programId));
    if (program) {
      await db.update(trainingProgramsTable).set({ currentEnrollment: program.currentEnrollment + 1, updatedAt: new Date() }).where(eq(trainingProgramsTable.id, programId));
    }
    res.status(201).json(enrollment);
  } catch (err) {
    req.log.error({ err }, "Error creating enrollment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/enrollments/:id/progress", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { progressPercent, status } = req.body;
    const [enrollment] = await db.update(programEnrollmentsTable).set({ progressPercent, status, updatedAt: new Date() }).where(eq(programEnrollmentsTable.id, id)).returning();
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    req.log.error({ err }, "Error updating enrollment");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mentorship Matches
router.get("/mentorship-matches", async (req, res) => {
  try {
    const { mentorId, menteeId, status } = req.query as Record<string, string>;
    let results = await db.select().from(mentorshipMatchesTable).orderBy(desc(mentorshipMatchesTable.createdAt));
    if (mentorId) results = results.filter(m => m.mentorId === parseInt(mentorId));
    if (menteeId) results = results.filter(m => m.menteeId === parseInt(menteeId));
    if (status) results = results.filter(m => m.status === status);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing mentorship matches");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/mentorship-matches", async (req, res) => {
  try {
    const [match] = await db.insert(mentorshipMatchesTable).values(req.body).returning();
    res.status(201).json(match);
  } catch (err) {
    req.log.error({ err }, "Error creating mentorship match");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Certifications
router.get("/certifications", async (req, res) => {
  try {
    const results = await db.select().from(certificationsTable).where(eq(certificationsTable.isActive, true));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing certifications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user-certifications", async (req, res) => {
  try {
    const { memberId, isActive } = req.query as Record<string, string>;
    let results = await db.select().from(userCertificationsTable);
    if (memberId) results = results.filter(c => c.memberId === parseInt(memberId));
    if (isActive === "true") results = results.filter(c => c.isActive);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing user certifications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/user-certifications", async (req, res) => {
  try {
    const certificateNumber = `CERT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const [cert] = await db.insert(userCertificationsTable).values({ ...req.body, certificateNumber }).returning();
    res.status(201).json(cert);
  } catch (err) {
    req.log.error({ err }, "Error issuing certification");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
