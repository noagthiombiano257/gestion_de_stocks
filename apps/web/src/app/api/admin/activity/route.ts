import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { desc, eq } from 'drizzle-orm';

const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id'),
  action_type: text('action_type').notNull(),
  description: text('description').notNull(),
  entity_type: text('entity_type'),
  entity_id: integer('entity_id'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow(),
});

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const activities = await db
      .select({
        id: activityLogs.id,
        user_id: activityLogs.user_id,
        action_type: activityLogs.action_type,
        description: activityLogs.description,
        entity_type: activityLogs.entity_type,
        entity_id: activityLogs.entity_id,
        metadata: activityLogs.metadata,
        created_at: activityLogs.created_at,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.user_id, users.id))
      .orderBy(desc(activityLogs.created_at))
      .limit(limit);

    return NextResponse.json({ success: true, data: activities });
  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}