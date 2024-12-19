import fetch from 'node-fetch'

const verifyRecaptcha = async (token) => {
    const secretKey = process.env.SECRET_KEY; // Google reCAPTCHA 비밀키
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
        const response = await fetch(verificationUrl, { method: 'POST' });
        const data = await response.json();
        // console.log(data.success)
        return data.success; // 검증 성공 여부 반환
    } catch (err) {
        console.error('reCAPTCHA verification error:', err);
        return false;  // 실패 처리
    }
};

export default verifyRecaptcha;
