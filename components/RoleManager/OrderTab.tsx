import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Orders } from '@/types/Order';
import React, { useState } from 'react';

export default function OrderTab() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState(''); // user id or team id
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (loading) return <div>Loading user...</div>;
  if (!user) return <div>Please sign in.</div>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (!user) {
      setError('User not found. Please sign in again.');
      setSubmitting(false);
      return;
    }
    const order: Partial<Orders> = {
      created_by: user.id,
      items: [{ name: items }], // you could use a better UI for real menus!
      notes,
      assigned_to: assignedTo || undefined,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from('orders').insert(order);
    setSubmitting(false);

    if (insertError) setError(insertError.message);
    else {
      setSuccess('Order submitted!');
      setItems('');
      setNotes('');
      setAssignedTo('');
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2>Send an Order</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          value={items}
          onChange={e => setItems(e.target.value)}
          placeholder="Item(s)"
          required
        />
        <input
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          placeholder="Assign to (user or team ID)"
        />
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={3}
        />
        <button type="submit" disabled={submitting || !items}>
          {submitting ? 'Sending...' : 'Send Order'}
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
      </form>
    </div>
  );
}
