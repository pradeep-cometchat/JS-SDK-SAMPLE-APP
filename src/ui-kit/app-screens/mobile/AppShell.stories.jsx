import { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { ChatPanel } from '../../../components/ChatPanel';
import {
  CallOverlay, ThreadPanel, ProfilePanel, GroupMembersPanel,
  GroupModal, NewDMModal,
} from '../../../components/Overlays';
import {
  CURRENT_USER, USERS, ALL_USERS, CONVERSATIONS, INITIAL_MESSAGES,
  THREAD_MESSAGES, CALL_HISTORY, MobileFrame, noop,
} from '../../_helpers';

export default {
  title: 'App Screens/Mobile/App Shell',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full mobile app inside a phone-sized viewport. Sidebar and chat panel stack — tapping a conversation swaps the view. Thread, Profile, and call overlays take over the full screen.',
      },
    },
  },
};

const baseSidebarProps = {
  conversations: CONVERSATIONS, currentUser: CURRENT_USER,
  onNewGroup: noop, onNewDM: noop, onDeleteConv: noop, onPinConv: noop,
  callHistory: CALL_HISTORY, onCallSelect: noop, onCallStart: noop,
  onLogout: noop, allMessages: INITIAL_MESSAGES, onSelect: noop,
};

const baseChatProps = {
  currentUser: CURRENT_USER, allUsers: ALL_USERS,
  onSend: noop, onReact: noop, onDelete: noop, onEdit: noop, onVote: noop,
  onThreadOpen: noop, onCallStart: noop, onViewProfile: noop, onViewMembers: noop,
  typingUsers: [], density: 'comfortable', blockedUsers: new Set(),
  isMobile: true, onBack: noop, onMarkUnread: noop,
};

const dm = CONVERSATIONS.find(c => c.id === 'dm_u2');
const group = CONVERSATIONS.find(c => c.id === 'grp_eng');

export const Default = {
  render: () => (
    <MobileFrame>
      <Sidebar {...baseSidebarProps} activeId={null} />
    </MobileFrame>
  ),
};

export const ConversationList = Default;

export const DirectMessage = {
  render: () => (
    <MobileFrame>
      <ChatPanel {...baseChatProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} />
    </MobileFrame>
  ),
};

export const GroupChat = {
  render: () => (
    <MobileFrame>
      <ChatPanel {...baseChatProps} conv={group} messages={INITIAL_MESSAGES.grp_eng} />
    </MobileFrame>
  ),
};

export const BlockedDM = {
  render: () => (
    <MobileFrame>
      <ChatPanel {...baseChatProps} conv={dm} messages={INITIAL_MESSAGES.dm_u2} blockedUsers={new Set(['u2'])} />
    </MobileFrame>
  ),
};

export const ThreadView = {
  render: () => (
    <MobileFrame>
      <ThreadPanel parentMsg={INITIAL_MESSAGES.dm_u2[1]} replies={THREAD_MESSAGES.m2} currentUser={CURRENT_USER} onClose={noop} onSend={noop} onReactThread={noop} />
    </MobileFrame>
  ),
};

export const ProfileView = {
  render: () => (
    <MobileFrame>
      <ProfilePanel user={USERS[0]} onClose={noop} onCall={noop} onBlock={noop} blockedUsers={new Set()} />
    </MobileFrame>
  ),
};

export const GroupMembersView = {
  render: () => (
    <MobileFrame>
      <GroupMembersPanel conv={{ ...group, ownerId: CURRENT_USER.id }} currentUser={CURRENT_USER} onClose={noop} onViewProfile={noop} onLeave={noop} onDelete={noop} onAddMember={noop} />
    </MobileFrame>
  ),
};

export const IncomingAudioCall = {
  render: () => (
    <MobileFrame>
      <CallOverlay call={{ type: 'audio', user: USERS[0], incoming: true }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} />
    </MobileFrame>
  ),
};

export const OutgoingVideoCall = {
  render: () => (
    <MobileFrame>
      <CallOverlay call={{ type: 'video', user: USERS[0], incoming: false }} currentUser={CURRENT_USER} onAccept={noop} onEnd={noop} />
    </MobileFrame>
  ),
};

export const CreateGroupModal = {
  tags: ['!autodocs'],
  parameters: { docs: { disable: true } },
  render: () => (
    <MobileFrame>
      <GroupModal allUsers={USERS} currentUser={CURRENT_USER} onClose={noop} onCreate={noop} />
    </MobileFrame>
  ),
};

export const NewDirectMessageModal = {
  tags: ['!autodocs'],
  parameters: { docs: { disable: true } },
  render: () => (
    <MobileFrame>
      <NewDMModal allUsers={USERS} currentUser={CURRENT_USER} conversations={CONVERSATIONS} onClose={noop} onSelect={noop} />
    </MobileFrame>
  ),
};

export const Interactive = {
  render: () => <InteractiveMobile />,
  parameters: { docs: { description: { story: 'Tap a conversation to push the chat view. Tap the back arrow in the chat header to pop back.' } } },
};

const InteractiveMobile = () => {
  const [activeId, setActiveId] = useState(null);
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const activeConv = conversations.find(c => c.id === activeId);
  const activeMsgs = messages[activeId] || [];

  const handleSelect = (id) => {
    setActiveId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSend = (convId, text) => {
    const m = {
      id: 'm' + Date.now(), senderId: CURRENT_USER.id, text,
      ts: Date.now(), reactions: [], readBy: [], threadCount: 0, edited: false, deleted: false,
    };
    setMessages(prev => ({ ...prev, [convId]: [...(prev[convId] || []), m] }));
  };

  return (
    <MobileFrame>
      {activeId == null ? (
        <Sidebar
          {...baseSidebarProps}
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onPinConv={(id) => setConversations(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c))}
        />
      ) : (
        <ChatPanel
          {...baseChatProps}
          conv={activeConv}
          messages={activeMsgs}
          onSend={handleSend}
          onBack={() => setActiveId(null)}
        />
      )}
    </MobileFrame>
  );
};
