export const grammarData = [
  {
    title: 'Present Tenses',
    description:
      'Learn how to use the present tenses (Simple, Continuous, Perfect) in English.',
    cefrLevel: 'A2',
    category: 'Tenses',
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
    title: 'Past Tenses',
    description:
      'Master the different past tenses (Simple, Continuous, Perfect) to talk about completed actions.',
    cefrLevel: 'A2',
    category: 'Tenses',
    lessons: [
      {
        title: 'Past Simple',
        content:
          'The past simple tense describes actions that started and finished in the past.\n\n**Form:** Subject + Verb-ed (or irregular form).\n\n**Example:** She visited Paris last year.',
        orderIndex: 1,
        exercises: [
          {
            questionText: 'He ___ to the park yesterday.',
            options: ['go', 'goes', 'went', 'gone'],
            correctAnswer: 'went',
            explanation: '"Went" is the irregular past simple form of "go".',
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
    category: 'Conditionals',
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
  {
    title: 'Relative Clauses',
    description:
      'Learn to define and give extra information about people and things using relative clauses.',
    cefrLevel: 'B2',
    category: 'Clauses',
    lessons: [
      {
        title: 'Defining Relative Clauses',
        content:
          'Defining relative clauses identify which person or thing we are talking about.\n\n**Pronouns used:** who (people), which/that (things), where (places).\n\n**Example:** The book that I bought yesterday is great.',
        orderIndex: 1,
        exercises: [
          {
            questionText: 'The woman ___ lives next door is a doctor.',
            options: ['which', 'who', 'where', 'whose'],
            correctAnswer: 'who',
            explanation: '"Who" is used for people in relative clauses.',
          },
        ],
      },
    ],
  },
  {
    title: 'Passive Voice',
    description: 'Understand when and how to use the passive voice in English.',
    cefrLevel: 'B1',
    category: 'Passive Voice',
    lessons: [
      {
        title: 'Present Passive',
        content:
          'The passive voice is used when the action is more important than who does it.\n\n**Form:** Subject + am/is/are + past participle.\n\n**Example:** The report is written every week.',
        orderIndex: 1,
        exercises: [
          {
            questionText: 'The letter ___ by Mary every week.',
            options: ['writes', 'is written', 'is writing', 'write'],
            correctAnswer: 'is written',
            explanation: 'The passive voice uses "to be" + past participle.',
          },
        ],
      },
    ],
  },
  {
    title: 'Modal Verbs',
    description:
      'Learn the uses of modal verbs such as can, could, may, might, must, and should.',
    cefrLevel: 'A2',
    category: 'Modals',
    lessons: [
      {
        title: 'Can and Could',
        content:
          '"Can" expresses ability or permission. "Could" is the past tense of "can" or is used for polite requests.\n\n**Example:** She can speak three languages. Could you help me, please?',
        orderIndex: 1,
        exercises: [
          {
            questionText: '___ you swim when you were five?',
            options: ['Can', 'Could', 'May', 'Must'],
            correctAnswer: 'Could',
            explanation: '"Could" is used to talk about abilities in the past.',
          },
        ],
      },
    ],
  },
  {
    title: 'Reported Speech',
    description:
      'Learn how to report what someone has said using reported speech.',
    cefrLevel: 'B2',
    category: 'Reported Speech',
    lessons: [
      {
        title: 'Reporting Statements',
        content:
          'When reporting what someone said, we often shift the tense back one step.\n\n**Direct:** "I am tired."\n**Reported:** He said (that) he was tired.',
        orderIndex: 1,
        exercises: [
          {
            questionText:
              'She said, "I love pizza." → She said that she ___ pizza.',
            options: ['loves', 'loved', 'is loving', 'love'],
            correctAnswer: 'loved',
            explanation:
              'In reported speech, present simple shifts to past simple.',
          },
        ],
      },
    ],
  },
];
