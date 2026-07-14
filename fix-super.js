const fs = require('fs');

const files = [
  'src/contexts/iam/infrastructure/user.repository.ts',
  'src/contexts/material/infrastructure/repositories/material-query.repository.ts',
  'src/contexts/notification/infrastructure/repositories/notification-query.repository.ts',
  'src/contexts/notification/infrastructure/repositories/notification.repository.ts',
  'src/contexts/progress/infrastructure/repositories/learning-profile.repository.ts',
  'src/contexts/quiz/infrastructure/repositories/quiz.repository.ts',
  'src/contexts/reading/infrastructure/repositories/article.repository.ts',
  'src/contexts/toeic/infrastructure/repositories/toeic-query.repository.ts',
  'src/contexts/vocabulary/infrastructure/repositories/deck.repository.ts',
  'src/contexts/vocabulary/infrastructure/repositories/flashcard.repository.ts',
  'src/contexts/vocabulary/infrastructure/repositories/user-progress.repository.ts',
  'src/contexts/vocabulary/infrastructure/repositories/vocabulary-query.repository.ts',
  'src/contexts/vocabulary/infrastructure/repositories/vocabulary-word.repository.ts',
];

files.forEach((f) => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');

    // Find what the BaseRepository entity is
    const matchBase = content.match(/extends\s+BaseRepository<(\w+)>/);
    if (matchBase) {
      const entity = matchBase[1];

      // Find the constructor param that injects this entity
      const regex = new RegExp(
        `@InjectRepository\\(${entity}\\)\\s*(?:private|protected|public)?\\s*(?:readonly)?\\s*(\\w+)`,
      );
      const paramMatch = content.match(regex);

      if (paramMatch) {
        const paramName = paramMatch[1];
        content = content.replace(/super\(repository\)/, `super(${paramName})`);
        fs.writeFileSync(f, content, 'utf8');
        console.log(`Fixed super call in ${f} using ${paramName}`);
      } else {
        console.log(`Could not find param for ${entity} in ${f}`);
      }
    }
  }
});
