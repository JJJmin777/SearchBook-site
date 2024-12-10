import {v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


//Cloudinary 설정구성 (configuration) 사용자가 직접 읽거나 편집할 수 있도록 텍스트 파일
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Cloudinary 스토리지 설정
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'SearchBook',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

export { cloudinary, storage };