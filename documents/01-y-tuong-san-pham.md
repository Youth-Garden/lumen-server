# Tài liệu Ý tưởng Sản phẩm — Lumen

## 1. Tổng quan

**Tên dự án:** Lumen

**Mô tả một câu:** Lumen là nền tảng web học tiếng Anh toàn diện, kết hợp luyện thi chứng chỉ (IELTS, TOEIC), xây dựng nền tảng ngữ pháp & từ vựng, và rèn luyện kỹ năng nghe nói — cá nhân hóa theo trình độ và mục tiêu từng người học.

**Vấn đề cần giải quyết:**
- Người học tiếng Anh tại Việt Nam thường phải dùng nhiều công cụ rời rạc: một app từ vựng, một app luyện nghe, một trung tâm luyện thi, một app chấm phát âm — không có nơi nào gộp đủ và cá nhân hóa theo lộ trình.
- Việc luyện Speaking/Writing thiếu phản hồi tức thì nếu không có gia sư — đa số người tự học không biết mình sai ở đâu.
- Nội dung học không bám sát mục tiêu cụ thể (VD: cần TOEIC 650 để tốt nghiệp, cần IELTS 6.5 để du học) khiến người học lãng phí thời gian học lan man.

## 2. Đối tượng người dùng

Mục tiêu ban đầu: **tất cả đối tượng**, nhưng vận hành qua các persona rõ ràng để cá nhân hóa:

| Persona | Mục tiêu chính | Ưu tiên tính năng |
|---|---|---|
| Học sinh/sinh viên | Nền tảng ngữ pháp, từ vựng theo giáo trình | Grammar, Vocabulary |
| Người đi làm luyện thi | Đạt điểm chứng chỉ trong thời hạn cụ thể | Đề thi thử, chấm AI, tracking điểm |
| Người mất gốc | Xây nền tảng từ A1 | Lộ trình từng bước, không áp lực thi cử |
| Người cần giao tiếp thực tế | Nghe nói tự nhiên, phản xạ | Speaking practice, Listening, Shadowing |

Cơ chế phân loại: **bài test đầu vào (placement test)** ngay khi đăng ký, gợi ý lộ trình phù hợp thay vì áp một lộ trình chung cho tất cả.

## 3. Phạm vi tính năng (Scope)

### 3.1. Luyện thi (IELTS, TOEIC...)
- Ngân hàng đề thi thử, chấm tự động cho phần trắc nghiệm (Listening, Reading)
- Chấm Writing/Speaking bằng AI — chấm sơ bộ theo tiêu chí band điểm + gợi ý sửa cụ thể
- Theo dõi tiến độ điểm số theo thời gian (band score tracker / dự đoán điểm)
- Phân tích điểm yếu theo dạng câu hỏi (VD: yếu ở "matching headings" trong IELTS Reading)

### 3.2. Ngữ pháp & Từ vựng
- Bài học theo cấp độ CEFR (A1–C2)
- Flashcard áp dụng thuật toán Spaced Repetition (lặp lại ngắt quãng)
- Bài tập trắc nghiệm/điền từ, phản hồi tức thì
- Từ vựng phân theo chủ đề (công việc, học thuật, đời sống, chuyên ngành thi)
- Từ điển tra cứu tích hợp: định nghĩa, phiên âm, audio, ví dụ, nghĩa tiếng Việt

### 3.3. Nghe & Nói
- Bài nghe có phụ đề song ngữ, điều chỉnh tốc độ phát
- Luyện nói với AI: ghi âm → speech-to-text → chấm phát âm, độ trôi chảy, ngữ điệu
- Shadowing (nghe và nhại theo câu)
- (Giai đoạn sau) Phòng luyện nói ghép cặp người dùng thật

## 4. MVP — Phạm vi giai đoạn 1

Ưu tiên tính năng dễ triển khai, giá trị nhanh, chi phí vận hành thấp trước khi đầu tư vào AI phức tạp:

