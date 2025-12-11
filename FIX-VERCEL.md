# ✅ ĐÃ SỬA LỖI VERCEL!

## 🔧 Vấn đề đã được giải quyết:

Đã xóa phần `env` trong `vercel.json` vì nó tham chiếu đến secrets không tồn tại.

## 🚀 CÁCH DEPLOY ĐÚNG:

### Bước 1: Push code lên GitHub (nếu chưa làm)

```bash
git add .
git commit -m "Fix Vercel deployment"
git push
```

### Bước 2: Thêm Environment Variables trong Vercel Dashboard

**QUAN TRỌNG:** Phải thêm các biến môi trường trong Vercel Dashboard, KHÔNG phải trong code!

1. Vào Vercel Dashboard: https://vercel.com
2. Chọn project của bạn
3. Vào **Settings** → **Environment Variables**
4. Thêm từng biến sau:

#### Các biến BẮT BUỘC:

**1. MONGODB_URI**
```
mongodb+srv://dong2004_db_user:dong2004@cluster0.znykq07.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**2. JWT_SECRET**
```
your_super_secret_jwt_key_change_this_in_production_12345
```

**3. TELEGRAM_BOT_TOKEN**
```
8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk
```

**4. TELEGRAM_CHAT_ID**
```
(Lấy từ bot - xem hướng dẫn bên dưới)
```

**5. BASE_URL**
```
https://your-app-name.vercel.app
```
*Thay `your-app-name` bằng tên app thực tế*

**6. NODE_ENV**
```
production
```

### Bước 3: Lấy Telegram Chat ID

1. Mở Telegram
2. Tìm bot: `@AptechShortLinkBot`
3. Gửi tin nhắn: `/start`
4. Mở trình duyệt, truy cập:
   ```
   https://api.telegram.org/bot8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk/getUpdates
   ```
5. Tìm dòng có `"chat":{"id":123456789,...}`
6. Copy số ID (ví dụ: `123456789`)
7. Thêm vào `TELEGRAM_CHAT_ID` trong Vercel

### Bước 4: MongoDB Atlas - Whitelist IP

**QUAN TRỌNG:** Phải làm bước này!

1. Vào MongoDB Atlas: https://cloud.mongodb.com
2. Chọn project của bạn
3. Vào **Network Access** (menu bên trái)
4. Click **"Add IP Address"**
5. Chọn **"Allow Access from Anywhere"**
6. Nhập: `0.0.0.0/0`
7. Click **"Confirm"**

### Bước 5: Redeploy

Sau khi thêm tất cả Environment Variables:

1. Vào Vercel Dashboard
2. Chọn project
3. Vào tab **Deployments**
4. Click vào deployment mới nhất
5. Click nút **"Redeploy"** (3 chấm → Redeploy)
6. Chọn **"Use existing Build Cache"**
7. Click **"Redeploy"**

### Bước 6: Kiểm tra

Sau khi deploy xong (khoảng 1-2 phút):

1. Mở URL: `https://your-app-name.vercel.app`
2. Test các chức năng:
   - ✅ Rút gọn link
   - ✅ Đăng ký tài khoản
   - ✅ Đăng nhập
   - ✅ Xem lịch sử
   - ✅ Click vào link rút gọn
   - ✅ Nhận thông báo Telegram

## 📋 Checklist

- [ ] Đã push code lên GitHub
- [ ] Đã thêm `MONGODB_URI` trong Vercel
- [ ] Đã thêm `JWT_SECRET` trong Vercel
- [ ] Đã thêm `TELEGRAM_BOT_TOKEN` trong Vercel
- [ ] Đã lấy và thêm `TELEGRAM_CHAT_ID` trong Vercel
- [ ] Đã thêm `BASE_URL` trong Vercel
- [ ] Đã thêm `NODE_ENV=production` trong Vercel
- [ ] Đã whitelist IP `0.0.0.0/0` trong MongoDB Atlas
- [ ] Đã Redeploy trong Vercel
- [ ] Website đã hoạt động

## 🐛 Nếu vẫn lỗi:

### Lỗi 500 - Internal Server Error

1. **Kiểm tra Logs:**
   - Vào Vercel Dashboard → Deployments
   - Click vào deployment
   - Click **"View Function Logs"**
   - Xem lỗi gì

2. **Kiểm tra Environment Variables:**
   - Vào Settings → Environment Variables
   - Đảm bảo tất cả 6 biến đã được thêm
   - Không có khoảng trắng thừa

3. **Kiểm tra MongoDB:**
   - Network Access phải có `0.0.0.0/0`
   - Username: `dong2004_db_user`
   - Password: `dong2004`

### Lỗi MongoDB Connection

- Kiểm tra `MONGODB_URI` đã đúng chưa
- Kiểm tra MongoDB Atlas Network Access
- Thử test connection local: `node test-db.js`

### Telegram không nhận thông báo

- Kiểm tra đã gửi `/start` cho bot chưa
- Kiểm tra `TELEGRAM_CHAT_ID` đã đúng chưa
- Logs có báo lỗi gì không

## 📸 Screenshot hướng dẫn

### Thêm Environment Variable trong Vercel:

1. Settings → Environment Variables
2. Click "Add New"
3. Name: `MONGODB_URI`
4. Value: (paste connection string)
5. Environment: Production, Preview, Development (chọn cả 3)
6. Click "Save"

### Whitelist IP trong MongoDB Atlas:

1. Network Access → Add IP Address
2. Access List Entry: `0.0.0.0/0`
3. Comment: "Allow from Vercel"
4. Confirm

## ✅ Hoàn thành!

Sau khi làm đủ các bước trên, website sẽ hoạt động bình thường trên Vercel!

**URL:** `https://your-app-name.vercel.app`

---

**Cần hỗ trợ thêm?** Xem file `DEPLOY-VERCEL.md` để biết chi tiết hơn.
