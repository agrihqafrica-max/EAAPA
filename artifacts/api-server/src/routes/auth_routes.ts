import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, userProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createHash, randomUUID } from "crypto";

const router = Router();

// In-memory stores (production would use Redis)
const otpStore = new Map<string, { code: string; expiresAt: number }>();
const sessions = new Map<string, { userId: number; createdAt: number }>();

function hashPass(raw: string) {
  return createHash("sha256").update(raw + "eaapa_2025_salt").digest("hex");
}

function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function buildUserResponse(userId: number, token: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  const [profile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, userId));
  if (!user) return null;
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      status: user.status,
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      phone: profile?.phone ?? null,
      nationalId: profile?.nationalId ?? null,
      country: profile?.country ?? "Kenya",
      region: profile?.region ?? null,
      avatarUrl: profile?.avatarUrl ?? null,
      bio: profile?.bio ?? null,
    },
  };
}

// POST /api/auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const { email, firstName, lastName, phone, nationalId, country, region } = req.body;
    if (!email || !firstName || !lastName) {
      return res.status(400).json({ error: "email, firstName and lastName are required" });
    }

    // Check duplicate email
    const [existing] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
    if (existing) return res.status(409).json({ error: "An account with this email already exists. Please sign in." });

    // Create user
    const [user] = await db.insert(usersTable).values({
      email: email.toLowerCase().trim(),
      passwordHash: hashPass(email + Date.now()),
      isEmailVerified: false,
      status: "active",
    }).returning();

    // Create profile
    await db.insert(userProfilesTable).values({
      userId: user.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() ?? null,
      nationalId: nationalId?.trim() ?? null,
      country: country ?? "Kenya",
      region: region ?? null,
    });

    const token = randomUUID();
    sessions.set(token, { userId: user.id, createdAt: Date.now() });

    const payload = await buildUserResponse(user.id, token);
    res.status(201).json({ ...payload, message: "Account created successfully. Welcome to EAAPA!" });
  } catch (err: any) {
    req.log.error({ err }, "Register error");
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// POST /api/auth/login/id  — passwordless National ID login
router.post("/auth/login/id", async (req, res) => {
  try {
    const { nationalId } = req.body;
    if (!nationalId?.trim()) return res.status(400).json({ error: "National ID is required" });

    const [profile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.nationalId, nationalId.trim()));
    if (!profile) {
      return res.status(404).json({ error: "No account found with this National ID. Please register first." });
    }

    const token = randomUUID();
    sessions.set(token, { userId: profile.userId, createdAt: Date.now() });

    const payload = await buildUserResponse(profile.userId, token);
    res.json({ ...payload, message: "Signed in successfully." });
  } catch (err: any) {
    req.log.error({ err }, "Login/ID error");
    res.status(500).json({ error: "Sign in failed. Please try again." });
  }
});

// POST /api/auth/otp/send
router.post("/auth/otp/send", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone?.trim()) return res.status(400).json({ error: "Phone number is required" });

    const code = genOtp();
    otpStore.set(phone.trim(), { code, expiresAt: Date.now() + 5 * 60 * 1000 });

    // In production: send real SMS via Africa's Talking / Twilio
    console.log(`[OTP DEMO] Phone: ${phone} → Code: ${code}`);

    res.json({
      success: true,
      message: "OTP sent to your phone number.",
      preview: code, // shown in UI for demo purposes only
    });
  } catch (err: any) {
    req.log.error({ err }, "OTP send error");
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});

// POST /api/auth/otp/verify
router.post("/auth/otp/verify", async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone?.trim() || !code?.trim()) return res.status(400).json({ error: "Phone and code are required" });

    const stored = otpStore.get(phone.trim());
    if (!stored) return res.status(400).json({ error: "No OTP found for this number. Please request a new one." });
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone.trim());
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }
    if (stored.code !== code.trim()) return res.status(400).json({ error: "Incorrect OTP. Please try again." });

    const [profile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.phone, phone.trim()));
    if (!profile) {
      return res.status(404).json({
        error: "No account found for this phone number.",
        suggestion: "Please register an account first, or check your phone number.",
      });
    }

    otpStore.delete(phone.trim());
    const token = randomUUID();
    sessions.set(token, { userId: profile.userId, createdAt: Date.now() });

    const payload = await buildUserResponse(profile.userId, token);
    res.json({ ...payload, message: "Signed in successfully via OTP." });
  } catch (err: any) {
    req.log.error({ err }, "OTP verify error");
    res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

// GET /api/auth/session — validate existing token
router.get("/auth/session", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ error: "No token provided" });

    const session = sessions.get(token);
    if (!session) return res.status(401).json({ error: "Session expired or invalid" });

    // Expire sessions after 7 days
    if (Date.now() - session.createdAt > 7 * 24 * 60 * 60 * 1000) {
      sessions.delete(token);
      return res.status(401).json({ error: "Session expired" });
    }

    const payload = await buildUserResponse(session.userId, token);
    if (!payload) return res.status(401).json({ error: "User not found" });
    res.json(payload);
  } catch (err: any) {
    req.log.error({ err }, "Session validate error");
    res.status(500).json({ error: "Session validation failed" });
  }
});

// POST /api/auth/logout
router.post("/auth/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (token) sessions.delete(token);
  res.json({ success: true, message: "Signed out successfully." });
});

export default router;
