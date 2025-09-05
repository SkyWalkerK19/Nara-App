// components/RoleManager/RoleManager.tsx
import { useAuth } from '@/context/AuthContext';
import { hasPermission, roleMap } from '@/roles';
import React, { useState } from 'react';

import type { User } from '@/types/User';
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

function getTabProps(tabKey: string, user: User | null, roleName: string | null) {
  const props: any = { key: tabKey };
  if (tabKey === 'teamview' || tabKey === 'account') {
    props.isAdmin = roleName === 'admin';
  }
  if (tabKey === 'chat') {
    if (!user?.chatId) return null;
    props.chatId = user.chatId;
  }
  return props;
}

export default function RoleManager() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('order');
  const roleName = user?.role || null;
  const currentRole = roleName ? roleMap[roleName] : null;

  if (!currentRole) return <div>Loading...</div>;

  const availableTabs = roleName
    ? TABS.filter(tab => !tab.permission || hasPermission(roleName, tab.permission))
    : [];

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
              padding: 8,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        {availableTabs.map(tab => {
          if (tab.key !== activeTab) return null;
          const props = getTabProps(tab.key, user, roleName);
          if (props === null) {
            return <div key={`${tab.key}-missing`}>Required info missing for this tab.</div>;
          }
          return React.createElement(tab.Component, props);
        })}
      </div>
    </div>
  );
}
// This component manages the role-based UI tabs for users.