
export const notificationService = {
    async sendBookingConfirmation(email: string, bookingDetails: any) {
        // In a real application, this would call an API route (e.g. /api/send-email)
        // which effectively uses Resend or SendGrid.
        console.log(`[MOCK EMAIL] Sending booking confirmation to ${email}`, bookingDetails);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    },

    async sendTechnicianAlert(technicianId: string, bookingDetails: any) {
        console.log(`[MOCK SMS] Alerting technician ${technicianId} about new job`, bookingDetails);
        return true;
    }
};
