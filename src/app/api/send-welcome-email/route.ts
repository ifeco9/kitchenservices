import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
    try {
        const { email, name, role } = await request.json();

        if (!email || !name || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Send welcome email
        const result = await emailService.sendEmail({
            to: email,
            subject: 'Welcome to Kitchen Services!',
            html: emailService.templates.welcomeEmail(name, role)
        });

        if (!result.success) {
            console.error('Failed to send welcome email:', result.message);
            return NextResponse.json(
                { error: 'Failed to send email', details: result.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error: any) {
        console.error('Error in send-welcome-email API:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
