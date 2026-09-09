import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { desc } from 'drizzle-orm';

// Schema EXACT basé sur Neon
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password_hash: text('password_hash').notNull(),
  avatar_url: text('avatar_url'),
  role: text('role').default('user'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  status: varchar('status', { length: 255 }).default('active'),
  last_login: timestamp('last_login'),
});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        last_login: users.last_login,
        created_at: users.created_at,
      })
      .from(users)
      .orderBy(desc(users.created_at));

    return NextResponse.json({
      success: true,
      data: allUsers,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}