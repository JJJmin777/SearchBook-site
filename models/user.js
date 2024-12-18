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
    isVerified: { type: Boolean, default: false }, // 이메일 인증 여부
    emailToken: String, // 이메일 인증 토큰
    emailTokenExpire: Date, // 토큰 만료 시간
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
});

// 플러그인 추가
userSchema.plugin(passportLocalMongoose);

// 모델 생성
const User = mongoose.model('User', userSchema)
export default User