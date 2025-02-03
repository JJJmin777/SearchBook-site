import mongoose from 'mongoose';
const Schema = mongoose.Schema; //빠르게 Schema 사용
import passportLocalMongoose from 'passport-local-mongoose'
import crypto from 'crypto'

// 사용자 스키마 정의
const userSchema = new Schema({
    username: { 
        type: String, 
        required: true 
    },
    email:{
        type:String,
        require: true,
        unique: true
    },
    bio:{
        type: String,
        default: ''
    },
    profilePicture: { 
        type: String, default: '/images/default-profile.png' 
    }, // 기본 프로필 사진 경로
    profilePictureId: { 
        type: String 
    }, // Cloudinary public_id
    isAdmin: { 
        type: Boolean, default: false 
    }, // 관리자 여부 필드 추가
    isVerified: { 
        type: Boolean, default: false 
    }, // 이메일 인증 여부
    emailToken: String, // 이메일 인증 토큰
    emailTokenExpire: Date, // 토큰 만료 시간
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
});

// TTL Index 설정 (이메일 토큰 만료시 삭제)
userSchema.index({ emailTokenExpire: 1 }, { expireAfterSeconds: 0 });

// 플러그인 추가
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email', // 이메일을 username 필드로 사용
});

// 모델 생성
const User = mongoose.model('User', userSchema)
export default User