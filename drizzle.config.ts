import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

// Explicitly load the .env.local file (this should not be necessary in Next.js)
dotenv.config({ path: ".env.local" })

console.log("DATABASE_URI:", process.env.NEXT_PUBLIC_DATABASE_URL)  // Log to confirm if it exists

export default defineConfig({
    schema: './utils/db/schema.ts',
    dialect: 'postgresql',
    out: './drizzle',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URI!,  // Make sure it's not undefined
    }
})
