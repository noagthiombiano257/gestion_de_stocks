const bcrypt = require('bcryptjs');
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { pgTable, serial, text, varchar, timestamp } = require('drizzle-orm/pg-core');
const { eq } = require('drizzle-orm');

// Schema
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

async function createRealUsers() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    const realUsers = [
      {
        name: 'Jeannine Thiombiano',
        email: 'jeannine.thiombiano@gmail.com',
        password: 'password123'
      },
      {
        name: 'Vaimbamba Armand',
        email: 'vaimbamba.armand@gmail.com', 
        password: 'password123'
      },
      {
        name: 'Bounkoungou Chantal',
        email: 'chantal.bounkoungou@gmail.com',
        password: 'password123'
      }
    ];

    console.log('Creating real users...');

    for (const user of realUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Check if user exists
      const [existing] = await db.select().from(users).where(eq(users.email, user.email));
      
      if (existing) {
        console.log(`User ${user.email} already exists, updating password...`);
        await db.update(users).set({ password_hash: hashedPassword }).where(eq(users.email, user.email));
      } else {
        console.log(`Creating user: ${user.email}`);
        await db.insert(users).values({
          name: user.name,
          email: user.email,
          password_hash: hashedPassword,
          role: 'user',
          status: 'active'
        });
      }
    }

    console.log('\n✅ Real users created/updated successfully!');
    console.log('\n📱 Login Credentials:');
    console.log('Email: jeannine.thiombiano@gmail.com | Password: password123');
    console.log('Email: vaimbamba.armand@gmail.com | Password: password123');
    console.log('Email: chantal.bounkoungou@gmail.com | Password: password123');

  } catch (error) {
    console.error('Error creating users:', error);
  }
}

createRealUsers();
