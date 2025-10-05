import { pgTable, serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './auth';

// Enum to define the role of the message sender
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant']);

// Table for each conversation session
export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(), // Relation to the users table
  createdAt: timestamp('created_at').defaultNow(),
});

// Table for each message within a conversation
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id').references(() => chats.id, { onDelete: 'cascade' }).notNull(), // Relation to the chats table
  role: messageRoleEnum('role').notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});