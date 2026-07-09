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
    ],
  },
];
