# 📚 프로젝트 이름 (Book Review App)

🚀 한 줄 소개 (Book Review App은 사용자가 책 리뷰를 남기고 공유할 수 있는 웹 애플리케이션입니다.)

## 📌 Features (기능)
🔹 사용자 기능
- **📚 도서 검색**: 원하는 책을 검색하여 리뷰를 확인할 수 있습니다.

     ![책 검색](https://github.com/user-attachments/assets/d937cb76-e578-46f6-9f53-923e7b0b4020)


- **⭐ 리뷰 작성**: 책에 대한 리뷰를 남기고, 별점을 부여할 수 있습니다.(수정, 삭제)
- 
     ![리뷰 쓰기](https://github.com/user-attachments/assets/9e10f3b5-6453-49a2-8814-33a1b5803f91)

  
- **❤️ 리뷰 좋아요**: 다른 사용자의 리뷰에 좋아요를 누를 수 있습니다.
     ![하트 클릭](https://github.com/user-attachments/assets/d357580d-e846-46de-96bd-0654796518b1)

  
- 🔍 리뷰 검색 및 정렬 기능
- 💬 댓글 기능: 리뷰에 대한 댓글을 남길 수 있습니다.
- 🚨 리뷰 신고: 부적절한 리뷰를 신고할 수 있습니다.
- 🔐 로그인/회원가입 (Passport.js 사용, **Google reCAPTCHA 적용**: 로그인 및 회원가입 시 reCAPTCHA로 **스팸 방지**)
     ### 🔑 **회원가입시 인증 **
        ✅ 📩 이메일 인증**: 회원가입 시 Nodemailer를 사용해 **Gmail SMTP**로 인증 메일 전송
        ✅ 📬 인증 링크 포함**: 사용자가 이메일의 링크를 클릭하면 계정이 활성화됨

🔹프로필 관리 시스템
    사용자는 자신의 프로필을 관리하고, 프로필 사진을 업로드할 수 있습니다.
    **기능**
      ✅ **프로필 정보 관리**: 사용자 이름, 자기소개 수정
      ✅ **프로필 사진 업로드**: Multer 및 Cloudinary를 활용한 이미지 저장
      ✅ **비밀번호 변경**: 현재 비밀번호 확인 후 새 비밀번호 설정
      ✅ **사용자 리뷰 목록 확인**: 자신이 작성한 리뷰를 한눈에 조회 및 검색 가능

🔹 관리자 기능
- 📊 관리자 대시보드 (유저 & 리뷰 & 리포트 관리)
  1. 🛠 리뷰 관리: 모든 리뷰를 조회하고, 부적절한 리뷰를 삭제할 수 있습니다.
  2. 👤 사용자 관리: 사용자 목록을 확인하고, 유저 정보를 관리할 수 있습니다.
  3. 🚨 신고 리뷰 관리: 신고된 리뷰를 확인하고 조치를 취할 수 있습니다.

## 🛠️ Tech Stack (기술 스택)
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** EJS, Bootstrap, Custom CSS
- **Authentication:** Passport.js (Local Strategy)
- **Deployment:** Render

## 📥 Installation (설치 방법)
1. 프로젝트 클론
   ```sh
   git clone https://github.com/your-username/book-review-app.git
   cd book-review-app
