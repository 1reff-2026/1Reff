import { ChatArea, ChatMessage } from "@/components/chat/ChatArea";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AIChatSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const { id } = await params;

  const chatSession = await prisma.aIChatSession.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chatSession || chatSession.userId !== session.user.id) {
    redirect("/ai-connect");
  }

  const initialMessages: ChatMessage[] = chatSession.messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    results: msg.results ? (typeof msg.results === "string" ? JSON.parse(msg.results) : msg.results as any) : undefined,
  }));

  return <ChatArea initialMessages={initialMessages} chatId={id} />;
}
