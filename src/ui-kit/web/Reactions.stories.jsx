import { MessageBubble } from '../../components/MessageBubble';
import { CURRENT_USER, ALL_USERS, makeMsg, Centered, noop } from '../_helpers';

export default {
  title: 'Web/Misc/Reactions',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Reaction chips that appear below a message bubble. Tap to toggle your own reaction, or hover a bubble to open the quick-reaction toolbar.',
      },
    },
  },
};

const baseProps = {
  allUsers: ALL_USERS, currentUser: CURRENT_USER,
  onReact: noop, onDelete: noop, onEditRequest: noop, onThreadOpen: noop,
  onReply: noop, onVote: noop, onMarkUnread: noop, onPin: noop,
  pinnedMsgIds: [], density: 'comfortable', isGroup: false,
};

const BubbleBoard = ({ children, maxWidth = 720 }) => (
  <Centered maxWidth={maxWidth}>
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
      <div className="msg-list" style={{ overflow: 'visible', padding: 0 }}>{children}</div>
    </div>
  </Centered>
);

export const Default = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          text: 'Shipping today!',
          reactions: [
            { emoji: '🚀', userIds: ['u1', 'u2', 'u4'] },
            { emoji: '👍', userIds: ['u1'] },
          ],
        })}
        isOwn={false}
      />
    </BubbleBoard>
  ),
};

export const MessageWithReactions = Default;

export const ManyReactions = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          text: 'Wow, this got a lot of reactions',
          reactions: [
            { emoji: '🚀', userIds: ['u1', 'u2', 'u4', 'u5', 'u6'] },
            { emoji: '🎉', userIds: ['u1', 'u2', 'u3'] },
            { emoji: '❤️', userIds: ['u1', 'u4'] },
            { emoji: '😂', userIds: ['u2'] },
            { emoji: '👏', userIds: ['u3', 'u5'] },
            { emoji: '💯', userIds: ['u1'] },
          ],
        })}
        isOwn={false}
      />
    </BubbleBoard>
  ),
};

export const ReactedByMe = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          text: 'I reacted with 👍',
          reactions: [{ emoji: '👍', userIds: ['u1', 'u2'] }],
        })}
        isOwn={false}
      />
    </BubbleBoard>
  ),
  parameters: { docs: { description: { story: "Current user's reactions are highlighted in accent color." } } },
};

export const NoReactions = {
  render: () => (
    <BubbleBoard>
      <MessageBubble {...baseProps} msg={makeMsg({ text: 'No reactions yet', reactions: [] })} isOwn={false} />
    </BubbleBoard>
  ),
};

export const AllVariantsShowcase = Default;
