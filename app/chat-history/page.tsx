"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Bot, User, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface ChatHistory {
  id: number;
  createdAt: Date;
  messages: {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
  }[];
}

export default function ChatHistoryPage() {
  const { data: session } = useSession();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChat, setExpandedChat] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchChatHistory();
    }
  }, [session]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch("/api/chat-history");
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to view your chat history.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold">Chat History</h1>
            <Badge variant="secondary">{chatHistory.length} conversations</Badge>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Conversations</h2>
              <ScrollArea className="h-[600px]">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading chat history...
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No chat history yet. Start a conversation!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          expandedChat === chat.id
                            ? "bg-indigo-100 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700"
                            : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setExpandedChat(expandedChat === chat.id ? null : chat.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            Chat #{chat.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(chat.createdAt), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {chat.messages[0]?.content || "No messages"}
                        </p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {chat.messages.length} messages
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>

          {/* Chat Details */}
          <div className="lg:col-span-2">
            {expandedChat ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-semibold">Chat #{expandedChat}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(
                      new Date(
                        chatHistory.find((c) => c.id === expandedChat)?.createdAt || ""
                      ),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </div>
                </div>

                <Separator className="mb-4" />

                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {chatHistory
                      .find((c) => c.id === expandedChat)
                      ?.messages.map((message) => (
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

                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-indigo-600 text-white ml-auto"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div
                              className={`text-xs mt-1 ${
                                message.role === "user"
                                  ? "text-indigo-200"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {format(new Date(message.createdAt), "h:mm a")}
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
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to view the messages.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}