// components/Chat/ChatList.tsx

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Chat } from '@/types';
import React, { useEffect, useState } from 'react';

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
}

export default function ChatList({ onSelectChat }: ChatListProps) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('chat_participants')
      .select('chat_id, chats(id, name, is_group, created_at)')
      .eq('user_id', user.id)
      .then(({ data }) => {
        // 'data' is [{chat_id, chats: {id, name, ...}}...]
        setChats((data || []).map((cp: any) => cp.chats));
        setLoading(false);
      });
  }, [user]);

  return (
    <div>
      <h3>Your Chats</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {chats.map(chat => (
            <li key={chat.id}>
              <button onClick={() => onSelectChat(chat.id)}>
                {chat.is_group ? chat.name : `Chat: ${chat.id}`}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
