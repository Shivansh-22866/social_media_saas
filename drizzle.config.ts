import 'dotenv/config'
import {defineConfig} from 'drizzle-kit'

export default defineConfig({
    schema: './utils/db/schema.ts',
    dialect: 'postgresql',
    out: './drizzle',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }
})