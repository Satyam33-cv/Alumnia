// apps/api/src/routes/admin.js
// Admin-only: analytics, alumni verification, CSV import
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parse } = require('csv-parse');
const bcrypt = require('bcrypt');
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const email = require('../services/email');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Apply admin guard to all routes below
router.use(authenticate, requireRole('ADMIN'));

// =================== GET /api/admin/stats ===================
// Platform analytics
router.get('/stats', async (req, res) => {
  try {
    const [users, byRole, jobs, openJobs, referrals, referralsByStatus, storiesApproved, storiesPending, events, upcomingEvents, announcements] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
        prisma.jobPosting.count(),
        prisma.jobPosting.count({ where: { status: 'OPEN' } }),
        prisma.referralRequest.count(),
        prisma.referralRequest.groupBy({ by: ['status'], _count: { _all: true } }),
        prisma.successStory.count({ where: { isApproved: true } }),
        prisma.successStory.count({ where: { isApproved: false } }),
        prisma.event.count(),
        prisma.event.count({ where: { date: { gte: new Date() } } }),
        prisma.announcement.count(),
      ]);

    const [recentUsers, recentReferrals] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' }, take: 5,
        select: { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true },
      }),
      prisma.referralRequest.findMany({
        orderBy: { createdAt: 'desc' }, take: 5,
        select: {
          id: true, status: true, createdAt: true,
          job: { select: { title: true, company: true } },
          requestedBy: { select: { name: true } },
        },
      }),
    ]);

    const verified = await prisma.user.count({ where: { isVerified: true } });

    res.json({
      stats: {
        users: { total: users, verified, byRole: Object.fromEntries(byRole.map(r => [r.role, r._count._all])) },
        jobs: { total: jobs, open: openJobs },
        referrals: { total: referrals, byStatus: Object.fromEntries(referralsByStatus.map(r => [r.status, r._count._all])) },
        stories: { approved: storiesApproved, pending: storiesPending },
        events: { total: events, upcoming: upcomingEvents },
        announcements,
      },
      recentUsers,
      recentReferrals,
    });
  } catch (err) {
    console.error('GET /admin/stats error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// =================== GET /api/admin/users ===================
// List all users for verification (paginated, filterable)
router.get('/users', async (req, res) => {
  try {
    const { role, verified, search, page = 1, limit = 25 } = req.query;
    const where = {};
    if (role && role !== 'ALL') where.role = role;
    if (verified === 'true') where.isVerified = true;
    if (verified === 'false') where.isVerified = false;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { currentCompany: { contains: search, mode: 'insensitive' } },
      ];
    }

    const take = Math.min(Math.max(parseInt(limit) || 25, 1), 100);
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const skip = (pageNum - 1) * take;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take,
        select: {
          id: true, name: true, email: true, role: true, isVerified: true, isActive: true,
          batchYear: true, department: true, currentCompany: true, jobTitle: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, pagination: { total, page: pageNum, limit: take, pages: Math.ceil(total / take) } });
  } catch (err) {
    console.error('GET /admin/users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// =================== PATCH /api/admin/users/:id/verify ===================
router.patch('/users/:id/verify', async (req, res) => {
  try {
    const { verified } = req.body;
    if (typeof verified !== 'boolean') return res.status(400).json({ error: 'verified must be a boolean' });

    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isVerified: verified },
      select: { id: true, name: true, email: true, role: true, isVerified: true },
    });

    res.json({ user: updated });
  } catch (err) {
    console.error('PATCH /admin/users/:id/verify error:', err);
    res.status(500).json({ error: 'Failed to update verification' });
  }
});

// =================== POST /api/admin/import-csv ===================
// Bulk import alumni from CSV (multipart 'file' field)
router.post('/import-csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded (field name: file)' });
    if (req.file.mimetype !== 'text/csv' && !req.file.originalname.endsWith('.csv')) {
      return res.status(400).json({ error: 'Only CSV files are allowed' });
    }

    const records = await new Promise((resolve, reject) => {
      parse(req.file.buffer.toString('utf8'), { columns: true, skip_empty_lines: true, trim: true, relax_column_count: true },
        (err, recs) => (err ? reject(err) : resolve(recs)));
    });

    const tempPassword = process.env.CSV_TEMP_PASSWORD || 'Welcome@2026';
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const imported = [];
    const skipped = [];
    const failed = [];
    let index = 0;

    for (const row of records) {
      index += 1;
      const name = row.name || row.Name;
      const email = (row.email || row.Email || '').toLowerCase().trim();

      if (!name || !email) { failed.push({ row: index, reason: 'missing name/email' }); continue; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { failed.push({ row: index, email, reason: 'invalid email format' }); continue; }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) { skipped.push({ row: index, email, reason: 'email already registered' }); continue; }

      await prisma.user.create({
        data: {
          name: String(name).trim(),
          email,
          passwordHash,
          role: 'ALUMNI',
          isVerified: false,
          batchYear: row.batchYear || row.batch ? parseInt(row.batchYear || row.batch) : null,
          department: row.department || row.dept || null,
          rollNumber: row.rollNumber || null,
          currentCompany: row.currentCompany || row.company || null,
          jobTitle: row.jobTitle || row.role2 || null,
          location: row.location || null,
          phone: row.phone || null,
          linkedinUrl: row.linkedinUrl || row.linkedin || null,
        },
      });
      imported.push({ name: String(name).trim(), email });
    }

    // Send welcome emails to all newly created alumni
    if (imported.length > 0) {
      console.log(`📧 Sending ${imported.length} welcome email(s)`);
      await Promise.all(imported.map((u) => email.sendWelcomeEmail({ to: u.email, name: u.name, tempPassword })));
    }

    res.status(201).json({
      summary: {
        total: records.length,
        imported: imported.length,
        skipped: skipped.length,
        failed: failed.length,
      },
      imported, skipped, failed,
    });
  } catch (err) {
    console.error('POST /admin/import-csv error:', err);
    res.status(500).json({ error: 'Failed to import CSV' });
  }
});

module.exports = router;
