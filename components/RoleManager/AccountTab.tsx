import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase'; // adjust path as needed
import { roleMap } from '@/roles';
import React, { useState } from 'react';

export default function AccountTab() {
  const { user } = useAuth();

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user) return <div>Loading...</div>;

  const userRole = user.role ? roleMap[user.role] : null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    // Very basic validation
    if (!name.trim() || !age) {
      setError('Name and age are required.');
      setSaving(false);
      return;
    }
    if (isNaN(Number(age)) || Number(age) < 18) {
      setError('Age must be a number and at least 18.');
      setSaving(false);
      return;
    }

    // Save to Supabase
    const { error: supaError } = await supabase
      .from('profiles') // or whatever your user table is called
      .update({ name, age: Number(age) })
      .eq('id', user.id);

    if (supaError) {
      setError('Failed to save: ' + supaError.message);
    } else {
      setMessage('Profile updated!');
    }
    setSaving(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Account Details</h2>
      <form onSubmit={handleSave} style={{ marginBottom: 16 }}>
        <div>
          <label>
            Name:{' '}
            <input
              type="text"
              value={name}
              disabled={saving}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Age:{' '}
            <input
              type="number"
              value={age}
              disabled={saving}
              onChange={e => setAge(e.target.value)}
              required
              min={18}
            />
          </label>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && <div style={{ color: 'green' }}>{message}</div>}

      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Role:</strong> {user.role || 'Unknown'}</div>
      {userRole && (
        <div>
          <strong>Role Permissions:</strong>
          <ul>
            {Object.entries(userRole)
              .filter(([key, value]) => key !== 'name' && value)
              .map(([key]) => (
                <li key={key}>{key.replace(/^can/, '')}</li>
              ))}
          </ul>
        </div>
      )}
      {/* More profile fields can go here */}
    </div>
  );
}
