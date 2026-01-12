// Email service using Resend API
// To use this service, you need to:
// 1. Sign up for Resend at https://resend.com
// 2. Get your API key
// 3. Add RESEND_API_KEY to your .env.local file

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Helper to get the app URL dynamically
const getAppUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  // Server-side: use env var or default
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4028';
};

export const emailService = {
  async sendEmail(data: EmailData) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured. Email not sent.');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Kitchen Services <onboarding@resend.dev>', // Update with your verified domain
          to: data.to,
          subject: data.subject,
          html: data.html,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Failed to send email:', error);
      return { success: false, message: error.message };
    }
  },

  // Email Templates
  templates: {
    bookingConfirmation: (customerName: string, bookingDetails: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed! ✓</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>Great news! Your service booking has been confirmed.</p>
              
              <div class="details">
                <h3>Booking Details</h3>
                <p><strong>Service:</strong> ${bookingDetails.service}</p>
                <p><strong>Technician:</strong> ${bookingDetails.technician}</p>
                <p><strong>Date:</strong> ${bookingDetails.date}</p>
                <p><strong>Time:</strong> ${bookingDetails.time}</p>
                <p><strong>Address:</strong> ${bookingDetails.address}</p>
                <p><strong>Total:</strong> £${bookingDetails.total}</p>
              </div>

              <p>Your technician will arrive at the scheduled time. If you have any questions, please don't hesitate to contact us.</p>
              
              <a href="${getAppUrl()}/dashboard/customer" class="button">View Booking</a>
              
              <div class="footer">
                <p>Kitchen Services - Professional Kitchen Appliance Repairs</p>
                <p>If you have any questions, reply to this email or contact our support team.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,

    bookingStatusUpdate: (customerName: string, status: string, bookingDetails: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .status { display: inline-block; padding: 8px 16px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Status Updated</h1>
            </div>
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>Your booking status has been updated to: <span class="status">${status.toUpperCase()}</span></p>
              
              <p><strong>Service:</strong> ${bookingDetails.service}</p>
              <p><strong>Scheduled:</strong> ${bookingDetails.date} at ${bookingDetails.time}</p>
              
              <div class="footer">
                <p>Kitchen Services - Professional Kitchen Appliance Repairs</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,

    welcomeEmail: (userName: string, role: string) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Kitchen Services! 👋</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Welcome to Kitchen Services! We're excited to have you join our platform as a ${role}.</p>
              
              ${role === 'customer' ? `
                <p>You can now:</p>
                <ul>
                  <li>Book professional technicians for your kitchen appliances</li>
                  <li>Track your service requests</li>
                  <li>Leave reviews for technicians</li>
                </ul>
              ` : `
                <p>As a technician, you can:</p>
                <ul>
                  <li>Receive booking requests from customers</li>
                  <li>Manage your schedule and availability</li>
                  <li>Build your reputation through customer reviews</li>
                </ul>
              `}
              
              <a href="${getAppUrl()}/dashboard/${role}" class="button">Go to Dashboard</a>
              
              <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
};
