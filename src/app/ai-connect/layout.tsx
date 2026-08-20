import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default function AIConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen w-full relative overflow-hidden bg-transparent">
      {/* Sidebar for Chat History */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 relative h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
