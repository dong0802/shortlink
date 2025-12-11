# ShortLink - URL Shortener

Website rút gọn link với MongoDB, tương tự shorturl.at

## Tính năng

✅ **Đăng ký/Đăng nhập với Email Verification**
- Đăng ký tài khoản với email
- Xác thực email qua link gửi đến email
- Đăng nhập/Đăng xuất với JWT

✅ **Rút gọn link không cần đăng nhập**
- User có thể rút gọn link ngay lập tức
- Không bắt buộc phải đăng ký

✅ **Lịch sử link đã rút gọn**
- User đã đăng nhập có thể xem lịch sử
- Hiển thị tất cả link đã tạo

✅ **Thống kê chi tiết**
- Đếm số lượt click
- Lưu IP address của người click
- Lưu User Agent (trình duyệt, thiết bị)
- Thời gian click

✅ **Thông báo Telegram**
- Tự động gửi tin nhắn đến bot Telegram
- Thông báo mỗi khi có người click vào link

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Chỉnh sửa file `.env`:

```env
# MongoDB - Thay đổi connection string của bạn
MONGODB_URI=mongodb+srv://dong2004_db_user:dong2004@cluster0.mongodb.net/shortlink?retryWrites=true&w=majority

# JWT Secret - Đổi thành secret key của bạn
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration - Cấu hình Gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Telegram Bot
TELEGRAM_BOT_TOKEN=8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk
TELEGRAM_CHAT_ID=your_chat_id_here

# Server
PORT=3000
BASE_URL=http://localhost:3000
```

### 3. Cấu hình Email (Gmail)

1. Đăng nhập Gmail
2. Vào **Google Account Settings** → **Security**
3. Bật **2-Step Verification**
4. Tạo **App Password** cho ứng dụng
5. Copy App Password vào `EMAIL_PASS` trong file `.env`

### 4. Lấy Telegram Chat ID

1. Mở Telegram và tìm bot: `@AptechShortLinkBot`
2. Gửi tin nhắn `/start`
3. Truy cập: `https://api.telegram.org/bot8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk/getUpdates`
4. Tìm `"chat":{"id":123456789}` trong response
5. Copy số ID vào `TELEGRAM_CHAT_ID` trong file `.env`

## Chạy ứng dụng

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Mở trình duyệt: `http://localhost:3000`

## Cấu trúc Database (MongoDB)

### Collection: users
```javascript
{
  email: String,
  password: String (hashed),
  isVerified: Boolean,
  verificationToken: String,
  createdAt: Date
}
```

### Collection: shortlinks
```javascript
{
  originalUrl: String,
  shortCode: String,
  userId: ObjectId (ref: User),
  clicks: [
    {
      ip: String,
      userAgent: String,
      timestamp: Date
    }
  ],
  clickCount: Number,
  createdAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `GET /api/auth/verify-email?token=xxx` - Xác thực email

### Links
- `POST /api/links/shorten` - Tạo link rút gọn
- `GET /api/links/history` - Lịch sử link (cần đăng nhập)
- `GET /api/links/stats/:shortCode` - Thống kê chi tiết (cần đăng nhập)
- `GET /:shortCode` - Redirect đến link gốc

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **Telegram**: Telegram Bot API
- **Frontend**: HTML, CSS, Vanilla JavaScript

## Tính năng nổi bật

### 🎨 Giao diện đẹp mắt
- Dark theme hiện đại
- Gradient colors
- Smooth animations
- Responsive design

### 🔒 Bảo mật
- Password hashing với bcryptjs
- JWT authentication
- Email verification
- HTTP-only cookies

### 📊 Analytics
- Real-time click tracking
- IP address logging
- User agent detection
- Telegram notifications

## Screenshots

### Trang chủ
- Form rút gọn link
- Hiển thị kết quả
- Copy to clipboard

### Đăng ký/Đăng nhập
- Modal form đẹp mắt
- Email verification
- Error handling

### Lịch sử
- Danh sách link đã tạo
- Thống kê clicks
- Chi tiết từng click

## Lưu ý

1. **MongoDB Connection**: Đảm bảo IP của bạn đã được thêm vào MongoDB Atlas Network Access
2. **Email**: Cần cấu hình App Password cho Gmail
3. **Telegram**: Cần lấy Chat ID từ bot
4. **Production**: Đổi `JWT_SECRET` và `BASE_URL` khi deploy

## License

MIT
