export async function sendEmail({ to, subject, text, platform }) {
    console.log('Email function entry point');
    const creds = platform?.env?.MAILHOP_CREDS || import.meta.env.VITE_MAILHOP_CREDS;
    console.log('Credentials check:', {
        platformExists: !!platform,
        envExists: !!platform?.env,
        hasMailhopCreds: !!platform?.env?.MAILHOP_CREDS,
        hasViteCreds: !!import.meta.env?.VITE_MAILHOP_CREDS
    });
    
    if (!creds) {
        console.error('MAILHOP_CREDS not available');
        return false;
    }

    try {
        console.log('Attempting to send email with creds:', !!creds);
        const payload = {
            messages: [{
                from: { email: "noreply@selfie.pr" },
                to: [{ email: to }],
                subject: subject,
                text: text
            }]
        };
        console.log('Email payload:', payload);
        
        const response = await fetch('https://api.outbound.mailhop.org/v1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${creds}`
            },
            body: JSON.stringify({
                messages: [{
                    from: { email: "noreply@selfie.pr" },
                    to: [{ email: to }],
                    subject: subject,
                    text: text
                }]
            })
        });

        const responseData = await response.json();
        console.log('Email API response:', {
            status: response.status,
            ok: response.ok,
            data: responseData
        });

        if (!response.ok) {
            console.error('Failed to send email:', responseData);
            return false;
        }

        return responseData;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
