import { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { ChatPanel } from '../../../components/ChatPanel';
import {
  CallOverlay, ThreadPanel, ProfilePanel, GroupMembersPanel,
  GroupModal, NewDMModal,
} from '../../../components/Overlays';
import {
  CURRENT_USER, USERS, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES,
  THREAD_MESSAGES, CALL_HISTORY, Centered, noop,
} from '../../_helpers';

export default {
  title: 'App Screens/Web/App Shell',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full desktop app — sidebar plus chat panel, with optional right-side panels (Thread, Profile, Group members) and overlays (Call, Group creation, New DM). Each story demonstrates one end-to-end configuration.',
      },
    },
  },
};

const Stage = ({ children, height = 760, width = 1280 }) => (
  <Centered maxWidth={width + 48} padding={16}>
    <div
      className="app-shell"
      style={{
        width: '100%',
        height,
        display: 'flex',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
      }}
    >
      {children}
    </div>
  </Centered>
);

const baseChatProps = {
  currentUser: CURRENT_USER, allUsers: ALL_USERS,
  onSend: noop, onReact: noop, onDelete: noop, onEdit: noop, onVote: noop,
  onThreadOpen: noop, onCallStart: noop, onViewProfile: noop, onViewMembers: noop,
  typingUsers: [], density: 'comfortable', blockedUsers: new Set(), isMobile: false,
  onBack: noop, onMarkUnread: noop,
};

const baseSidebarProps = {
  conversations: CONVERSATIONS, currentUser: CURRENT_USER,
  onNewGroup: noop, onNewDM: noop, onDeleteConv: noop, onPinConv: noop,
  callHistory: CALL_HISTORY, onCallSelect: noop, onCallStart: noop,
  onLogout: noop, allMessages: INITIAL_MESSAGES, onSelect: noop,
};

const dm = CONVERSATIONS.find(c => c.id === 'dm_u2');
const group = CONVERSATIONS.find(c => c.id === 'grp_eng');

export const Default = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel {...baseChatProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} />
    </Stage>
  ),
};

export const DirectMessage = Default;

export const GroupChat = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="grp_eng" />
      <ChatPanel {...baseChatProps} conv={group} messages={INITIAL_MESSAGES.grp_eng} />
    </Stage>
  ),
};

export const EmptyState = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId={null} />
      <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <h3 className="empty-state-title">Welcome to CometChat</h3>
        <p className="empty-state-text">Select a conversation from the sidebar to start chatting</p>
      </div>
    </Stage>
  ),
};

export const WithThreadOpen = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel {...baseChatProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} />
      <ThreadPanel
        parentMsg={INITIAL_MESSAGES.dm_u2[1]}
        replies={THREAD_MESSAGES.m2}
        currentUser={CURRENT_USER}
        onClose={noop} onSend={noop} onReactThread={noop}
      />
    </Stage>
  ),
};

export const WithProfilePanel = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel {...baseChatProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} />
      <ProfilePanel user={USERS[0]} onClose={noop} onCall={noop} onBlock={noop} blockedUsers={new Set()} />
    </Stage>
  ),
};

export const WithGroupMembersPanel = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="grp_eng" />
      <ChatPanel {...baseChatProps} conv={group} messages={INITIAL_MESSAGES.grp_eng} />
      <GroupMembersPanel
        conv={{ ...group, ownerId: CURRENT_USER.id }}
        currentUser={CURRENT_USER}
        onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop}
      />
    </Stage>
  ),
};

export const BlockedDM = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel {...baseChatProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} blockedUsers={new Set(['u2'])} />
    </Stage>
  ),
};

export const DuringVideoCall = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel {...baseChatProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} />
      <CallOverlay
        call={{ type: 'video', user: USERS[0], incoming: false }}
        currentUser={CURRENT_USER} onAccept={noop} onEnd={noop}
      />
    </Stage>
  ),
};

export const IncomingCallRinging = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel {...baseChatProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} />
      <CallOverlay
        call={{ type: 'audio', user: USERS[0], incoming: true }}
        currentUser={CURRENT_USER} onAccept={noop} onEnd={noop}
      />
    </Stage>
  ),
};

export const CreateGroupModal = {
  tags: ['!autodocs'],
  parameters: { docs: { disable: true } },
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel {...baseChatProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} />
      <GroupModal allUsers={USERS} currentUser={CURRENT_USER} onClose={noop} onCreate={noop} />
    </Stage>
  ),
};

export const NewDirectMessageModal = {
  tags: ['!autodocs'],
  parameters: { docs: { disable: true } },
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId={null} />
      <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <h3 className="empty-state-title">Welcome to CometChat</h3>
        <p className="empty-state-text">Select a conversation from the sidebar to start chatting</p>
      </div>
      <NewDMModal allUsers={USERS} currentUser={CURRENT_USER} conversations={CONVERSATIONS} onClose={noop} onSelect={noop} />
    </Stage>
  ),
};

export const Interactive = {
  render: () => <InteractiveShell />,
  parameters: { docs: { description: { story: 'Pick conversations, send messages, react, edit, delete, vote on polls, and pin conversations live.' } } },
};

const InteractiveShell = () => {
  const [activeId, setActiveId] = useState('dm_u2');
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const activeConv = conversations.find(c => c.id === activeId);
  const activeMsgs = messages[activeId] || [];

  const handleSelect = (id) => {
    setActiveId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSend = (convId, text, file, poll, replyTo) => {
    const m = {
      id: 'm' + Date.now(), senderId: CURRENT_USER.id,
      text, file, poll,
      replyTo: replyTo ? { senderId: replyTo.senderId, id: replyTo.id, text: replyTo.text } : undefined,
      ts: Date.now(), reactions: [], readBy: [], threadCount: 0, edited: false, deleted: false,
    };
    setMessages(prev => ({ ...prev, [convId]: [...(prev[convId] || []), m] }));
  };

  return (
    <Stage>
      <Sidebar
        {...baseSidebarProps}
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onPinConv={(id) => setConversations(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c))}
      />
      {activeConv && (
        <ChatPanel
          {...baseChatProps}
          conv={activeConv}
          messages={activeMsgs}
          onSend={handleSend}
        />
      )}
    </Stage>
  );
};
