import path from 'path';
import dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';

const workspaceRoot = path.resolve(__dirname, '..', '..', '..');
dotenv.config({ path: path.resolve(workspaceRoot, '.env') });

export default defineConfig({
  schema: './schema.prisma',
  migrations: {
    path: './migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
