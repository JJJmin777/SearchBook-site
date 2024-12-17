import mongoose from 'mongoose';
const Schema = mongoose.Schema; //빠르게 Schema 사용
import passportLocalMongoose from 'passport-local-mongoose'
import reviewSchema from './review.js';
import bookSchema from './search.js'

// 사용자 스키마 정의
const userSchema = new Schema({
    email:{
        type:String,
        require: true,
        unique: true
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
],
    
});

// 플러그인 추가
userSchema.plugin(passportLocalMongoose);

// 모델 생성
const User = mongoose.model('User', userSchema)
export default User