import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import {
  CURRENT_USER, CONVERSATIONS, INITIAL_MESSAGES, CALL_HISTORY, MobileFrame, noop,
} from '../_helpers';

export default {
  title: 'Mobile/Sidebar/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The sidebar in a mobile viewport. Takes the full screen width and stacks over the chat panel.',
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

export const AllTab = {
  render: () => <MobileFrame><Sidebar {...baseProps} /></MobileFrame>,
};

export const CallsTab = {
  render: () => (
    <MobileFrame>
      <Sidebar {...baseProps} />
      <AutoClickTab label="Calls" />
    </MobileFrame>
  ),
  parameters: { docs: { description: { story: 'Calls tab in mobile. Tap a row to expand its detail card.' } } },
};

export const GroupsTab = {
  render: () => (
    <MobileFrame>
      <Sidebar {...baseProps} />
      <AutoClickTab label="Groups" />
    </MobileFrame>
  ),
};

export const InteractiveSelection = {
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
  parameters: { docs: { description: { story: 'Long-press a row to open the mobile action bottom-sheet (Pin / Delete).' } } },
};

const AutoClickTab = ({ label }) => {
  // Uses document events inside parent; we poll the iframe DOM to click the tab
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const doc = document.querySelector('iframe[title="mobile-preview"]')?.contentDocument;
      const btns = doc?.querySelectorAll('.sb-tab') || [];
      btns.forEach(b => { if (b.textContent.trim() === label) b.click(); });
    }, 150);
  }
  return null;
};
