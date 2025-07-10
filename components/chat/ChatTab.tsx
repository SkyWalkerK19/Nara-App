import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Message } from '@/types';
import React, { useEffect, useState } from 'react';

interface ChatTabProps {
  chatId: string;
}

export default function ChatTab({ chatId }: ChatTabProps) {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [fetching, setFetching] = useState(true); // <-- for messages
  const [error, setError] = useState('');

  // Guard for loading/auth at the top
  if (loading) return <div>Loading user...</div>;
  if (!user) return <div>Please sign in to continue.</div>;

  // Fetch messages on load and subscribe in real time
  useEffect(() => {
    setFetching(true);
    supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .then((response) => {
  const data = response.data as Message[] | null;
  const error = response.error;
  if (error) setError(error.message);
  else setMessages(data || []);
  setFetching(false);
});
    // Real-time subscription
    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload: any) => {
          setMessages((prev: Message[]) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  async function handleSendMessage(e: React.FormEvent) {
  e.preventDefault();
  setError('');
  if (!content.trim()) return;
  if (!user) return; 

  const { error: insertError } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      user_id: user.id,  // Now TypeScript knows user is not null
      content,
    });
  if (insertError) setError(insertError.message);
  setContent('');
}


  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2>Chat</h2>
      <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', marginBottom: 16 }}>
        {fetching ? (
          <div>Loading messages...</div>
        ) : (
          messages.map((msg: Message) => (
            <div key={msg.id} style={{ margin: '8px 0' }}>
              <strong>{msg.user_id === user.id ? 'You' : msg.user_id}</strong>: {msg.content}
              <span style={{ color: '#aaa', marginLeft: 8, fontSize: 12 }}>
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type your message…"
          style={{ flex: 1 }}
          disabled={fetching}
        />
        <button type="submit" disabled={fetching || !content.trim()}>
          Send
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
