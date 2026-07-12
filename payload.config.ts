import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb'; // Or change to postgresAdapter if using Postgres
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';

// Import your collections
import { Users } from './src/collections/Users';
import { Media } from './src/collections/Media';
import { Services } from './src/collections/Services';
import { Projects } from './src/collections/Projects';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
    Services,
    Projects,
  ],
  editor: lexicalEditor(),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://127.0.0.1/housedesign',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
