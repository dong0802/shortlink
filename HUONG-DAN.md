# 🎉 WEBSITE RÚT GỌN LINK ĐÃ HOÀN THÀNH!

## ✅ Server đang chạy tại: http://localhost:3000

## 📋 Hướng dẫn sử dụng

### 1. Truy cập website
Mở trình duyệt và truy cập: **http://localhost:3000**

### 2. Các chức năng chính

#### 🔗 Rút gọn link (Không cần đăng nhập)
1. Nhập URL dài vào ô input
2. Click "Shorten URL"
3. Copy link rút gọn và sử dụng

#### 👤 Đăng ký tài khoản
1. Click nút "Sign In" ở góc phải
2. Click "Sign up" để chuyển sang form đăng ký
3. Nhập email và password
4. Click "Sign Up"
5. **QUAN TRỌNG**: Kiểm tra email để xác thực tài khoản
   - Nếu chưa cấu hình email, bạn có thể bỏ qua bước này
   - Để test, có thể tạm thời set `isVerified: true` trong database

#### 🔐 Đăng nhập
1. Click "Sign In"
2. Nhập email và password
3. Click "Sign In"

#### 📊 Xem lịch sử (Cần đăng nhập)
1. Đăng nhập vào tài khoản
2. Click "History" trên menu
3. Xem danh sách tất cả link đã rút gọn
4. Click "View Stats" để xem chi tiết:
   - Số lượt click
   - IP address của người click
   - User Agent (trình duyệt, thiết bị)
   - Thời gian click

### 3. Cấu hình bổ sung

#### 📧 Cấu hình Email (Gmail)
Để gửi email xác thực, cần cấu hình trong file `.env`:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Cách lấy App Password:**
1. Đăng nhập Gmail
2. Vào Google Account → Security
3. Bật 2-Step Verification
4. Tạo App Password
5. Copy password vào `.env`

#### 📱 Cấu hình Telegram
Để nhận thông báo khi có người click vào link:

1. **Lấy Chat ID:**
   - Mở Telegram, tìm bot: `@AptechShortLinkBot`
   - Gửi tin nhắn `/start`
   - Truy cập: `https://api.telegram.org/bot8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk/getUpdates`
   - Tìm `"chat":{"id":123456789}`
   - Copy số ID

2. **Cập nhật `.env`:**
```env
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 4. Chạy server

#### Lần đầu tiên:
```bash
npm install
```

#### Chạy server:
```bash
# Sử dụng server đơn giản (đang chạy)
node server-simple.js

# Hoặc sử dụng server chính (cần cấu hình .env đúng)
npm start
```

## 🗄️ Database Structure

### Collection: users
- email
- password (hashed)
- isVerified
- verificationToken
- createdAt

### Collection: shortlinks
- originalUrl
- shortCode
- userId (reference to User)
- clicks[] (array of click records)
  - ip
  - userAgent
  - timestamp
- clickCount
- createdAt

## 🔧 Troubleshooting

### Lỗi kết nối MongoDB
1. Kiểm tra Network Access trong MongoDB Atlas
2. Thêm IP: `0.0.0.0/0` (cho phép tất cả IP - chỉ dùng để test)
3. Kiểm tra username: `dong2004_db_user`
4. Kiểm tra password: `dong2004`

### Email không gửi được
- Kiểm tra cấu hình Gmail App Password
- Tạm thời có thể bỏ qua email verification bằng cách set `isVerified: true` trong database

### Telegram không nhận thông báo
- Kiểm tra đã lấy đúng Chat ID chưa
- Kiểm tra bot token trong `.env`

## 📝 Ghi chú

- Server đang chạy với file `server-simple.js` (không dùng .env)
- Để dùng file `server.js` chính thức, cần tạo file `.env` với đúng format
- MongoDB đã kết nối thành công
- Tất cả chức năng đã được implement đầy đủ

## 🎨 Tính năng nổi bật

✅ Giao diện đẹp mắt với dark theme
✅ Rút gọn link không cần đăng nhập
✅ Đăng ký/Đăng nhập với email verification
✅ Lịch sử link cho user đã đăng nhập
✅ Thống kê chi tiết: clicks, IP, User Agent
✅ Thông báo Telegram real-time
✅ Responsive design
✅ Smooth animations

## 🚀 Enjoy your URL Shortener!
