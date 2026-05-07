import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { ChatPanel } from '../../components/ChatPanel';
import {
  CallOverlay, ThreadPanel, ProfilePanel, GroupMembersPanel,
  GroupModal, NewDMModal,
} from '../../components/Overlays';
import {
  CURRENT_USER, USERS, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES,
  THREAD_MESSAGES, CALL_HISTORY, Centered, noop,
} from '../_helpers';

export default {
  title: 'Web/Screens/AppShell',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full desktop app shell — sidebar + chat panel, with optional right-side panels (Thread, Profile, Group members) and overlays (Call, Group creation, New DM). Each story demonstrates a key end-to-end state.',
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
  currentUser: CURRENT_USER,
  allUsers: ALL_USERS,
  onSend: noop, onReact: noop, onDelete: noop, onEdit: noop, onVote: noop,
  onThreadOpen: noop, onCallStart: noop, onViewProfile: noop, onViewMembers: noop,
  typingUsers: [], density: 'comfortable', blockedUsers: new Set(), isMobile: false,
  onBack: noop, onMarkUnread: noop,
};

const baseSidebarProps = {
  conversations: CONVERSATIONS,
  currentUser: CURRENT_USER,
  onNewGroup: noop, onNewDM: noop, onDeleteConv: noop, onPinConv: noop,
  callHistory: CALL_HISTORY, onCallSelect: noop, onCallStart: noop,
  onLogout: noop, allMessages: INITIAL_MESSAGES, onSelect: noop,
};

/* ─── DM conversation ─────────────────────────────────── */
export const DirectMessage = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel
        {...baseChatProps}
        conv={CONVERSATIONS.find(c => c.id === 'dm_u2')}
        messages={INITIAL_MESSAGES.dm_u2}
      />
    </Stage>
  ),
  parameters: { docs: { description: { story: 'Standard DM view — sidebar on the left, one-on-one conversation on the right.' } } },
};

/* ─── Group conversation ──────────────────────────────── */
export const GroupChat = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="grp_eng" />
      <ChatPanel
        {...baseChatProps}
        conv={CONVERSATIONS.find(c => c.id === 'grp_eng')}
        messages={INITIAL_MESSAGES.grp_eng}
      />
    </Stage>
  ),
  parameters: { docs: { description: { story: 'Group conversation with sender names and avatars above each new sender\'s first message.' } } },
};

/* ─── Empty state ─────────────────────────────────────── */
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
  parameters: { docs: { description: { story: 'No conversation selected. What the user sees on first sign-in.' } } },
};

/* ─── With thread open ────────────────────────────────── */
export const WithThreadOpen = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel
        {...baseChatProps}
        conv={CONVERSATIONS.find(c => c.id === 'dm_u2')}
        messages={INITIAL_MESSAGES.dm_u2}
      />
      <ThreadPanel
        parentMsg={INITIAL_MESSAGES.dm_u2[1]}
        replies={THREAD_MESSAGES.m2}
        currentUser={CURRENT_USER}
        onClose={noop}
        onSend={noop}
        onReactThread={noop}
      />
    </Stage>
  ),
  parameters: { docs: { description: { story: 'Thread panel opens to the right of the chat. Sidebar stays put on the left.' } } },
};

/* ─── With profile panel ──────────────────────────────── */
export const WithProfilePanel = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel
        {...baseChatProps}
        conv={CONVERSATIONS.find(c => c.id === 'dm_u2')}
        messages={INITIAL_MESSAGES.dm_u2}
      />
      <ProfilePanel user={USERS[0]} onClose={noop} onCall={noop} onBlock={noop} blockedUsers={new Set()} />
    </Stage>
  ),
};

/* ─── With group members panel ────────────────────────── */
export const WithGroupMembersPanel = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="grp_eng" />
      <ChatPanel
        {...baseChatProps}
        conv={CONVERSATIONS.find(c => c.id === 'grp_eng')}
        messages={INITIAL_MESSAGES.grp_eng}
      />
      <GroupMembersPanel
        conv={{ ...CONVERSATIONS.find(c => c.id === 'grp_eng'), ownerId: CURRENT_USER.id }}
        currentUser={CURRENT_USER}
        onClose={noop}
        onViewProfile={noop}
        onLeave={noop}
        onDelete={noop}
        onAddMember={noop}
      />
    </Stage>
  ),
};

