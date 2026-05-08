import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import {
  CURRENT_USER, CONVERSATIONS, INITIAL_MESSAGES, CALL_HISTORY,
  DesktopSidebarFrame, noop,
} from '../_helpers';

export default {
  title: 'Web/Conversations/Conversations',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The complete left-navigation sidebar — header, tabs (All / Users / Groups / Calls), search + media filter chips, pinned and recent sections, cross-conversation message search, and a footer with the current user plus sign-out.',
      },
    },
  },
};

const baseProps = {
  conversations: CONVERSATIONS,
  activeId: null,
  onSelect: noop,
  currentUser: CURRENT_USER,
  onNewGroup: noop,
  onNewDM: noop,
  onDeleteConv: noop,
  onPinConv: noop,
  callHistory: CALL_HISTORY,
  onCallSelect: noop,
  onCallStart: noop,
  onLogout: noop,
  allMessages: INITIAL_MESSAGES,
};

const AutoClickTab = ({ label }) => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const btns = document.querySelectorAll('.sb-tab');
      btns.forEach(b => { if (b.textContent.trim() === label) b.click(); });
    }, 30);
  }
  return null;
};

export const Default = {
  render: () => (
    <DesktopSidebarFrame>
      <Sidebar {...baseProps} />
    </DesktopSidebarFrame>
  ),
};

export const WithActiveConversation = {
  render: () => (
    <DesktopSidebarFrame>
      <Sidebar {...baseProps} activeId="grp_eng" />
    </DesktopSidebarFrame>
  ),
};

export const Interactive = {
  render: () => <Demo />,
  parameters: { docs: { description: { story: 'Click a row to select. Hover a row and use the ⋮ menu to Pin/Unpin or Delete.' } } },
};

const Demo = () => {
  const [activeId, setActiveId] = useState('dm_u2');
  const [convs, setConvs] = useState(CONVERSATIONS);
  return (
    <DesktopSidebarFrame>
      <Sidebar
        {...baseProps}
        conversations={convs}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setConvs(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
        }}
        onPinConv={(id) => setConvs(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c))}
        onDeleteConv={(id) => setConvs(prev => prev.filter(c => c.id !== id))}
      />
    </DesktopSidebarFrame>
  );
};

export const CallsTab = {
  render: () => (
    <DesktopSidebarFrame>
      <Sidebar {...baseProps} />
      <AutoClickTab label="Calls" />
    </DesktopSidebarFrame>
  ),
};

export const GroupsTab = {
  render: () => (
    <DesktopSidebarFrame>
      <Sidebar {...baseProps} />
      <AutoClickTab label="Groups" />
    </DesktopSidebarFrame>
  ),
};

export const UsersTab = {
  render: () => (
    <DesktopSidebarFrame>
      <Sidebar {...baseProps} />
      <AutoClickTab label="Users" />
    </DesktopSidebarFrame>
  ),
};

export const AllVariantsShowcase = {
  render: () => (
    <DesktopSidebarFrame>
      <Sidebar {...baseProps} activeId="grp_eng" />
    </DesktopSidebarFrame>
  ),
};
