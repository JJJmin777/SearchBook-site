import mongoose from 'mongoose';
const Schema = mongoose.Schema; //빠르게 Schema 사용
import passportLocalMongoose from 'passport-local-mongoose'
import { reviewSchema } from './review';
import { bookSchema } from './search'

// 사용자 스키마 정의
const UserSchema = new Schema({
    email:{
        type:String,
        require: true,
        unique: true
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }], // 리뷰 스키마 배열에 포함,
    
});

// 플러그인 추가
UserSchema.plugin(passportLocalMongoose);

// 모델 생성
const User = mongoose.model('User', UserSchema)
export default User