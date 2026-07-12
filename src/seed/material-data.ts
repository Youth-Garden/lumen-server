import {
  MaterialLevel,
  MaterialType,
} from '../contexts/material/domain/enums/material.enum';

export const materialMockData = [
  {
    title: 'Daily Dictation - Short Office Conversation',
    description:
      'Listen to a short conversation between two colleagues discussing a project deadline.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.A2,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80',
    tags: ['business', 'office', 'dictation'],
    duration: 30,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Hey John, do you have a minute?',
        translation: 'Chào John, bạn có rảnh một chút không?',
        startTime: 0,
        endTime: 3.5,
      },
      {
        sequenceNumber: 2,
        text: 'Sure, what do you need?',
        translation: 'Chắc chắn rồi, bạn cần gì?',
        startTime: 3.6,
        endTime: 5.5,
      },
      {
        sequenceNumber: 3,
        text: 'I wanted to talk about the upcoming project deadline.',
        translation: 'Tôi muốn nói về hạn chót của dự án sắp tới.',
        startTime: 5.6,
        endTime: 10.0,
      },
      {
        sequenceNumber: 4,
        text: 'It seems we might need a few more days to complete the testing phase.',
        translation:
          'Có vẻ như chúng ta có thể cần thêm vài ngày nữa để hoàn thành giai đoạn thử nghiệm.',
        startTime: 10.1,
        endTime: 16.0,
      },
    ],
  },
  {
    title: 'Technology News - AI Advancements',
    description:
      'A short report on the latest advancements in Artificial Intelligence.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.B2,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80',
    tags: ['technology', 'news', 'ai', 'dictation'],
    duration: 45,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Artificial intelligence continues to evolve at an unprecedented rate.',
        translation:
          'Trí tuệ nhân tạo tiếp tục phát triển với tốc độ chưa từng thấy.',
        startTime: 0,
        endTime: 5.0,
      },
      {
        sequenceNumber: 2,
        text: 'Recent breakthroughs in machine learning have paved the way for more sophisticated systems.',
        translation:
          'Những đột phá gần đây trong học máy đã mở đường cho các hệ thống tinh vi hơn.',
        startTime: 5.1,
        endTime: 12.0,
      },
      {
        sequenceNumber: 3,
        text: 'These systems can analyze massive amounts of data in mere seconds.',
        translation:
          'Các hệ thống này có thể phân tích lượng dữ liệu khổng lồ chỉ trong vài giây.',
        startTime: 12.1,
        endTime: 18.0,
      },
      {
        sequenceNumber: 4,
        text: 'However, ethical considerations remain a significant topic of debate.',
        translation:
          'Tuy nhiên, các cân nhắc về đạo đức vẫn là một chủ đề tranh luận lớn.',
        startTime: 18.1,
        endTime: 24.0,
      },
    ],
  },
  {
    title: 'Customer Service - Handling a Complaint',
    description:
      'A dialogue between a customer service representative and an unhappy client.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.B1,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=400&q=80',
    tags: ['business', 'customer service', 'toeic'],
    duration: 50,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Thank you for calling Horizon Electronics. How can I help you today?',
        translation:
          'Cảm ơn quý khách đã gọi Horizon Electronics. Tôi có thể giúp gì cho quý khách?',
        startTime: 0,
        endTime: 4.5,
      },
      {
        sequenceNumber: 2,
        text: 'Yes, I bought a laptop from your store last week, and the screen is flickering.',
        translation:
          'Vâng, tôi đã mua một chiếc laptop từ cửa hàng của bạn tuần trước, và màn hình bị nhấp nháy.',
        startTime: 4.6,
        endTime: 10.0,
      },
      {
        sequenceNumber: 3,
        text: 'I apologize for the inconvenience. Do you have your receipt number?',
        translation:
          'Tôi xin lỗi vì sự bất tiện này. Quý khách có mã số biên lai không?',
        startTime: 10.1,
        endTime: 15.0,
      },
      {
        sequenceNumber: 4,
        text: 'Let me check my email... Yes, it is HE-45892.',
        translation: 'Để tôi kiểm tra email... Vâng, nó là HE-45892.',
        startTime: 15.1,
        endTime: 20.0,
      },
      {
        sequenceNumber: 5,
        text: 'Thank you. I can process a replacement for you right away.',
        translation:
          'Cảm ơn quý khách. Tôi có thể xử lý việc đổi mới cho quý khách ngay lập tức.',
        startTime: 20.1,
        endTime: 25.0,
      },
    ],
  },
  {
    title: 'Travel Announcement - Airport Boarding',
    description: 'Listen to a standard airport boarding announcement.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.A2,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80',
    tags: ['travel', 'airport', 'announcement'],
    duration: 35,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Attention all passengers for flight 892 to London.',
        translation:
          'Xin chú ý tất cả hành khách của chuyến bay 892 đi London.',
        startTime: 0,
        endTime: 4.0,
      },
      {
        sequenceNumber: 2,
        text: 'We are now ready to begin boarding at gate 12.',
        translation:
          'Chúng tôi hiện đã sẵn sàng bắt đầu cho hành khách lên máy bay tại cổng 12.',
        startTime: 4.1,
        endTime: 8.5,
      },
      {
        sequenceNumber: 3,
        text: 'Please have your boarding pass and passport ready.',
        translation: 'Vui lòng chuẩn bị sẵn thẻ lên máy bay và hộ chiếu.',
        startTime: 8.6,
        endTime: 13.0,
      },
      {
        sequenceNumber: 4,
        text: 'We will board first class and business class passengers first.',
        translation:
          'Chúng tôi sẽ cho hành khách hạng nhất và hạng thương gia lên máy bay trước.',
        startTime: 13.1,
        endTime: 18.0,
      },
    ],
  },
  {
    title: 'Financial Update - Quarterly Earnings',
    description:
      'A brief report on a company’s quarterly financial performance.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.C1,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80',
    tags: ['finance', 'business', 'report'],
    duration: 60,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Globex Corporation reported a highly successful third quarter today.',
        translation:
          'Tập đoàn Globex hôm nay đã báo cáo một quý ba vô cùng thành công.',
        startTime: 0,
        endTime: 5.0,
      },
      {
        sequenceNumber: 2,
        text: 'Revenue increased by 15 percent, largely driven by strong software sales.',
        translation:
          'Doanh thu tăng 15 phần trăm, phần lớn được thúc đẩy bởi doanh số phần mềm mạnh mẽ.',
        startTime: 5.1,
        endTime: 11.0,
      },
      {
        sequenceNumber: 3,
        text: 'Despite supply chain issues, the profit margin remained stable.',
        translation:
          'Bất chấp các vấn đề về chuỗi cung ứng, biên lợi nhuận vẫn ổn định.',
        startTime: 11.1,
        endTime: 16.0,
      },
      {
        sequenceNumber: 4,
        text: 'The CEO attributes this resilience to their recent cost-cutting measures.',
        translation:
          'Giám đốc điều hành cho rằng sự kiên cường này là nhờ các biện pháp cắt giảm chi phí gần đây của họ.',
        startTime: 16.1,
        endTime: 22.0,
      },
    ],
  },
  {
    title: 'Restaurant Reservation - Booking a Table',
    description: 'A phone conversation to book a table at a restaurant.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.A1,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    tags: ['daily life', 'restaurant', 'conversation'],
    duration: 40,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Hello, La Cucina restaurant. How can I help you?',
        translation:
          'Xin chào, nhà hàng La Cucina. Tôi có thể giúp gì cho bạn?',
        startTime: 0,
        endTime: 4.0,
      },
      {
        sequenceNumber: 2,
        text: 'Hi, I would like to book a table for tomorrow evening.',
        translation: 'Xin chào, tôi muốn đặt một bàn cho tối ngày mai.',
        startTime: 4.1,
        endTime: 8.0,
      },
      {
        sequenceNumber: 3,
        text: 'Certainly. For how many people and at what time?',
        translation:
          'Chắc chắn rồi. Dành cho bao nhiêu người và vào lúc mấy giờ?',
        startTime: 8.1,
        endTime: 12.0,
      },
      {
        sequenceNumber: 4,
        text: 'A table for four people at 7:30 PM, please.',
        translation: 'Một bàn cho bốn người lúc 7:30 tối, làm ơn.',
        startTime: 12.1,
        endTime: 16.0,
      },
      {
        sequenceNumber: 5,
        text: 'Perfect. May I have your name?',
        translation: 'Hoàn hảo. Tôi có thể biết tên bạn không?',
        startTime: 16.1,
        endTime: 19.0,
      },
    ],
  },
  {
    title: 'Weather Forecast - Weekend Update',
    description: 'A local weather report for the upcoming weekend.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.B1,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=400&q=80',
    tags: ['weather', 'news', 'daily life'],
    duration: 45,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Good morning, here is your weekend weather forecast.',
        translation:
          'Chào buổi sáng, đây là dự báo thời tiết cuối tuần của bạn.',
        startTime: 0,
        endTime: 4.0,
      },
      {
        sequenceNumber: 2,
        text: 'Saturday will be mostly sunny with a high of 25 degrees.',
        translation:
          'Thứ Bảy sẽ chủ yếu có nắng với nhiệt độ cao nhất là 25 độ.',
        startTime: 4.1,
        endTime: 9.0,
      },
      {
        sequenceNumber: 3,
        text: 'However, expect a significant drop in temperature by Sunday morning.',
        translation:
          'Tuy nhiên, hãy dự kiến nhiệt độ sẽ giảm đáng kể vào sáng Chủ Nhật.',
        startTime: 9.1,
        endTime: 14.0,
      },
      {
        sequenceNumber: 4,
        text: 'There is a 60 percent chance of heavy showers in the afternoon.',
        translation: 'Có 60 phần trăm khả năng có mưa rào lớn vào buổi chiều.',
        startTime: 14.1,
        endTime: 19.0,
      },
      {
        sequenceNumber: 5,
        text: 'So, don’t forget to bring your umbrella if you are heading out.',
        translation: 'Vì vậy, đừng quên mang theo ô nếu bạn đi ra ngoài.',
        startTime: 19.1,
        endTime: 24.0,
      },
    ],
  },
  {
    title: 'Job Interview - Strengths and Weaknesses',
    description: 'An excerpt from a typical job interview.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.B2,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    tags: ['business', 'interview', 'career'],
    duration: 55,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Could you tell me about your greatest professional strength?',
        translation:
          'Bạn có thể cho tôi biết về điểm mạnh chuyên môn lớn nhất của bạn không?',
        startTime: 0,
        endTime: 4.0,
      },
      {
        sequenceNumber: 2,
        text: 'I consider my ability to solve complex problems under pressure to be my greatest strength.',
        translation:
          'Tôi coi khả năng giải quyết các vấn đề phức tạp dưới áp lực là điểm mạnh lớn nhất của mình.',
        startTime: 4.1,
        endTime: 10.0,
      },
      {
        sequenceNumber: 3,
        text: 'That’s excellent. And what would you say is your biggest weakness?',
        translation:
          'Thật tuyệt vời. Và bạn sẽ nói điểm yếu lớn nhất của bạn là gì?',
        startTime: 10.1,
        endTime: 15.0,
      },
      {
        sequenceNumber: 4,
        text: 'Sometimes I struggle with delegating tasks because I prefer a hands-on approach.',
        translation:
          'Đôi khi tôi gặp khó khăn trong việc giao việc vì tôi thích cách làm việc trực tiếp.',
        startTime: 15.1,
        endTime: 21.0,
      },
      {
        sequenceNumber: 5,
        text: 'But I have been actively working on improving my team management skills.',
        translation:
          'Nhưng tôi đã và đang tích cực làm việc để cải thiện kỹ năng quản lý nhóm của mình.',
        startTime: 21.1,
        endTime: 26.0,
      },
    ],
  },
  {
    title: 'Museum Tour - Ancient Egypt Exhibit',
    description: 'An audio guide description from a museum exhibit.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.B2,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&w=400&q=80',
    tags: ['history', 'culture', 'tour'],
    duration: 50,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Welcome to the Ancient Egypt exhibit. Please step into the main hall.',
        translation:
          'Chào mừng bạn đến với triển lãm Ai Cập cổ đại. Vui lòng bước vào sảnh chính.',
        startTime: 0,
        endTime: 5.0,
      },
      {
        sequenceNumber: 2,
        text: 'To your left, you will see a beautifully preserved sarcophagus from the 18th Dynasty.',
        translation:
          'Bên trái của bạn, bạn sẽ thấy một chiếc quách được bảo quản tuyệt đẹp từ Vương triều thứ 18.',
        startTime: 5.1,
        endTime: 11.0,
      },
      {
        sequenceNumber: 3,
        text: 'Notice the intricate hieroglyphics carved into the stone surface.',
        translation:
          'Hãy chú ý đến những chữ tượng hình phức tạp được chạm khắc trên bề mặt đá.',
        startTime: 11.1,
        endTime: 16.0,
      },
      {
        sequenceNumber: 4,
        text: 'These inscriptions were meant to guide the pharaoh safely into the afterlife.',
        translation:
          'Những bản khắc này nhằm hướng dẫn pharaoh an toàn vào thế giới bên kia.',
        startTime: 16.1,
        endTime: 22.0,
      },
    ],
  },
  {
    title: 'Health Advice - Benefits of Sleep',
    description:
      'A podcast snippet about the importance of getting enough rest.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.B1,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=400&q=80',
    tags: ['health', 'lifestyle', 'podcast'],
    duration: 48,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Many people underestimate the profound impact that sleep has on overall health.',
        translation:
          'Nhiều người đánh giá thấp tác động sâu sắc của giấc ngủ đối với sức khỏe tổng thể.',
        startTime: 0,
        endTime: 6.0,
      },
      {
        sequenceNumber: 2,
        text: 'Getting seven to eight hours of quality sleep can boost your immune system.',
        translation:
          'Ngủ đủ bảy đến tám giờ chất lượng có thể tăng cường hệ thống miễn dịch của bạn.',
        startTime: 6.1,
        endTime: 11.0,
      },
      {
        sequenceNumber: 3,
        text: 'It also improves cognitive function, memory consolidation, and emotional regulation.',
        translation:
          'Nó cũng cải thiện chức năng nhận thức, củng cố trí nhớ và điều hòa cảm xúc.',
        startTime: 11.1,
        endTime: 17.0,
      },
      {
        sequenceNumber: 4,
        text: 'Chronic sleep deprivation, on the other hand, is linked to serious health conditions.',
        translation:
          'Mặt khác, thiếu ngủ mãn tính có liên quan đến các tình trạng sức khỏe nghiêm trọng.',
        startTime: 17.1,
        endTime: 40.0,
      },
    ],
  },
  {
    title: 'Technology News - Cybersecurity Update',
    description: 'Listen to an update on the latest cybersecurity measures.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.C1,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
    tags: ['technology', 'news', 'security'],
    duration: 50,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Welcome to the daily tech update.',
        translation: 'Chào mừng đến với bản tin công nghệ hàng ngày.',
        startTime: 0,
        endTime: 5.0,
      },
      {
        sequenceNumber: 2,
        text: 'Today we discuss the new cybersecurity protocols.',
        translation:
          'Hôm nay chúng ta thảo luận về các giao thức an ninh mạng mới.',
        startTime: 5.1,
        endTime: 10.0,
      },
    ],
  },
  {
    title: 'Health Advice - Nutrition Basics',
    description: 'Basic advice on maintaining a healthy diet.',
    type: MaterialType.AUDIO,
    level: MaterialLevel.A2,
    mediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80',
    tags: ['health', 'advice', 'nutrition'],
    duration: 45,
    transcripts: [
      {
        sequenceNumber: 1,
        text: 'Eating a balanced diet is very important.',
        translation: 'Ăn một chế độ ăn uống cân bằng là rất quan trọng.',
        startTime: 0,
        endTime: 5.0,
      },
      {
        sequenceNumber: 2,
        text: 'Make sure to include plenty of vegetables.',
        translation: 'Hãy chắc chắn bao gồm nhiều rau củ.',
        startTime: 5.1,
        endTime: 10.0,
      },
    ],
  },
];
