export const progressData = {
  learningProfile: {
    streak: 5,
    totalPoints: 1250,
    dailyGoalMinutes: 30,
    unlockedBadges: ['FIRST_LESSON_DONE', 'STREAK_3_DAYS'],
    streakFreezes: 2,
    lastActivityDate: new Date(),
  },
  activities: [
    {
      type: 'VOCABULARY_DECK_COMPLETED',
      title: 'Completed Vocabulary Deck',
      description:
        'You completed the "Basic Greetings" deck with 95% accuracy.',
      xpEarned: 50,
      durationMinutes: 10,
    },
    {
      type: 'GRAMMAR_LESSON_COMPLETED',
      title: 'Grammar Lesson: Present Simple',
      description: 'You finished the grammar lesson "Present Simple Tense".',
      xpEarned: 100,
      durationMinutes: 20,
    },
    {
      type: 'TOEIC_TEST_TAKEN',
      title: 'TOEIC Mini Test 1',
      description: 'You took a TOEIC mini test and scored 450.',
      xpEarned: 200,
      durationMinutes: 45,
    },
    {
      type: 'STREAK_MAINTAINED',
      title: '5 Day Streak!',
      description: 'You maintained your learning streak for 5 days in a row.',
      xpEarned: 150,
      durationMinutes: 0,
    },
    {
      type: 'READING_ARTICLE_COMPLETED',
      title: 'Read Article: Technology Today',
      description: 'You completed reading an article about modern technology.',
      xpEarned: 75,
      durationMinutes: 15,
    },
  ],
};
