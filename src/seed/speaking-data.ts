export const speakingTaskData = [
  {
    title: 'Self Introduction',
    prompt:
      'Please tell me a little bit about yourself, including where you are from, your job, and what you enjoy doing in your free time.',
    referenceAudioUrl: 'https://example.com/audio/intro.mp3', // Placeholder
    keywords: ['name', 'from', 'work', 'enjoy', 'hobby', 'free time'],
  },
  {
    title: 'Describing a Picture',
    prompt:
      'Look at the picture provided and describe what is happening. Talk about the people, the setting, and any actions taking place.',
    referenceAudioUrl: null,
    keywords: ['people', 'background', 'holding', 'wearing', 'looking'],
  },
  {
    title: 'Expressing an Opinion',
    prompt:
      'Some people prefer to work from home, while others prefer working in an office. Which do you prefer and why? Please provide specific reasons to support your choice.',
    referenceAudioUrl: null,
    keywords: ['prefer', 'because', 'advantage', 'disadvantage', 'flexible'],
  },
];

export const listeningLessonData = [
  {
    title: 'At the Restaurant',
    audioUrl:
      'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', // Placeholder audio
    cefrLevel: 'A2',
    transcript: [
      {
        text: 'Hello, are you ready to order?',
        translation: 'Xin chào, bạn đã sẵn sàng gọi món chưa?',
        startTime: 0,
        endTime: 2.5,
      },
      {
        text: 'Yes, I would like the grilled chicken and a side salad.',
        translation: 'Vâng, tôi muốn gọi món gà nướng và một đĩa salad ăn kèm.',
        startTime: 3.0,
        endTime: 6.5,
      },
      {
        text: 'Excellent choice. And what would you like to drink?',
        translation: 'Sự lựa chọn tuyệt vời. Và bạn muốn uống gì?',
        startTime: 7.0,
        endTime: 9.5,
      },
    ],
  },
];
