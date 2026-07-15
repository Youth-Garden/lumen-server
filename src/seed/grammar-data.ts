export const grammarData = [
  {
    title: 'Present Tenses',
    description:
      'Learn how to use the present tenses (Simple, Continuous, Perfect) in English.',
    cefrLevel: 'A2',
    lessons: [
      {
        title: 'Present Simple',
        content:
          'The present simple tense is used for facts, habits, and general truths. \n\n**Form:** Subject + Verb (s/es). \n\n**Example:** She plays tennis every Sunday.',
        orderIndex: 1,
        exercises: [
          {
            questionText: 'She ___ to the gym every morning.',
            options: ['go', 'goes', 'going', 'gone'],
            correctAnswer: 'goes',
            explanation:
              'With third-person singular (he, she, it) in the present simple, we add "s" or "es" to the verb.',
          },
          {
            questionText: 'Water ___ at 100 degrees Celsius.',
            options: ['boil', 'boils', 'is boiling', 'boiled'],
            correctAnswer: 'boils',
            explanation:
              'This is a general truth or scientific fact, so we use the present simple.',
          },
        ],
      },
      {
        title: 'Present Continuous',
        content:
          'The present continuous tense is used for actions happening right now or temporary situations. \n\n**Form:** Subject + am/is/are + Verb-ing. \n\n**Example:** I am studying English at the moment.',
        orderIndex: 2,
        exercises: [
          {
            questionText: 'Look! The dog ___ in the garden.',
            options: ['play', 'plays', 'is playing', 'played'],
            correctAnswer: 'is playing',
            explanation:
              'The word "Look!" indicates the action is happening right now, so we use present continuous.',
          },
        ],
      },
    ],
  },
  {
    title: 'Conditionals',
    description:
      'Master the different types of conditional sentences (Zero, First, Second, Third).',
    cefrLevel: 'B1',
    lessons: [
      {
        title: 'First Conditional',
        content:
          'The first conditional is used to talk about things which might happen in the future. \n\n**Form:** If + present simple, ... will + infinitive. \n\n**Example:** If it rains, I will stay at home.',
        orderIndex: 1,
        exercises: [
          {
            questionText: 'If you study hard, you ___ the exam.',
            options: ['pass', 'will pass', 'would pass', 'passed'],
            correctAnswer: 'will pass',
            explanation:
              'This is a realistic future possibility, requiring the first conditional structure.',
          },
        ],
      },
    ],
  },
];
