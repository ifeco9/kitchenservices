import { emailService } from './emailService';

export const notificationService = {
    async sendBookingConfirmation(email: string, booking: any) {
        try {
            const bookingDetails = {
                service: booking.service_id || 'Kitchen Appliance Service',
                technician: booking.technician_name || 'Assigned Technician',
                date: new Date(booking.scheduled_date).toLocaleDateString(),
                time: new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                address: booking.address || 'Address not provided',
                total: booking.total_amount?.toFixed(2) || '0.00'
            };

            const result = await emailService.sendEmail({
                to: email,
                subject: 'Booking Confirmation - Kitchen Services',
                html: emailService.templates.bookingConfirmation('Customer', bookingDetails)
            });

            if (!result.success) {
                console.warn('Email notification failed:', result.message);
            }

            return result;
        } catch (error) {
            console.error('Failed to send booking confirmation:', error);
            return { success: false, message: 'Failed to send notification' };
        }
    },

    async sendStatusUpdate(email: string, status: string, booking: any) {
        try {
            const bookingDetails = {
                service: booking.service_name || 'Kitchen Appliance Service',
                date: new Date(booking.scheduled_date).toLocaleDateString(),
                time: new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            const result = await emailService.sendEmail({
                to: email,
                subject: `Booking Status Update: ${status}`,
                html: emailService.templates.bookingStatusUpdate('Customer', status, bookingDetails)
            });

            return result;
        } catch (error) {
            console.error('Failed to send status update:', error);
            return { success: false, message: 'Failed to send notification' };
        }
    },

    async sendWelcomeEmail(email: string, userName: string, role: string) {
        try {
            const result = await emailService.sendEmail({
                to: email,
                subject: 'Welcome to Kitchen Services!',
                html: emailService.templates.welcomeEmail(userName, role)
            });

            return result;
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            return { success: false, message: 'Failed to send notification' };
        }
    },

    async sendTechnicianAlert(technicianId: string, bookingDetails: any) {
        console.log(`[MOCK SMS] Alerting technician ${technicianId} about new job`, bookingDetails);
        return true;
    }
};
