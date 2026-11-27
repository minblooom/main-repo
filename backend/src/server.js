// backend/src/server.js
import 'dotenv/config';
import { createApp } from './app.js';
import { seedSpaces } from '../prisma/seed.js';

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  await seedSpaces();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`MindBloom Community Backend listening on http://localhost:${PORT}/api/v1`);
  });
}

start().catch((err) => {
  console.error('Failed to start MindBloom backend:', err);
  process.exit(1);
});
