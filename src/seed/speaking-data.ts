export const speakingTaskData = [
  {
    title: 'Self Introduction',
    prompt:
      'Please tell me a little bit about yourself, including where you are from, your job, and what you enjoy doing in your free time.',
    referenceAudioUrl: null,
    keywords: ['name', 'from', 'work', 'enjoy', 'hobby', 'free time'],
    category: 'Daily Conversation',
  },
  {
    title: 'Talking About Your Hometown',
    prompt:
      'Describe your hometown. Where is it located? What is it famous for? Would you recommend visiting it?',
    referenceAudioUrl: null,
    keywords: ['located', 'famous', 'recommend', 'city', 'town', 'culture'],
    category: 'Daily Conversation',
  },
  {
    title: 'Describing a Picture',
    prompt:
      'Look at the picture provided and describe what is happening. Talk about the people, the setting, and any actions taking place.',
    referenceAudioUrl: null,
    keywords: ['people', 'background', 'holding', 'wearing', 'looking'],
    category: 'Describe a Picture',
  },
  {
    title: 'Describing a City Scene',
    prompt:
      'Imagine you are looking at a busy street in a city. Describe what you see — the people, vehicles, buildings, and atmosphere.',
    referenceAudioUrl: null,
    keywords: ['crowd', 'traffic', 'building', 'atmosphere', 'busy'],
    category: 'Describe a Picture',
  },
  {
    title: 'Expressing an Opinion',
    prompt:
      'Some people prefer to work from home, while others prefer working in an office. Which do you prefer and why? Please provide specific reasons to support your choice.',
    referenceAudioUrl: null,
    keywords: ['prefer', 'because', 'advantage', 'disadvantage', 'flexible'],
    category: 'Opinion & Discussion',
  },
  {
    title: 'Discuss: Social Media Impact',
    prompt:
      'Do you think social media has a positive or negative impact on society? Give reasons and examples to support your view.',
    referenceAudioUrl: null,
    keywords: [
      'positive',
      'negative',
      'impact',
      'society',
      'example',
      'reason',
    ],
    category: 'Opinion & Discussion',
  },
  {
    title: 'Pronunciation: TH Sounds',
    prompt:
      'Read the following sentences aloud, focusing on the "TH" sound: "The thirty-three thieves thought that they thrilled the throne throughout Thursday."',
    referenceAudioUrl: null,
    keywords: ['thirty', 'thieves', 'thought', 'throne', 'Thursday'],
    category: 'Pronunciation',
  },
  {
    title: 'Pronunciation: Vowel Sounds',
    prompt:
      'Practice these minimal pairs by reading them aloud: ship/sheep, bit/beat, full/fool, cot/coat.',
    referenceAudioUrl: null,
    keywords: ['ship', 'sheep', 'bit', 'beat', 'vowel', 'pronunciation'],
    category: 'Pronunciation',
  },
];

export const listeningLessonData = [
  {
    title: 'At the Restaurant',
    audioUrl:
      'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
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
