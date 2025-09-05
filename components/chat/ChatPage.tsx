// components/Chat/ChatPage.tsx

import { useState } from 'react';
import ChatList from './ChatList';
import ChatTab from './ChatTab';
import CreateChat from './CreateChat';

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ minWidth: 220 }}>
        <CreateChat onChatCreated={chat => setSelectedChatId(chat.id)} />
        <ChatList onSelectChat={setSelectedChatId} />
      </div>
      <div style={{ flex: 1 }}>
        {selectedChatId ? (
          <ChatTab chatId={selectedChatId} />
        ) : (
          <div style={{ padding: 24 }}>Select a chat to start messaging.</div>
        )}
      </div>
    </div>
  );
}
