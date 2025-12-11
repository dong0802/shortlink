# 🔧 DEBUG LỖI 500 TRÊN VERCEL

## ✅ Đã cập nhật code mới - Cần làm:

### 1. Push code mới lên GitHub

```bash
git add .
git commit -m "Fix Vercel 500 error - improved MongoDB connection"
git push
```

### 2. Kiểm tra Environment Variables trong Vercel

Vào **Vercel Dashboard → Settings → Environment Variables**

Đảm bảo có đủ 6 biến sau (chọn cả 3 môi trường):

✅ `MONGODB_URI`
```
mongodb+srv://dong2004_db_user:dong2004@cluster0.znykq07.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

✅ `JWT_SECRET`
```
your_super_secret_jwt_key_change_this_in_production_12345
```

✅ `TELEGRAM_BOT_TOKEN`
```
8483410054:AAEmFYCLqGiDS9S0WLRe8CFOQV8uaSIlubk
```

✅ `TELEGRAM_CHAT_ID`
```
(ID từ bot)
```

✅ `BASE_URL`
```
https://your-app-name.vercel.app
```

✅ `NODE_ENV`
```
production
```

### 3. Kiểm tra MongoDB Atlas Network Access

**QUAN TRỌNG:** Phải có IP `0.0.0.0/0`

1. Vào MongoDB Atlas: https://cloud.mongodb.com
2. Chọn project → **Network Access**
3. Phải có entry: `0.0.0.0/0` (Allow from anywhere)
4. Nếu chưa có, click **"Add IP Address"** → **"Allow Access from Anywhere"**

### 4. Redeploy

1. Vào Vercel Dashboard → **Deployments**
2. Click vào deployment mới nhất
3. Click **"Redeploy"**
4. Đợi build xong

### 5. Kiểm tra Logs

Sau khi deploy:

1. Vào **Deployments** → Click vào deployment
2. Click **"View Function Logs"**
3. Xem có lỗi gì không

**Tìm kiếm các lỗi:**
- ❌ `MongoDB Connection Error` → Kiểm tra MONGODB_URI và Network Access
- ❌ `Cannot find module` → Thiếu dependency
- ❌ `Timeout` → MongoDB connection timeout

### 6. Test Health Check

Sau khi deploy, test endpoint health check:

```
https://your-app-name.vercel.app/api/health
```

Kết quả mong đợi:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2025-12-11T..."
}
```

Nếu `mongodb: "disconnected"` → Vấn đề ở MongoDB connection

## 🐛 Các lỗi thường gặp và cách sửa:

### Lỗi 1: MongoDB Connection Timeout

**Nguyên nhân:** IP chưa được whitelist

**Giải pháp:**
1. MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0`
3. Redeploy Vercel

### Lỗi 2: Environment Variable not found

**Nguyên nhân:** Chưa thêm env vars hoặc chưa chọn đúng môi trường

**Giải pháp:**
1. Vercel → Settings → Environment Variables
2. Kiểm tra tất cả 6 biến
3. Đảm bảo chọn cả 3: Production, Preview, Development
4. Redeploy

### Lỗi 3: Module not found

**Nguyên nhân:** Thiếu dependency trong package.json

**Giải pháp:**
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Lỗi 4: Function timeout

**Nguyên nhân:** MongoDB connection quá lâu

**Giải pháp:**
- Đã tối ưu trong code mới (timeout 10s)
- Kiểm tra MongoDB Atlas region (nên chọn gần Vercel)

## 📊 Cải tiến trong code mới:

✅ **Tăng timeout:** 5s → 10s
✅ **Connection pooling:** maxPoolSize: 10
✅ **Better caching:** Kiểm tra readyState trước khi dùng cache
✅ **Health check endpoint:** `/api/health` để test
✅ **Better error handling:** Log chi tiết hơn
✅ **CORS config:** Cho phép credentials

## 🔍 Cách xem logs chi tiết:

### Trong Vercel Dashboard:

1. **Runtime Logs:**
   - Deployments → Click deployment → View Function Logs
   - Xem real-time logs khi có request

2. **Build Logs:**
   - Deployments → Click deployment → Building tab
   - Xem quá trình build có lỗi không

### Các log quan trọng cần tìm:

```
✅ "MongoDB Connected: ..." → Kết nối thành công
✅ "Using cached database connection" → Cache hoạt động
❌ "MongoDB Connection Error: ..." → Lỗi kết nối
❌ "Database connection failed" → Không kết nối được
```

## 🎯 Checklist debug:

- [ ] Đã push code mới lên GitHub
- [ ] Đã kiểm tra 6 Environment Variables trong Vercel
- [ ] Đã whitelist IP `0.0.0.0/0` trong MongoDB Atlas
- [ ] Đã Redeploy trong Vercel
- [ ] Đã test `/api/health` endpoint
- [ ] Đã xem Function Logs
- [ ] MongoDB connection status = "connected"

## 💡 Tips:

1. **Test local trước:**
   ```bash
   node server-simple.js
   ```
   Nếu local chạy được → Vấn đề ở Vercel config

2. **Test MongoDB connection:**
   ```bash
   node test-db.js
   ```
   Nếu test được → MongoDB OK

3. **Xem logs real-time:**
   - Mở Vercel Dashboard
   - Vào Function Logs
   - Refresh trang web
   - Xem logs xuất hiện

## 🆘 Nếu vẫn lỗi:

1. **Copy toàn bộ logs** từ Vercel Function Logs
2. **Screenshot** Environment Variables
3. **Screenshot** MongoDB Network Access
4. Gửi cho tôi để debug tiếp

---

**Sau khi làm đủ các bước trên, website sẽ hoạt động! 🎉**
