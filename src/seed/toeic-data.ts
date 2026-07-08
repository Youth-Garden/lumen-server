export const toeicMockData = [
  {
    title: 'TOEIC Practice Test 1',
    description: 'A complete TOEIC listening and reading practice test.',
    isPublished: true,
    questions: [
      {
        part: 1,
        questionNumber: 1,
        audioUrl:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Mock audio (Working)
        imageUrl:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', // Office meeting
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        transcript:
          '(A) They are sitting at a desk.\n(B) They are looking at the ceiling.\n(C) They are leaving the building.\n(D) They are painting the wall.',
        explanation:
          'The picture shows people sitting at a desk having a meeting.',
      },
      {
        part: 2,
        questionNumber: 2,
        audioUrl:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Mock audio (Working)
        questionText: 'When is the project deadline?',
        options: ['A', 'B', 'C'],
        correctAnswer: 'C',
        transcript:
          'When is the project deadline?\n(A) I read the project.\n(B) Yes, the line is busy.\n(C) Next Friday at noon.',
        explanation:
          "Option C directly answers the 'When' question with a time.",
      },
      {
        part: 3,
        questionNumber: 3,
        audioUrl:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        questionText: 'Where most likely are the speakers?',
        options: [
          'At a restaurant',
          'At an airport',
          'At a bank',
          'At a post office',
        ],
        correctAnswer: 'B',
        transcript:
          "W: Excuse me, what time does the flight to London leave?\nM: It's scheduled to depart at 4 PM from Gate 12.\nW: Oh, I need to hurry through security then.",
        explanation:
          "The conversation mentions 'flight' and 'Gate 12', indicating an airport.",
      },
      {
        part: 4,
        questionNumber: 4,
        audioUrl:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        questionText: 'What is the speaker mainly discussing?',
        options: [
          'A new product',
          'A change in policy',
          'A weather forecast',
          'A budget report',
        ],
        correctAnswer: 'B',
        transcript:
          'Attention all employees. Starting next Monday, we will be implementing a new policy regarding remote work. You will be allowed to work from home two days a week instead of one.',
        explanation:
          "The speaker explicitly states 'a new policy regarding remote work'.",
      },
    ],
  },
];
