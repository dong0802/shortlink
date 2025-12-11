# 🚀 Deploy to Vercel - Hướng dẫn

## Bước 1: Chuẩn bị

1. **Tạo tài khoản Vercel** (nếu chưa có): https://vercel.com
2. **Cài đặt Vercel CLI** (tùy chọn):
   ```bash
   npm install -g vercel
   ```

## Bước 2: Deploy

### Cách 1: Deploy qua Vercel Dashboard (Đơn giản nhất)

1. **Push code lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import vào Vercel:**
   - Truy cập: https://vercel.com/new
   - Click "Import Git Repository"
   - Chọn repository của bạn
   - Click "Import"

3. **Cấu hình Environment Variables:**
   
   Trong Vercel Dashboard → Settings → Environment Variables, thêm:
   
   ```
   MONGODB_URI = mongodb+srv://dong2004_db_user:dong2004@cluster0.znykq07.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   
   JWT_SECRET = your_super_secret_jwt_key_change_this_in_production_12345
   
   TELEGRAM_BOT_TOKEN = 8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk
   
   TELEGRAM_CHAT_ID = your_chat_id_here
   
   BASE_URL = https://your-app-name.vercel.app
   
   NODE_ENV = production
   ```
   
   **LƯU Ý:** Thay `your-app-name` bằng tên app thực tế của bạn

4. **Deploy:**
   - Click "Deploy"
   - Đợi vài phút để Vercel build và deploy

### Cách 2: Deploy qua CLI

```bash
# Login vào Vercel
vercel login

# Deploy
vercel

# Làm theo hướng dẫn:
# - Set up and deploy? Yes
# - Which scope? Chọn account của bạn
# - Link to existing project? No
# - What's your project's name? shortlink-project
# - In which directory is your code located? ./
# - Want to override the settings? No

# Deploy to production
vercel --prod
```

## Bước 3: Cấu hình Environment Variables (nếu dùng CLI)

```bash
# Thêm từng biến môi trường
vercel env add MONGODB_URI
# Paste: mongodb+srv://dong2004_db_user:dong2004@cluster0.znykq07.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

vercel env add JWT_SECRET
# Paste: your_super_secret_jwt_key_change_this_in_production_12345

vercel env add TELEGRAM_BOT_TOKEN
# Paste: 8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk

vercel env add TELEGRAM_CHAT_ID
# Paste: your_chat_id_here

vercel env add BASE_URL
# Paste: https://your-app-name.vercel.app

vercel env add NODE_ENV
# Paste: production

# Deploy lại với env mới
vercel --prod
```

## Bước 4: Kiểm tra

1. Mở URL của app: `https://your-app-name.vercel.app`
2. Test các chức năng:
   - ✅ Rút gọn link
   - ✅ Đăng ký tài khoản
   - ✅ Đăng nhập
   - ✅ Xem lịch sử
   - ✅ Click vào link rút gọn
   - ✅ Nhận thông báo Telegram

## Bước 5: Cấu hình Telegram Chat ID

1. Mở Telegram, tìm bot: `@AptechShortLinkBot`
2. Gửi tin nhắn: `/start`
3. Truy cập: 
   ```
   https://api.telegram.org/bot8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk/getUpdates
   ```
4. Tìm `"chat":{"id":123456789}`
5. Copy số ID
6. Vào Vercel Dashboard → Settings → Environment Variables
7. Cập nhật `TELEGRAM_CHAT_ID` với ID vừa lấy
8. Redeploy: Click "Redeploy" trong Deployments tab

## Troubleshooting

### Lỗi 500: FUNCTION_INVOCATION_FAILED

**Nguyên nhân:** MongoDB connection timeout hoặc environment variables chưa đúng

**Giải pháp:**
1. Kiểm tra MongoDB Atlas Network Access:
   - Vào MongoDB Atlas → Network Access
   - Thêm IP: `0.0.0.0/0` (allow all)
   
2. Kiểm tra Environment Variables trong Vercel
3. Xem logs: Vercel Dashboard → Deployments → Click vào deployment → View Function Logs

### Lỗi kết nối MongoDB

1. Kiểm tra `MONGODB_URI` đã đúng chưa
2. Kiểm tra username/password
3. Kiểm tra Network Access trong MongoDB Atlas

### Email không gửi được

- Email sẽ tự động bỏ qua nếu không cấu hình `EMAIL_USER` và `EMAIL_PASS`
- User sẽ được tự động verify khi đăng ký

## Files quan trọng cho Vercel

- ✅ `vercel.json` - Cấu hình Vercel
- ✅ `api/index.js` - Serverless function chính
- ✅ `package.json` - Dependencies
- ✅ `public/*` - Static files

## Lưu ý

1. **Serverless Functions:** Vercel sử dụng serverless, khác với server truyền thống
2. **Cold Start:** Lần đầu tiên truy cập có thể chậm (5-10 giây)
3. **MongoDB Connection:** Sử dụng connection caching để tối ưu
4. **Logs:** Xem logs trong Vercel Dashboard để debug

## Custom Domain (Tùy chọn)

1. Vào Vercel Dashboard → Settings → Domains
2. Thêm domain của bạn
3. Cập nhật DNS records theo hướng dẫn
4. Cập nhật `BASE_URL` environment variable

## 🎉 Hoàn thành!

Website của bạn đã được deploy lên Vercel và có thể truy cập từ bất kỳ đâu!

URL: `https://your-app-name.vercel.app`
