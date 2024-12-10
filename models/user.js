import mongoose from 'mongoose';
//빠르게 Schema 사용
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose'

// 사용자 스키마 정의
const UserSchema = new Schema({
    email:{
        type:String,
        require: true,
        unique: true
    }
});

// 플러그인 추가
UserSchema.plugin(passportLocalMongoose);

// 모델 생성
const User = mongoose.model('User', UserSchema)
export default User