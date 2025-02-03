import User from "../models/user.js"; // User 모델 import

// 서버 시작 시 관리자 계정 자동 생성
export const createAdminUser = async (req, res) => {
    try{
        const existingAdmin = await User.findOne({ username: "admin" });
    if (!existingAdmin) {
        const admin = new User({
            username: "admin",
            email: "admin@admin.com",
            isAdmin: true,
            isVerified: true,
        });
        await admin.setPassword("adminpassword333"); // 비밀번호 설정
        await admin.save();
        console.log("✅ Admin user created: admin@admin.com");
    } else {
        console.log("⚠️ Admin user already exists.");
    }
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
    }
}

export default createAdminUser
