import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface ParentApprovalEmailOptions {
    to: string;
    studentName: string;
    rollNo: string;
    destination: string;
    purpose: string;
    modeOfTransport: string;
    expectedDate: string;
    expectedTime: string;
    approveUrl: string;
    rejectUrl: string;
}

interface PasswordResetEmailOptions {
    to: string;
    userName: string;
    resetUrl: string;
}

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    async sendParentApprovalEmail(opts: ParentApprovalEmailOptions): Promise<void> {
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gatepass Approval Request</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:#0D1B2A;padding:28px 32px;text-align:center;">
              <p style="margin:0;color:#FFE38A;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">IIIT Sri City</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:800;">Gatepass Approval Request</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 0;">
              <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
                Dear Parent / Guardian,
              </p>
              <p style="margin:14px 0 0;color:#374151;font-size:15px;line-height:1.6;">
                Your ward <strong>${opts.studentName}</strong> (${opts.rollNo}) has raised a <strong>Home Pass</strong> request. Please review the details below and approve or reject.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr style="background:#f9fafb;">
                  <td style="padding:10px 16px;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #e5e7eb;">Field</td>
                  <td style="padding:10px 16px;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #e5e7eb;">Details</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;color:#6b7280;font-size:13px;border-bottom:1px solid #f3f4f6;">Destination</td>
                  <td style="padding:12px 16px;color:#111827;font-size:14px;font-weight:700;border-bottom:1px solid #f3f4f6;">${opts.destination}</td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:12px 16px;color:#6b7280;font-size:13px;border-bottom:1px solid #f3f4f6;">Purpose</td>
                  <td style="padding:12px 16px;color:#111827;font-size:14px;font-weight:700;border-bottom:1px solid #f3f4f6;">${opts.purpose}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;color:#6b7280;font-size:13px;border-bottom:1px solid #f3f4f6;">Mode of Transport</td>
                  <td style="padding:12px 16px;color:#111827;font-size:14px;font-weight:700;border-bottom:1px solid #f3f4f6;">${opts.modeOfTransport}</td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:12px 16px;color:#6b7280;font-size:13px;">Expected Return</td>
                  <td style="padding:12px 16px;color:#111827;font-size:14px;font-weight:700;">${opts.expectedDate} at ${opts.expectedTime}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px;color:#374151;font-size:14px;font-weight:700;text-align:center;">Please respond within 72 hours. This link will expire after use.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" align="center">
                    <a href="${opts.approveUrl}" style="display:inline-block;width:100%;padding:14px 0;background:#15803d;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;border-radius:7px;text-align:center;box-sizing:border-box;">
                      ✓ Approve
                    </a>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" align="center">
                    <a href="${opts.rejectUrl}" style="display:inline-block;width:100%;padding:14px 0;background:#b91c1c;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;border-radius:7px;text-align:center;box-sizing:border-box;">
                      ✗ Reject
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb;padding:18px 32px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">This is an automated message from IIIT Sri City Hostel Gatepass System. Do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        await this.transporter.sendMail({
            from: `"IIIT Sri City Gatepass" <${process.env.GMAIL_USER}>`,
            to: opts.to,
            subject: `Gatepass Approval Required — ${opts.studentName}`,
            html,
        });
    }

    async sendPasswordResetEmail(opts: PasswordResetEmailOptions): Promise<void> {
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#0D1B2A;padding:28px 32px;text-align:center;">
              <p style="margin:0;color:#FFE38A;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">IIIT Sri City</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:800;">Password Reset Request</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">Hi <strong>${opts.userName}</strong>,</p>
              <p style="margin:14px 0 0;color:#374151;font-size:15px;line-height:1.6;">
                We received a request to reset your Gatepass account password. If you didn't make this request, you can safely ignore this email.
              </p>
              <p style="margin:24px 0 0;text-align:center;">
                <a href="${opts.resetUrl}" style="display:inline-block;padding:14px 28px;background:#0D1B2A;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;border-radius:7px;">
                  Reset Password
                </a>
              </p>
              <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.5;text-align:center;">
                This link will expire in 1 hour and can only be used once.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:18px 32px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">IIIT Sri City Hostel Gatepass System. Do not reply to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        await this.transporter.sendMail({
            from: `"IIIT Sri City Gatepass" <${process.env.GMAIL_USER}>`,
            to: opts.to,
            subject: `Reset Your Password — IIIT Sri City Gatepass`,
            html,
        });
    }
}
