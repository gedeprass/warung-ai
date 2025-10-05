"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthButtons } from "@/components/auth-buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "@/lib/auth-client";
import { Send, Bot, User, ShoppingBag, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Welcome to our AI-powered store! I'm here to help you find the perfect products. What are you looking for today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            const content = line.slice(2);
            assistantContent += content;
          }
        }
      }

      if (assistantContent) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: assistantContent,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Shopping Assistant
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {session ? `Welcome, ${session.user?.name}` : "Not signed in"}
              </span>
              {session && (
                <div className="flex items-center gap-2">
                  <Link href="/chat-history">
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      History
                    </Button>
                  </Link>
                  {session.user?.email === "admin@example.com" && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                </div>
              )}
              <AuthButtons />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
          {/* Chat Messages */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col p-4">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="font-semibold">AI Shopping Assistant</h2>
                {isLoading && (
                  <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    Thinking...
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div className={`max-w-[80%] ${message.role === "user" ? "ml-auto" : ""}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>

                        </div>

                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about products, ask for recommendations, or describe what you're looking for..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Welcome Card */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">💡 How it works</h3>
              <p className="text-sm text-muted-foreground">
                Just tell me what you&apos;re looking for and I&apos;ll help you find the perfect products from our store!
              </p>
            </Card>

            {/* Sample Queries */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Try asking:</h3>
              <div className="space-y-2">
                {[
                  "Find comfortable running shoes",
                  "What&apos;s a good birthday gift for my girlfriend?",
                  "Show me wireless headphones under $50",
                  "I need eco-friendly kitchen products",
                ].map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(query)}
                    className="w-full text-left text-sm p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    &ldquo;{query}&rdquo;
                  </button>
                ))}
              </div>
            </Card>

            {/* Account Info */}
            {session && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">📋 Your Account</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Signed in as {session.user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Your chat history is saved for future reference.
                </p>
              </Card>
            )}

            {!session && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">🔐 Sign In Required</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to save your chat history and get personalized recommendations.
                </p>
                <AuthButtons />
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
