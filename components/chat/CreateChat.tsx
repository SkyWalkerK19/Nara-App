import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Chat } from '@/types';
import type { CreateChatProps } from '@/types/CreateChatProps';
import React, { useState } from 'react';


export default function CreateChat({ onChatCreated }: CreateChatProps) {
  const { user, loading } = useAuth();
  const [isGroup, setIsGroup] = useState(false);
  const [name, setName] = useState('');
  const [participant, setParticipant] = useState(''); // email or user_id
  const [error, setError] = useState('');
  if (loading) return <div>Loading user...</div>;
if (!user) return <div>Please sign in.</div>;


  // components/chat/CreateChat.tsx

// Assume user, participantId, participant, isGroup, supabase, setError, setName, setParticipant, onChatCreated are defined above

const handleCreateChat = async () => {
  if (!user) {
    setError('User is not logged in.');
    return;
  }

  
  const { data: chatData, error: chatError } = await supabase
    .from('chats')
    .insert({ /* your chat fields */ })
    .select()
    .single();

  if (chatError || !chatData) {
    setError('Failed to create chat.');
    return;
  }

  const participantIds: string[] = isGroup
    ? [user.id, ...participant.split(',').map(id => id.trim())]
    : [user.id, participant];

  const participantsRows = participantIds.map(id => ({
    chat_id: chatData.id,
    user_id: id,
  }));

  const { error: partError } = await supabase
    .from('chat_participants')
    .insert(participantsRows);

  if (partError) {
    setError('Failed to add participants: ' + partError.message);
    return;
  }

  setName('');
  setParticipant('');
  if (onChatCreated) onChatCreated(chatData as Chat);
};


  return (
    <form onSubmit={handleCreateChat} style={{ marginBottom: 16 }}>
      <label>
        <input
          type="checkbox"
          checked={isGroup}
          onChange={e => setIsGroup(e.target.checked)}
        />{' '}
        Group chat?
      </label>
      {isGroup && (
        <div>
          <input
            placeholder="Group name"
            value={name}
            onChange={e => setName(e.target.value)}
            required={isGroup}
          />
        </div>
      )}
      <div>
        <input
          placeholder={
            isGroup
              ? "Participant user IDs (comma separated)"
              : "User's email or user_id"
          }
          value={participant}
          onChange={e => setParticipant(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Chat</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}
