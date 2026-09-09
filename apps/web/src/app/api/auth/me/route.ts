import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

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

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No token' }, { status: 401 });
    }

    const decoded: any = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);

    const [user] = await db
      .select({ 
        id: users.id, 
        name: users.name, 
        email: users.email, 
        role: users.role,
        avatar_url: users.avatar_url,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, decoded.userId));

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}