/* ─── Blocked DM ──────────────────────────────────────── */
export const BlockedDM = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel
        {...baseChatProps}
        conv={CONVERSATIONS.find(c => c.id === 'dm_u2')}
        messages={INITIAL_MESSAGES.dm_u2}
        blockedUsers={new Set(['u2'])}
      />
    </Stage>
  ),
  parameters: { docs: { description: { story: 'DM where the user has blocked the other party. Composer is replaced with a "Blocked" banner.' } } },
};

/* ─── During a call ───────────────────────────────────── */
export const DuringVideoCall = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel
        {...baseChatProps}
        conv={CONVERSATIONS.find(c => c.id === 'dm_u2')}
        messages={INITIAL_MESSAGES.dm_u2}
      />
      <CallOverlay
        call={{ type: 'video', user: USERS[0], incoming: false }}
        currentUser={CURRENT_USER}
        onAccept={noop}
        onEnd={noop}
      />
    </Stage>
  ),
  parameters: { docs: { description: { story: 'Outgoing video call overlay on top of the chat view.' } } },
};

export const IncomingCallRinging = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel
        {...baseChatProps}
        conv={CONVERSATIONS.find(c => c.id === 'dm_u2')}
        messages={INITIAL_MESSAGES.dm_u2}
      />
      <CallOverlay
        call={{ type: 'audio', user: USERS[0], incoming: true }}
        currentUser={CURRENT_USER}
        onAccept={noop}
        onEnd={noop}
      />
    </Stage>
  ),
  parameters: { docs: { description: { story: 'Incoming audio call with Accept / Decline buttons.' } } },
};

/* ─── Modals over the app shell ───────────────────────── */
export const CreateGroupModal = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId="dm_u2" />
      <ChatPanel
        {...baseChatProps}
        conv={CONVERSATIONS.find(c => c.id === 'dm_u2')}
        messages={INITIAL_MESSAGES.dm_u2}
      />
      <GroupModal allUsers={USERS} currentUser={CURRENT_USER} onClose={noop} onCreate={noop} />
    </Stage>
  ),
};

export const NewDirectMessageModal = {
  render: () => (
    <Stage>
      <Sidebar {...baseSidebarProps} activeId={null} />
      <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <h3 className="empty-state-title">Welcome to CometChat</h3>
        <p className="empty-state-text">Select a conversation from the sidebar to start chatting</p>
      </div>
      <NewDMModal
        allUsers={USERS}
        currentUser={CURRENT_USER}
        conversations={CONVERSATIONS}
        onClose={noop}
        onSelect={noop}
      />
    </Stage>
  ),
};

/* ─── Fully interactive ───────────────────────────────── */
export const Interactive = {
  render: () => <InteractiveShell />,
  parameters: { docs: { description: { story: 'Fully wired shell — pick conversations, send messages, react, edit, delete, create polls, and manage pins live.' } } },
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

  const handleReact = (msgId, emoji) => {
    setMessages(prev => {
      const list = [...(prev[activeId] || [])];
      const idx = list.findIndex(m => m.id === msgId);
      if (idx === -1) return prev;
      const msg = { ...list[idx], reactions: [...(list[idx].reactions || [])] };
      const ri = msg.reactions.findIndex(r => r.emoji === emoji);
      if (ri === -1) msg.reactions.push({ emoji, userIds: [CURRENT_USER.id] });
      else {
        const r = { ...msg.reactions[ri] };
        r.userIds = r.userIds.includes(CURRENT_USER.id)
          ? r.userIds.filter(u => u !== CURRENT_USER.id)
          : [...r.userIds, CURRENT_USER.id];
        if (r.userIds.length === 0) msg.reactions.splice(ri, 1);
        else msg.reactions[ri] = r;
      }
      list[idx] = msg;
      return { ...prev, [activeId]: list };
    });
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
          onReact={handleReact}
          onDelete={(id) => setMessages(prev => ({ ...prev, [activeId]: prev[activeId].map(m => m.id === id ? { ...m, deleted: true } : m) }))}
          onEdit={(id, text) => setMessages(prev => ({ ...prev, [activeId]: prev[activeId].map(m => m.id === id ? { ...m, text, edited: true } : m) }))}
        />
      )}
    </Stage>
  );
};
