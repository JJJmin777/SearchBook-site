import fetch from 'node-fetch'

const verifyRecaptcha = async (token) => {
    const secretKey = ''; // Google reCAPTCHA 비밀키
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
        const response = await fetch(verificationUrl, { method: 'POST' });
        const data = await response.json();
        return data.success;
    } catch (err) {
        console.error('reCAPTCHA verification error:', err);
        return false;
    }
};

export default verifyRecaptcha;
