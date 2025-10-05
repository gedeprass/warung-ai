import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { db } from '@/db';
import { products, chats, messages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the current user session
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  let chatId: number | null = null;

  // If user is authenticated, save chat history
  if (session?.user?.id) {
    // Find or create a chat session for this user
    const existingChat = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, session.user.id))
      .orderBy(desc(chats.createdAt))
      .limit(1);

    if (existingChat.length > 0) {
      chatId = existingChat[0].id;
    } else {
      // Create new chat session
      const [newChat] = await db
        .insert(chats)
        .values({ userId: session.user.id })
        .returning();
      chatId = newChat.id;
    }

    // Save user message to database
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      await db.insert(messages).values({
        chatId: chatId!,
        role: 'user',
        content: lastMessage.content,
      });
    }
  }

  // Fetch products from database to use as context
  const allProducts = await db.select().from(products);

  // Create a comprehensive context for the AI
  const productContext = allProducts
    .map(
      (product) =>
        `Product ID: ${product.id}, Name: ${product.name}, Description: ${product.description}, Price: $${product.price}, Stock: ${product.stock}`
    )
    .join('\n');

  const systemPrompt = `You are a helpful AI shopping assistant for an e-commerce store. You have access to the following products:

${productContext}

Your role is to:
1. Help customers find products that match their needs
2. Ask clarifying questions when needed to narrow down choices
3. Provide honest recommendations based on the available products
4. Mention prices and availability
5. Be friendly, helpful, and conversational

When recommending products, format your response to include product details in a clear way. If no exact match is found, suggest the closest alternatives.

IMPORTANT: You can use markdown formatting in your responses to make them more readable. Use bold text, bullet points, and other formatting as appropriate.

When you want to display products, include their details in your response in this format:

**Product Name:** [Product Name]
**Price:** $[Price]
**Description:** [Description]
**Stock:** [Stock quantity]

You can recommend multiple products by listing them one after another.`;

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages,
    onFinish: async ({ text }) => {
      // Save assistant response to database if user is authenticated
      if (session?.user?.id && chatId) {
        await db.insert(messages).values({
          chatId,
          role: 'assistant',
          content: text,
        });
      }
    },
  });

  return result.toTextStreamResponse();
}