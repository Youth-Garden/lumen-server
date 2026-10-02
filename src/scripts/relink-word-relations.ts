import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export async function relinkWordRelations(
  dataSource: DataSource,
): Promise<number> {
  const result = await dataSource.query(`
    UPDATE vocab_word_relations r
    SET "targetWordId" = w.id
    FROM vocab_words w
    WHERE lower(w.term) = lower(r."targetTerm")
      AND r."targetWordId" IS NULL;
  `);

  const affected = Array.isArray(result)
    ? (result[1] ?? 0)
    : Number(result?.affected || 0);
  return affected;
}

if (require.main === module) {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'lumen_db',
    synchronize: false,
    logging: false,
  });

  AppDataSource.initialize()
    .then(async () => {
      console.log('🔗 Relinking vocab_word_relations to targetWordId...');
      const count = await relinkWordRelations(AppDataSource);
      console.log(`✅ Relinked ${count} relations.`);
      await AppDataSource.destroy();
    })
    .catch((err) => {
      console.error('❌ Error relinking relations:', err);
      process.exit(1);
    });
}
