import { NextResponse } from 'next/server';
import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userChats = await db
      .select({
        id: chats.id,
        createdAt: chats.createdAt,
      })
      .from(chats)
      .where(eq(chats.userId, session.user.id))
      .orderBy(desc(chats.createdAt));

    const chatHistory = await Promise.all(
      userChats.map(async (chat) => {
        const chatMessages = await db
          .select({
            id: messages.id,
            role: messages.role,
            content: messages.content,
            createdAt: messages.createdAt,
          })
          .from(messages)
          .where(eq(messages.chatId, chat.id))
          .orderBy(messages.createdAt);

        return {
          ...chat,
          messages: chatMessages,
        };
      })
    );

    return NextResponse.json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}