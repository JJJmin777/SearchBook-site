import nodemailer from 'nodemailer';

// 이메일 전송 함수
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Gmail 사용
        auth: {
            user: 'jmin.office777@gmail.com', // 이메일 주소
            pass: '', // 이메일 비밀번호 또는 앱 비밀번호
        },
    });

    const mailOptions = {
        from: 'jmin_office777@gmail.com',
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;
