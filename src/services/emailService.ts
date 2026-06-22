// Email service using Resend API
// To use this service, you need to:
// 1. Sign up for Resend at https://resend.com
// 2. Get your API key
// 3. Add RESEND_API_KEY to your .env.local file
// 4. The from address must use a verified domain in your Resend account

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

const getAppUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4028';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function baseTemplate(title: string, bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${bodyHtml}
          </div>
        </div>
      </body>
    </html>
  `;
}

export const emailService = {
  async sendEmail(data: EmailData) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured. Email not sent.');
      return { success: false, message: 'Email service not configured' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Kitchen Services <onboarding@resend.dev>',
          to: data.to,
          subject: data.subject,
          html: data.html,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Email API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      console.error('Failed to send email:', error);
      const message = error instanceof Error ? error.message : 'Unknown error sending email';
      return { success: false, message };
    }
  },

  templates: {
    bookingConfirmation: (customerName: string, bookingDetails: any) => {
      const safeName = escapeHtml(customerName);
      const detailRows = `
        <div class="details">
          <h3>Booking Details</h3>
          <p><strong>Service:</strong> ${bookingDetails.service}</p>
          <p><strong>Technician:</strong> ${bookingDetails.technician}</p>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Time:</strong> ${bookingDetails.time}</p>
          <p><strong>Address:</strong> ${bookingDetails.address}</p>
          <p><strong>Total:</strong> ₦${typeof bookingDetails.total === 'number' ? bookingDetails.total.toLocaleString('en-NG') : escapeHtml(bookingDetails.total)}</p>
        </div>
      `;

      return baseTemplate('Booking Confirmed! &#10003;', `
        <p>Hi ${safeName},</p>
        <p>Great news! Your service booking has been confirmed.</p>
        ${detailRows}
        <p>Your technician will arrive at the scheduled time. If you have any questions, please don't hesitate to contact us.</p>
        <a href="${getAppUrl()}/dashboard/customer" class="button">View Booking</a>
        <div class="footer">
          <p>Kitchen Services - Professional Kitchen Appliance Repairs</p>
          <p>If you have any questions, reply to this email or contact our support team.</p>
        </div>
      `);
    },

    bookingStatusUpdate: (customerName: string, status: string, bookingDetails: any) => {
      const safeName = escapeHtml(customerName);
      const safeStatus = escapeHtml(status);

      return baseTemplate('Booking Status Updated', `
        <p>Hi ${safeName},</p>
        <p>Your booking status has been updated to: <span class="status">${safeStatus.toUpperCase()}</span></p>
        <p><strong>Service:</strong> ${bookingDetails.service}</p>
        <p><strong>Scheduled:</strong> ${bookingDetails.date} at ${bookingDetails.time}</p>
        <div class="footer">
          <p>Kitchen Services - Professional Kitchen Appliance Repairs</p>
        </div>
      `);
    },

    welcomeEmail: (userName: string, role: string) => {
      const safeName = escapeHtml(userName);
      const safeRole = escapeHtml(role);

      const customerContent = `
        <p>You can now:</p>
        <ul>
          <li>Book professional technicians for your kitchen appliances</li>
          <li>Track your service requests</li>
          <li>Leave reviews for technicians</li>
        </ul>
      `;

      const technicianContent = `
        <p>As a technician, you can:</p>
        <ul>
          <li>Receive booking requests from customers</li>
          <li>Manage your schedule and availability</li>
          <li>Build your reputation through customer reviews</li>
        </ul>
      `;

      return baseTemplate('Welcome to Kitchen Services!', `
        <p>Hi ${safeName},</p>
        <p>Welcome to Kitchen Services! We're excited to have you join our platform as a ${safeRole}.</p>
        ${safeRole === 'customer' ? customerContent : technicianContent}
        <a href="${getAppUrl()}/dashboard/${safeRole}" class="button">Go to Dashboard</a>
        <p>If you have any questions, feel free to reach out to our support team.</p>
      `);
    }
  }
};
