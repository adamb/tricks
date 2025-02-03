import { sendEmail } from '$lib/emailSender';

export async function POST({ request, platform }) {
    try {
        const { subject, text } = await request.json();
        
        if (!subject || !text) {
            return new Response(JSON.stringify({ error: 'Missing subject or text' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await sendEmail({
            to: 'admin@selfie.pr',
            subject: `[Tricks Status] ${subject}`,
            text: text,
            platform
        });

        return new Response(JSON.stringify({ success: result }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
