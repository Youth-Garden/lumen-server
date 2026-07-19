const { Client } = require('pg');
require('dotenv').config();

async function enablePgTrgm() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database.');
    
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
    console.log('Successfully enabled pg_trgm extension.');
    
    // Also add trigram indexes to vocabulary and grammar tables for performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_vocab_words_term_trgm ON vocab_words USING gin (term gin_trgm_ops);');
    console.log('Added trigram index on vocab_words.term');
    
    await client.query('CREATE INDEX IF NOT EXISTS idx_grammar_topics_title_trgm ON grammar_topics USING gin (title gin_trgm_ops);');
    console.log('Added trigram index on grammar_topics.title');

  } catch (err) {
    console.error('Error enabling pg_trgm:', err);
  } finally {
    await client.end();
  }
}

enablePgTrgm();
