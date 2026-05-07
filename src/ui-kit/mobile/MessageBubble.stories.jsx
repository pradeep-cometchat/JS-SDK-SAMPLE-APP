import { MessageBubble } from '../../components/MessageBubble';
import { CURRENT_USER, ALL_USERS, makeMsg, MobileFrame, noop } from '../_helpers';

const baseProps = {
  allUsers: ALL_USERS, currentUser: CURRENT_USER,
  onReact: noop, onDelete: noop, onEditRequest: noop, onThreadOpen: noop,
  onReply: noop, onVote: noop, onMarkUnread: noop, onPin: noop,
  pinnedMsgIds: [], density: 'comfortable', isGroup: false,
};

const Stage = ({ children }) => (
  <MobileFrame>
    <div style={{ padding: 12, background: 'var(--surface)', height: '100%' }}>
      <div className="msg-list" style={{ overflow: 'visible', padding: 0 }}>{children}</div>
    </div>
  </MobileFrame>
);

export default {
  title: 'Mobile/Bubbles/Message Bubble',
  component: MessageBubble,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Message bubbles on mobile. Long-press opens the action bottom sheet (React, Reply, Copy, Pin, etc.).',
      },
    },
  },
};

export const Default = {
  render: () => {
    const msgs = [
      makeMsg({ id: '1', senderId: 'u4', text: 'Sprint review Friday 3pm — please update your tickets.', reactions: [{ emoji: '👍', userIds: ['u1', 'u5'] }] }),
      makeMsg({ id: '2', senderId: 'u7', text: 'Kubernetes upgrade is done 🚀' }),
      makeMsg({ id: '3', senderId: 'u5', text: 'Anyone else seeing flaky CI tests?', threadCount: 4 }),
      makeMsg({ id: '4', senderId: 'u1', readBy: ['u4'], text: 'I opened a PR — review please!' }),
    ];
    return (
      <Stage>
        {msgs.map((m, i) => (
          <MessageBubble key={m.id} {...baseProps} isGroup msg={m} prevMsg={msgs[i - 1]} isOwn={m.senderId === 'u1'} />
        ))}
      </Stage>
    );
  },
};

export const ConversationPreview = Default;

export const Image = {
  render: () => (
    <Stage>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({ text: "Here's the hero shot", file: { name: 'hero.png', size: '2.4 MB', type: 'image', previewUrl: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=400' } })}
        isOwn={false}
      />
    </Stage>
  ),
};

export const WithReactions = {
  render: () => (
    <Stage>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          text: 'Nailed it — shipping today 🚀',
          reactions: [{ emoji: '🚀', userIds: ['u1', 'u2'] }, { emoji: '🎉', userIds: ['u5'] }],
        })}
        isOwn={false}
      />
    </Stage>
  ),
};

export const Poll = {
  render: () => (
    <Stage>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          poll: {
            question: 'Lunch pick?',
            options: [
              { text: 'Sushi', votes: ['u2', 'u3'] },
              { text: 'Pizza', votes: ['u4'] },
              { text: 'Tacos', votes: [] },
            ],
          },
        })}
        isOwn={false}
      />
    </Stage>
  ),
};

export const AllVariantsShowcase = Default;
