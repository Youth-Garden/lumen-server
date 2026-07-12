// Function to generate a full 200-question TOEIC mock test
function generateFullMockTest() {
  const questions = [];

  // Helper for generating standard options
  const standardOptions = ['A', 'B', 'C', 'D'];
  const threeOptions = ['A', 'B', 'C'];

  // Part 1: Photographs (6 questions: 1-6)
  for (let i = 1; i <= 6; i++) {
    questions.push({
      part: 1,
      questionNumber: i,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      imageUrl:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      options: standardOptions,
      correctAnswer: standardOptions[Math.floor(Math.random() * 4)],
      transcript:
        '(A) They are sitting at a desk.\n(B) They are looking at the ceiling.\n(C) They are leaving the building.\n(D) They are painting the wall.',
      explanation: 'The picture shows people sitting at a desk.',
    });
  }

  // Part 2: Question-Response (25 questions: 7-31)
  for (let i = 7; i <= 31; i++) {
    questions.push({
      part: 2,
      questionNumber: i,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      questionText: 'When is the project deadline?',
      options: threeOptions, // Part 2 only has 3 options
      correctAnswer: threeOptions[Math.floor(Math.random() * 3)],
      transcript:
        'When is the project deadline?\n(A) I read the project.\n(B) Yes, the line is busy.\n(C) Next Friday at noon.',
      explanation: "Option C directly answers the 'When' question.",
    });
  }

  // Part 3: Conversations (39 questions: 32-70)
  for (let i = 32; i <= 70; i++) {
    questions.push({
      part: 3,
      questionNumber: i,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      questionText: `Where most likely are the speakers? (Question ${i})`,
      options: [
        'At a restaurant',
        'At an airport',
        'At a bank',
        'At a post office',
      ],
      correctAnswer: standardOptions[Math.floor(Math.random() * 4)],
      transcript:
        "W: Excuse me, what time does the flight to London leave?\nM: It's scheduled to depart at 4 PM from Gate 12.\nW: Oh, I need to hurry through security then.",
      explanation: 'The conversation mentions flight and Gate 12.',
    });
  }

  // Part 4: Short Talks (30 questions: 71-100)
  for (let i = 71; i <= 100; i++) {
    questions.push({
      part: 4,
      questionNumber: i,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      questionText: `What is the speaker mainly discussing? (Question ${i})`,
      options: [
        'A new product',
        'A change in policy',
        'A weather forecast',
        'A budget report',
      ],
      correctAnswer: standardOptions[Math.floor(Math.random() * 4)],
      transcript:
        'Attention all employees. Starting next Monday, we will be implementing a new policy regarding remote work.',
      explanation: 'The speaker states a new policy regarding remote work.',
    });
  }

  // Part 5: Incomplete Sentences (30 questions: 101-130)
  for (let i = 101; i <= 130; i++) {
    questions.push({
      part: 5,
      questionNumber: i,
      questionText: `The board of directors _______ approved the new budget proposal. (Question ${i})`,
      options: ['has finally', 'have final', 'finally to', 'finalizes'],
      correctAnswer: standardOptions[Math.floor(Math.random() * 4)],
      explanation:
        "The adverb 'finally' correctly modifies the verb 'approved'.",
    });
  }

  // Part 6: Text Completion (16 questions: 131-146)
  for (let i = 131; i <= 146; i++) {
    questions.push({
      part: 6,
      questionNumber: i,
      transcript: `Dear Mr. Smith,\n\nWe are writing to inform you that your subscription will expire on the 15th of next month. To continue enjoying our premium services, please _______ your payment details before the deadline.\n\nSincerely,\nThe Management`,
      questionText: `Choose the best word to complete the text. (Question ${i})`,
      options: ['update', 'updates', 'updating', 'updated'],
      correctAnswer: standardOptions[Math.floor(Math.random() * 4)],
      explanation: 'The base form of the verb is required after please.',
    });
  }

  // Part 7: Reading Comprehension (54 questions: 147-200)
  for (let i = 147; i <= 200; i++) {
    questions.push({
      part: 7,
      questionNumber: i,
      transcript: `NOTICE TO ALL STAFF\n\nEffective immediately, the employee parking lot on the east side of the building will be closed for resurfacing. The project is expected to take two weeks. During this time, please use the overflow lot near the south entrance. A shuttle service will be provided from 7:00 AM to 9:00 AM and from 4:00 PM to 6:00 PM to assist those who may need it. We apologize for any inconvenience this may cause and appreciate your cooperation.\n\nManagement`,
      questionText: `What is the purpose of the notice? (Question ${i})`,
      options: [
        'To announce a new employee benefit',
        'To inform staff about parking lot closure',
        'To request volunteers for a project',
        'To complain about parking issues',
      ],
      correctAnswer: standardOptions[Math.floor(Math.random() * 4)],
      explanation:
        'The notice clearly states the employee parking lot will be closed.',
    });
  }

  return questions;
}

export const toeicMockData = [
  {
    title: 'TOEIC Practice Test 1 (Full 200 Qs)',
    description: 'A complete TOEIC listening and reading practice test.',
    isPublished: true,
    questions: generateFullMockTest(),
  },
  {
    title: 'TOEIC Practice Test 2 (Listening Focus)',
    description: 'A TOEIC mock test focusing on listening skills.',
    isPublished: true,
    questions: generateFullMockTest(),
  },
  {
    title: 'TOEIC Practice Test 3 (Reading Focus)',
    description: 'A TOEIC mock test focusing on reading comprehension.',
    isPublished: true,
    questions: generateFullMockTest(),
  },
  {
    title: 'TOEIC Practice Test 4 (Advanced Level)',
    description: 'An advanced TOEIC practice test.',
    isPublished: true,
    questions: generateFullMockTest(),
  },
  {
    title: 'TOEIC Practice Test 5',
    description: 'Standard TOEIC practice test.',
    isPublished: true,
    questions: generateFullMockTest(),
  },
  {
    title: 'TOEIC Practice Test 6',
    description: 'Standard TOEIC practice test.',
    isPublished: true,
    questions: generateFullMockTest(),
  },
  {
    title: 'TOEIC Practice Test 7',
    description: 'Standard TOEIC practice test.',
    isPublished: true,
    questions: generateFullMockTest(),
  },
  {
    title: 'TOEIC Practice Test 8',
    description: 'Standard TOEIC practice test.',
    isPublished: true,
    questions: generateFullMockTest(),
  },
  {
    title: 'TOEIC Practice Test 9',
    description: 'Standard TOEIC practice test.',
    isPublished: true,
    questions: generateFullMockTest(),
  },
  {
    title: 'TOEIC Practice Test 10',
    description: 'Standard TOEIC practice test.',
    isPublished: false,
    questions: generateFullMockTest(),
  },
];
