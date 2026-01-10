# Dự án ReactJS mẫu với Vite

Đây là một dự án ReactJS mẫu được tạo bằng Vite, phù hợp để học ReactJS từ cơ bản. Dự án bao gồm cấu hình tối thiểu để React hoạt động với HMR (Hot Module Replacement) và một số quy tắc ESLint.

## Yêu cầu hệ thống

- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn

## Cài đặt dự án

1. **Clone hoặc tải dự án về máy**
   ```bash
   # Nếu bạn đang ở thư mục này rồi, bỏ qua bước này
   cd /home/oanh_ho/react
   ```

2. **Cài đặt các dependency**
   ```bash
   npm install
   ```

## Chạy dự án

### Chạy ở chế độ development
```bash
npm run dev
```
Dự án sẽ chạy trên `http://localhost:5173`

### Build dự án cho production
```bash
npm run build
```

### Xem preview của bản build
```bash
npm run preview
```

### Kiểm tra lỗi với ESLint
```bash
npm run lint
```

## Cấu trúc dự án

```
react/
├── public/          # File tĩnh
├── src/            # Mã nguồn React
│   ├── App.jsx     # Component chính
│   ├── main.jsx    # Entry point
│   └── App.css     # CSS cho App
├── index.html      # HTML template
├── package.json    # Dependencies và scripts
└── vite.config.js  # Cấu hình Vite
```

## Tính năng

- ⚡️ **Vite** - Build tool nhanh và hiện đại
- ⚛️ **React 19** - Phiên bản React mới nhất
- 🔥 **Hot Module Replacement** - Cập nhật realtime khi code
- 📝 **ESLint** - Kiểm tra chất lượng code
- 🎯 **Fast Refresh** - Reload nhanh React components

## Hướng dẫn học ReactJS

1. **Bắt đầu với `src/App.jsx`** - Đây là component chính của ứng dụng
2. **Tìm hiểu JSX** - Cú pháp mở rộng của JavaScript trong React
3. **Components** - Học cách tạo và sử dụng React components
4. **Props** - Cách truyền dữ liệu giữa components
5. **State** - Quản lý trạng thái trong components
6. **Event Handling** - Xử lý sự kiện người dùng

## Tài liệu tham khảo

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vite.dev/guide/)
- [React Tutorial](https://react.dev/learn)
