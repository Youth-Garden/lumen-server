const fs = require('fs');

const primaryColumnFiles = [
  'src/contexts/exam-practice/infrastructure/entities/exam-attempt.entity.ts',
  'src/contexts/grammar/infrastructure/entities/grammar-exercise.entity.ts',
  'src/contexts/grammar/infrastructure/entities/grammar-lesson.entity.ts',
  'src/contexts/grammar/infrastructure/entities/grammar-topic.entity.ts',
  'src/contexts/listening-speaking/infrastructure/entities/listening-lesson.entity.ts',
  'src/contexts/listening-speaking/infrastructure/entities/speaking-task.entity.ts',
  'src/contexts/listening-speaking/infrastructure/entities/speech-record.entity.ts',
  'src/contexts/progress/infrastructure/entities/activity.entity.ts',
  'src/contexts/quiz/infrastructure/entities/preset-question.entity.ts',
  'src/contexts/quiz/infrastructure/entities/preset-quiz.entity.ts',
];

primaryColumnFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/PrimaryColumn,\s*/g, '');
    content = content.replace(/,\s*PrimaryColumn/g, '');
    content = content.replace(/PrimaryColumn/g, '');
    fs.writeFileSync(file, content, 'utf8');
  }
});

const baseListener =
  'src/shared-kernel/infrastructure/database/base.listener.ts';
if (fs.existsSync(baseListener)) {
  let content = fs.readFileSync(baseListener, 'utf8');
  content = content.replace(/event:\s*InsertEvent/g, '_event: InsertEvent');
  content = content.replace(/event:\s*UpdateEvent/g, '_event: UpdateEvent');
  fs.writeFileSync(baseListener, content, 'utf8');
}

const baseRepo = 'src/shared-kernel/infrastructure/database/base.repository.ts';
if (fs.existsSync(baseRepo)) {
  let content = fs.readFileSync(baseRepo, 'utf8');
  content = content.replace(/id as any/g, 'id');
  content = content.replace(/\} as any\);/g, '});');
  fs.writeFileSync(baseRepo, content, 'utf8');
}

const startExamHandler =
  'src/contexts/exam-practice/application/commands/start-exam-attempt.handler.ts';
if (fs.existsSync(startExamHandler)) {
  let content = fs.readFileSync(startExamHandler, 'utf8');
  content = content.replace(/ExamAttemptStatus,\s*/g, '');
  content = content.replace(/,\s*ExamAttemptStatus/g, '');
  fs.writeFileSync(startExamHandler, content, 'utf8');
}

console.log('Cleanup done');
