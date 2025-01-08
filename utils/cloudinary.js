import {v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();


//Cloudinary 설정구성 (configuration) 사용자가 직접 읽거나 편집할 수 있도록 텍스트 파일
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Cloudinary 스토리지(multer storage) 설정
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'SearchBook', // 저장될 폴더 이름
        allowedFormats: ['jpeg', 'png', 'jpg'] // 허용되는 파일 형식
    }
});

const upload = multer({ storage });

export { cloudinary, upload };