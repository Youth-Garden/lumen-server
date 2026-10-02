import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function fixBeReadyFor() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();
  await dataSource.query(`
    UPDATE vocab_words 
    SET phonetic = '/biː ˈrɛdi fɔːr/', 
        "phoneticUs" = '/biː ˈrɛdi fɔːr/', 
        "phoneticUk" = '/biː ˈrɛdi fɔːr/' 
    WHERE term = 'be ready for';
  `);
  console.log('✅ Fixed "be ready for" phonetic in database.');
  await dataSource.destroy();
}

fixBeReadyFor().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
