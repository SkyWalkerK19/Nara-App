import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Team } from '../../types/Team';
import type { User } from '../../types/User';

export default function TeamViewTab() {
  const { user, loading } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading || !user) return;
    setFetching(true);

    async function fetchTeam() {
      if (user && user.team) {
        // Fetch this user's team and its members
        const { data: teamData } = await supabase
          .from('teams')
          .select('*')
          .eq('id', user.team)
          .single();
        setTeam(teamData || null);

        const { data: teamMembers } = await supabase
          .from('users')
          .select('*')
          .eq('team', user.team);
        setMembers(teamMembers || []);
      } else {
        setTeam(null);
        setMembers([]);
      }
      setFetching(false);
    }

    async function fetchAllTeams() {
      // Admin: fetch all teams
      const { data: allTeams } = await supabase.from('teams').select('*');
      setTeams(allTeams || []);
    }

    if (user.role === 'admin') fetchAllTeams();
    fetchTeam();
  }, [loading, user]);

  if (loading) return <div>Loading team info...</div>;
  if (!user) return <div>Please sign in.</div>;

  // Non-team-member UI
  if (!user.team) {
    return (
      <div>
        <h3>You're not on a team yet</h3>
        {/* TODO: Join/Create team UI here */}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2>Team: {team ? team.name : 'Loading...'}</h2>
      <h3>Members</h3>
      <ul>
        {members.map(member => (
          <li key={member.id}>
            {member.name} ({member.role}) {member.id === user.id && '(You)'}
          </li>
        ))}
      </ul>

      {/* Admin actions */}
      {user.role === 'admin' && (
        <div>
          <h3>All Teams</h3>
          <ul>
            {teams.map(t => (
              <li key={t.id}>
                {t.name} (ID: {t.id})
                {/* Add edit/delete/manage buttons here */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