1. Đăng ký/đăng nhập, placement test
2. Module Từ vựng & Ngữ pháp cơ bản (CEFR A1–B2)
3. Một bộ đề thi thử (TOEIC hoặc IELTS Reading/Listening — chấm tự động, không cần AI phức tạp)
4. Dashboard theo dõi tiến độ cơ bản

**Để giai đoạn 2 (cần tích hợp AI, chi phí vận hành cao hơn):**
- Chấm Writing/Speaking bằng AI
- Luyện nói với phản hồi phát âm chi tiết
- Cá nhân hóa lộ trình bằng AI

## 5. Mô hình kinh doanh (cần chốt sớm)

- **Freemium**: miễn phí bài học cơ bản (từ vựng, ngữ pháp), thu phí cho:
  - Đề thi thử không giới hạn
  - Chấm Writing/Speaking bằng AI
  - Lộ trình cá nhân hóa
- Gói theo mục tiêu cụ thể (VD: "Gói IELTS 3 tháng", "Gói TOEIC cấp tốc")
- Cần chốt sớm vì ảnh hưởng trực tiếp đến thiết kế giới hạn free vs trả phí trong hệ thống

## 6. Nguồn lực nội dung (Content Resources)

### Dữ liệu từ vựng theo cấp độ
- CEFR-J Wordlist (miễn phí cho mục đích thương mại, cần trích dẫn nguồn)
- Words-CEFR-Dataset (GitHub, đóng gói thành thư viện Python `cefrpy`)
- Oxford 5000 (tham khảo cấu trúc, không copy nguyên văn — có bản quyền)

### API tra cứu định nghĩa/phát âm
- Free Dictionary API (dictionaryapi.dev) — miễn phí, không cần key, dùng cho MVP
- Merriam-Webster API — miễn phí phi thương mại (giới hạn 1000 request/ngày), cần thỏa thuận riêng khi thương mại hóa
- WordsAPI — có thể mua trọn bộ dữ liệu để tự host, tránh phụ thuộc rate-limit

### Nội dung luyện thi
- Tự biên soạn từ vựng theo chủ đề thi (tham khảo cấu trúc từ các nguồn: chủ đề công sở TOEIC như Contracts, Marketing, Finance, HR...)
- Đề thi mẫu cần tự biên soạn hoặc mua bản quyền — **không dùng nguyên đề thi thật có bản quyền** (Cambridge, ETS...)

## 7. Rủi ro & Điểm cần quyết định sớm

| Vấn đề | Cần quyết định |
|---|---|
| Bản quyền đề thi | Tự biên soạn hay mua license từ đơn vị luyện thi? |
| Chi phí AI chấm Speaking/Writing | Dùng API nào (chi phí theo lượt gọi), giới hạn free tier ra sao? |
| Ngôn ngữ giao diện | Chỉ tiếng Việt hay hỗ trợ đa ngôn ngữ để mở rộng thị trường sau này? |
| Dữ liệu người dùng | Compliance khi lưu ghi âm giọng nói (dữ liệu nhạy cảm) |

## 8. Roadmap tổng quan

| Giai đoạn | Thời gian dự kiến | Nội dung chính |
|---|---|---|
| Giai đoạn 1 (MVP) | Tháng 1–4 | Từ vựng/ngữ pháp, 1 đề thi thử, placement test |
| Giai đoạn 2 | Tháng 5–7 | Chấm Speaking/Writing bằng AI, mở rộng ngân hàng đề |
| Giai đoạn 3 | Tháng 8–10 | Luyện nghe nói nâng cao, cá nhân hóa lộ trình bằng AI |
| Giai đoạn 4 | Sau đó | Mobile app, cộng đồng luyện tập, gamification |

---

*Tài liệu liên quan: xem `02-kien-truc-trien-khai-ddd.md` để biết chi tiết kiến trúc kỹ thuật của Lumen.*
