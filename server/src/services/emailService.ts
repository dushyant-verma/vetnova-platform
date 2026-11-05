import nodemailer from 'nodemailer';
import { IEnquiry, LeadPersona } from '../models/Enquiry';

const PERSONA_TITLES: Record<LeadPersona, string> = {
  student: 'Veterinary Students and Fresh Graduates',
  practitioner: 'Practising Veterinary Doctors',
  nurse: 'Veterinary Nurses and Aspirants',
  partner: 'Sponsors and Corporate Partners',
  general: 'General Website Enquiry'
};

const PERSONA_CONFIRMATIONS: Record<LeadPersona, { title: string; body: string }> = {
  student: {
    title: 'Thank You for Connecting with VetNova!',
    body: "Your veterinary journey deserves more than knowledge alone—it deserves the confidence to apply it. We're here to help you bridge the gap between learning and clinical practice.\n\nLet's build your skills for a confident future in veterinary care. We'll be in touch soon!"
  },
  practitioner: {
    title: 'Thank You for Connecting with VetNova!',
    body: "Every clinician has the potential to grow, advance and make a greater difference. We look forward to exploring practical learning opportunities that strengthen your skills and elevate your clinical practice.\n\nLet's take veterinary excellence forward—together. We'll be in touch soon!"
  },
  nurse: {
    title: 'Thank You for Exploring Your Journey with VetNova!',
    body: "Every skilled veterinary nurse makes a difference in an animal's life. We're excited to help you explore practical skills that turn your passion for animal care into meaningful capability.\n\nYour journey towards better animal care starts here. We'll be in touch soon!"
  },
  partner: {
    title: 'Thank You for Your Interest in Partnering with VetNova!',
    body: "Together, we can bridge the gap between veterinary education and clinical practice, empower veterinary professionals, and contribute to better animal healthcare.\n\nWe look forward to exploring a meaningful collaboration where shared goals create lasting impact. We'll be in touch soon!"
  },
  general: {
    title: 'Thank You for Contacting VetNova!',
    body: 'We have received your enquiry and our team will get back to you shortly.'
  }
};

export const isEmailConfigured = (): boolean => {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
};

const createTransporter = () => {
  if (!isEmailConfigured()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendLeadNotifications = async (lead: IEnquiry): Promise<{ adminSent: boolean; applicantSent: boolean }> => {
  const result = { adminSent: false, applicantSent: false };

  if (!isEmailConfigured()) {
    console.log(`[EmailService] SMTP credentials not configured in environment. Lead recorded: ${lead.leadId} (${lead.name})`);
    return result;
  }

  const transporter = createTransporter();
  if (!transporter) return result;

  const fromAddress = process.env.SMTP_FROM || 'VetNova Academy <admissions@vetnova.in>';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  const personaName = PERSONA_TITLES[lead.persona] || lead.persona;

  // 1. Send Admin Notification Email
  try {
    const formattedAnswers = lead.formData && Object.keys(lead.formData).length > 0
      ? Object.entries(lead.formData).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')
      : '<li>No persona-specific fields</li>';

    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `[New Lead - ${personaName}] ${lead.name} (${lead.leadId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #0b1c3e; color: #ffffff; padding: 20px;">
            <h2 style="margin: 0; font-size: 20px;">New VetNova Academy Lead</h2>
            <p style="margin: 5px 0 0; font-size: 14px; color: #94a3b8;">Lead ID: ${lead.leadId} | ${personaName}</p>
          </div>
          <div style="padding: 20px; line-height: 1.6; color: #334155;">
            <p><strong>Applicant Name:</strong> ${lead.name}</p>
            ${lead.designation ? `<p><strong>Designation:</strong> ${lead.designation}</p>` : ''}
            ${lead.organization ? `<p><strong>Organization:</strong> ${lead.organization}</p>` : ''}
            <p><strong>Phone / WhatsApp:</strong> ${lead.countryCode ? lead.countryCode + ' ' : ''}${lead.phone}</p>
            ${lead.email ? `<p><strong>Email:</strong> ${lead.email}</p>` : ''}
            <p><strong>Submission Source:</strong> ${lead.source} (${lead.sourcePage || 'N/A'})</p>
            <p><strong>Submitted At:</strong> ${new Date(lead.createdAt).toLocaleString()}</p>
            
            <h4 style="margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Form Responses:</h4>
            <ul style="padding-left: 20px;">${formattedAnswers}</ul>
            
            ${lead.message ? `<p><strong>Message / Note:</strong><br/>${lead.message}</p>` : ''}
          </div>
        </div>
      `
    });
    result.adminSent = true;
    console.log(`[EmailService] Admin notification sent for lead ${lead.leadId}`);
  } catch (err: any) {
    console.error(`[EmailService] Failed to send admin notification for lead ${lead.leadId}:`, err.message);
  }

  // 2. Send Applicant Acknowledgment Email (if applicant provided email)
  if (lead.email) {
    try {
      const conf = PERSONA_CONFIRMATIONS[lead.persona] || PERSONA_CONFIRMATIONS.general;
      await transporter.sendMail({
        from: fromAddress,
        to: lead.email,
        subject: `VetNova Academy: ${conf.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background: #0b1c3e; color: #ffffff; padding: 24px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">VetNova Academy</h2>
              <p style="margin: 6px 0 0; color: #14b8a6; font-size: 14px;">Practical Veterinary Education</p>
            </div>
            <div style="padding: 24px; line-height: 1.7; color: #334155;">
              <h3 style="color: #0b1c3e; margin-top: 0;">${conf.title}</h3>
              <p>Dear ${lead.name},</p>
              <p style="white-space: pre-line;">${conf.body}</p>
              <div style="margin: 24px 0; padding: 16px; background: #f8fafc; border-left: 4px solid #14b8a6; border-radius: 4px;">
                <p style="margin: 0; font-size: 13px; color: #64748b;">
                  <strong>Reference ID:</strong> ${lead.leadId}<br/>
                  <strong>WhatsApp Contact:</strong> +91 9272561089
                </p>
              </div>
              <p style="font-size: 13px; color: #94a3b8; margin-top: 30px;">
                VetNova Learning Centre &bull; Gawadewadi – Wagholi, Pune, Maharashtra 412207
              </p>
            </div>
          </div>
        `
      });
      result.applicantSent = true;
      console.log(`[EmailService] Applicant acknowledgment sent to ${lead.email}`);
    } catch (err: any) {
      console.error(`[EmailService] Failed to send applicant confirmation for lead ${lead.leadId}:`, err.message);
    }
  }

  return result;
};
