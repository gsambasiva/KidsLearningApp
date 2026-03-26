/**
 * SmartKids Learning App - Email Service
 * Sends transactional emails (reports, reminders)
 */

const nodemailer = require('nodemailer');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send weekly progress report to parents
 */
exports.sendWeeklyProgressReports = async () => {
  if (!process.env.EMAIL_USER) {
    console.log('[Email] Email not configured — skipping weekly reports');
    return;
  }

  const parents = await User.find({ role: 'parent', isActive: true, 'settings.notificationsEnabled': true });

  for (const parent of parents) {
    try {
      const children = await User.find({ parentId: parent._id, role: 'child' });

      if (children.length === 0) continue;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      let reportHtml = `<h2>📊 Weekly Progress Report for Your Children</h2>`;

      for (const child of children) {
        const results = await QuizResult.find({
          userId: child._id,
          completedAt: { $gte: weekAgo },
        });

        const avgScore = results.length > 0
          ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length)
          : 0;

        reportHtml += `
          <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 16px; margin: 12px 0;">
            <h3>${child.avatar || '🧒'} ${child.firstName} (Grade ${child.grade})</h3>
            <p>✅ Quizzes completed: <strong>${results.length}</strong></p>
            <p>📊 Average score: <strong>${avgScore}%</strong></p>
            <p>🔥 Current streak: <strong>${child.streak?.current || 0} days</strong></p>
            ${results.length === 0 ? '<p>⚠️ No activity this week. Encourage them to practice!</p>' : ''}
          </div>
        `;
      }

      await sendEmail({
        to: parent.email,
        subject: '📚 SmartKids Weekly Report',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #4CAF50; padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">🧠 SmartKids</h1>
              <p style="color: rgba(255,255,255,0.9);">Weekly Learning Report</p>
            </div>
            <div style="padding: 24px; background: #f9f9f9;">
              <p>Hi ${parent.firstName}!</p>
              ${reportHtml}
              <p style="margin-top: 20px;">Keep encouraging your children to learn every day! 🌟</p>
            </div>
            <div style="background: #e0e0e0; padding: 12px; text-align: center; border-radius: 0 0 16px 16px;">
              <small>SmartKids Learning App — Making learning fun!</small>
            </div>
          </div>
        `,
      });
    } catch (err) {
      console.error(`[Email] Error sending report to ${parent.email}:`, err);
    }
  }
};

/**
 * Send welcome email
 */
exports.sendWelcomeEmail = async (user) => {
  if (!process.env.EMAIL_USER) return;

  await sendEmail({
    to: user.email,
    subject: '🎉 Welcome to SmartKids Learning!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="background: linear-gradient(135deg, #4CAF50, #388E3C); padding: 40px; border-radius: 16px;">
          <h1 style="color: white; font-size: 48px; margin: 0;">🧠</h1>
          <h2 style="color: white; margin-top: 12px;">Welcome to SmartKids!</h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 18px;">Hi ${user.firstName}! You're ready to start learning!</p>
        </div>
        <div style="padding: 24px;">
          <p>Open the SmartKids app to start your learning adventure! 🚀</p>
          <p>⭐ Earn stars · 🪙 Collect coins · 🏆 Win badges</p>
        </div>
      </div>
    `,
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'SmartKids <noreply@smartkids.com>',
    to,
    subject,
    html,
  });
  console.log(`[Email] Sent "${subject}" to ${to}`);
};
