# QuizNote – Website bán đề cương ôn tập & thi trắc nghiệm trực tuyến

QuizNote là nền tảng giúp sinh viên mua đề cương ôn tập chất lượng, luyện thi trắc nghiệm trực tuyến và tham gia các hoạt động gamification như Weekly Quiz tích xu đổi quà. Dự án được xây dựng như một website học tập hiện đại, tập trung vào trải nghiệm người dùng và khả năng mở rộng cho nhiều nhóm đối tượng khác nhau.

## 1. Mục tiêu dự án

- Cung cấp marketplace để mua/bán đề cương, bộ câu hỏi và tài liệu ôn tập theo từng môn học.
- Tạo môi trường luyện thi trắc nghiệm trực tuyến với chấm điểm tự động, thống kê kết quả, lịch sử làm bài.
- Áp dụng cơ chế thưởng xu, Weekly Quiz và đổi quà nhằm tăng động lực học tập cho sinh viên.
- Hỗ trợ nhiều vai trò: học viên, người bán tài liệu, quản trị viên với quyền hạn và giao diện quản lý riêng.

## 2. Các nhóm người dùng chính

- **Học viên (Student)**:  
  Đăng ký tài khoản, tìm kiếm – mua tài liệu, làm bài thi trắc nghiệm, làm Weekly Quiz nhận xu, xem lịch sử và đánh giá tài liệu.

- **Người bán tài liệu (Seller)**:  
  Đăng nhập, đăng bán đề cương/bộ câu hỏi, quản lý kho tài liệu, câu hỏi trắc nghiệm, theo dõi doanh thu và thống kê lượt mua/tải.
- **Quản trị viên (Admin)**:  
  Quản lý người dùng, phê duyệt nội dung tài liệu, cấu hình hệ thống, quản lý role & permission, theo dõi báo cáo – thống kê toàn nền tảng.
  
## 3. Các chức năng nổi bật

### 3.1. Học liệu & marketplace

- Danh sách môn học, bộ đề, đề cương kèm mô tả, giá, đánh giá.  
- Tìm kiếm, lọc, xem chi tiết tài liệu trước khi mua.  
- Quản lý lịch sử giao dịch, hóa đơn và quyền truy cập tài liệu đã mua. 

### 3.2. Thi trắc nghiệm trực tuyến

- Ngân hàng câu hỏi theo chương/môn, nhiều phương án trả lời, giải thích đáp án.
- Tạo đề thi tự động từ ngân hàng câu hỏi, sinh đề ngẫu nhiên cho từng lượt làm bài.
- Chấm điểm tự động, hiển thị số câu đúng/sai, thống kê chi tiết và lưu lịch sử thi.

### 3.3. Weekly Quiz & xu thưởng

- Weekly Quiz cho phép mỗi học viên làm một lần/tuần để nhận xu thưởng.
- Hệ thống xu (coin) được lưu vào tài khoản người dùng và dùng để đổi thưởng.  
- Trang đổi thưởng hiển thị danh sách quà tặng, giá xu, trạng thái giao dịch đổi quà.

### 3.4. Quản lý giao dịch đổi thưởng

- Admin xem danh sách giao dịch đổi quà, lọc theo trạng thái (PENDING/COMPLETED/CANCELLED).
- Giao diện bảng quản trị dark theme, có phân trang, tìm kiếm theo tên/email người dùng, tên quà tặng.

## 4. Kiến trúc & công nghệ

### Frontend

- **ReactJS**, cấu trúc component theo từng module (quiz, rewards, admin…).
- **React-Bootstrap** kết hợp custom SCSS để xây dựng giao diện dark theme, responsive trên nhiều thiết bị.  
- Sử dụng **React Router** cho định tuyến trang (quiz, marketplace, about, lịch sử đổi thưởng…).

### Backend

- **Java + Spring Boot** xây dựng API REST cho toàn bộ chức năng: người dùng, tài liệu, ngân hàng câu hỏi, bài thi, giao dịch.  
- **MySQL** quản lý dữ liệu người dùng, vai trò/quyền hạn, môn học, câu hỏi, đơn hàng, kết quả thi, giao dịch xu và đổi thưởng.  
- Kiến trúc **3-layer (Controller – Service – Repository)** giúp mã nguồn dễ bảo trì, mở rộng và tái sử dụng. 

## 5. Các module chính

- **Auth & User**: đăng ký, đăng nhập, đổi mật khẩu, cập nhật thông tin cá nhân.
- **Subject & Content**: quản lý môn học, chương, đề cương, tài liệu và bộ câu hỏi.
- **Quiz & Exam**: tạo đề, làm bài thi, chấm điểm, thống kê kết quả và lịch sử. 
- **Rewards**: Weekly Quiz, hệ thống xu, trang đổi thưởng, lịch sử đổi quà của người dùng.
- **Admin**: dashboard, quản lý vai trò & quyền hạn, duyệt tài liệu, quản lý giao dịch đổi thưởng và báo cáo tổng hợp.]  

## 6. Hướng phát triển

- Gợi ý tài liệu phù hợp dựa trên lịch sử mua và kết quả thi của từng sinh viên.  
- Thêm tính năng thảo luận, hỏi – đáp theo từng môn học/đề cương.
- Xây dựng mobile app hoặc PWA để tối ưu trải nghiệm trên thiết bị di động.  

---
