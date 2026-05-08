import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import {
  CURRENT_USER, CONVERSATIONS, INITIAL_MESSAGES, CALL_HISTORY, MobileFrame, noop,
} from '../_helpers';

export default {
  title: 'Mobile/Conversations/Conversations',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sidebar in a mobile viewport. Takes the full screen width and stacks above the chat panel. Bottom-sheet menus replace hover menus for Pin / Delete.',
      },
    },
  },
};

const baseProps = {
  conversations: CONVERSATIONS, activeId: null, onSelect: noop,
  currentUser: CURRENT_USER, onNewGroup: noop, onNewDM: noop,
  onDeleteConv: noop, onPinConv: noop,
  callHistory: CALL_HISTORY, onCallSelect: noop, onCallStart: noop,
  onLogout: noop, allMessages: INITIAL_MESSAGES,
};

const AutoClickTab = ({ label }) => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const doc = document.querySelector('iframe[title="mobile-preview"]')?.contentDocument;
      const btns = doc?.querySelectorAll('.sb-tab') || [];
      btns.forEach(b => { if (b.textContent.trim() === label) b.click(); });
    }, 150);
  }
  return null;
};

export const Default = {
  render: () => <MobileFrame><Sidebar {...baseProps} /></MobileFrame>,
};

export const AllTab = Default;

export const CallsTab = {
  render: () => (
    <MobileFrame>
      <Sidebar {...baseProps} />
      <AutoClickTab label="Calls" />
    </MobileFrame>
  ),
};

export const GroupsTab = {
  render: () => (
    <MobileFrame>
      <Sidebar {...baseProps} />
      <AutoClickTab label="Groups" />
    </MobileFrame>
  ),
};

export const Interactive = {
  render: () => {
    const [activeId, setActiveId] = useState(null);
    const [convs, setConvs] = useState(CONVERSATIONS);
    return (
      <MobileFrame>
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
      </MobileFrame>
    );
  },
};

export const AllVariantsShowcase = Default;
