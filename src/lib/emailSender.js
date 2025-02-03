export async function sendEmail({ to, subject, text }) {
    if (!platform?.env?.MAILHOP_CREDS) {
        console.error('MAILHOP_CREDS not available');
        return false;
    }

    try {
        const response = await fetch('https://api.outbound.mailhop.org/v1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${platform.env.MAILHOP_CREDS}`
            },
            body: JSON.stringify({
                messages: [{
                    to: [{ email: to }],
                    subject: subject,
                    text: text
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to send email:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
