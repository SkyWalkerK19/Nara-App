import { useAuth } from '@/context/AuthContext';
import { hasPermission, roleMap } from '@/roles';
import React from 'react';

import AccountTab from './AccountTab';
import ChatTab from './ChatTab';
import OrderTab from './OrderTab';
import TeamViewTab from './TeamViewTab';

const TABS = [
  { key: 'order', label: 'Order', permission: 'canViewOrder', Component: OrderTab },
  { key: 'chat', label: 'Chat', permission: 'canViewChat', Component: ChatTab },
  { key: 'account', label: 'Account', permission: 'canViewAccount', Component: AccountTab },
  { key: 'teamview', label: 'TeamView', permission: 'canViewTeam', Component: TeamViewTab }
];

export default function RoleManager() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('order');

  // Replace with actual fetch or prop
  const roleName = user?.role || null;
  const currentRole = roleName ? roleMap[roleName] : null;

  if (!currentRole) return <div>Loading...</div>;

  // Filter tabs by permission
  const availableTabs = TABS.filter(
    tab => !tab.permission || hasPermission(roleName, tab.permission)
  );

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {availableTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              fontWeight: tab.key === activeTab ? 'bold' : 'normal',
              marginRight: 12,
              padding: 8
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        {availableTabs.map(tab =>
          tab.key === activeTab ? <tab.Component key={tab.key} isAdmin={roleName === 'admin'} /> : null
        )}
      </div>
    </div>
  );
}
