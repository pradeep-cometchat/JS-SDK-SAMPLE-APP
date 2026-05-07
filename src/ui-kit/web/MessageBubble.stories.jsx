import { useState } from 'react';
import { MessageBubble, PollVotesModal } from '../../components/MessageBubble';
import { CURRENT_USER, ALL_USERS, makeMsg, noop, Centered } from '../_helpers';

/** Small surface that mimics the real chat list background */
const BubbleBoard = ({ children, maxWidth = 720 }) => (
  <Centered maxWidth={maxWidth}>
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
      <div className="msg-list" style={{ overflow: 'visible', padding: 0 }}>{children}</div>
    </div>
  </Centered>
);

const baseProps = {
  allUsers: ALL_USERS,
  currentUser: CURRENT_USER,
  onReact: noop, onDelete: noop, onEditRequest: noop, onThreadOpen: noop,
  onReply: noop, onVote: noop, onMarkUnread: noop, onPin: noop,
  pinnedMsgIds: [], density: 'comfortable', isGroup: false,
};

export default {
  title: 'Web/Messages/MessageBubble',
  component: MessageBubble,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One message bubble. Supports text, rich HTML, file/image/video/audio, polls, reply previews, reactions, read receipts, pin, edit/delete, thread indicator, whiteboard/collab-doc cards, and call result cards. Hover on desktop for the action toolbar.',
      },
    },
  },
};

export const IncomingText = {
  render: () => <BubbleBoard><MessageBubble {...baseProps} msg={makeMsg({ text: 'Hey! Quick question about the new design.' })} isOwn={false} /></BubbleBoard>,
};

export const OutgoingText = {
  render: () => <BubbleBoard><MessageBubble {...baseProps} msg={makeMsg({ senderId: 'u1', text: "Sure, what's up?", readBy: ['u2'] })} isOwn /></BubbleBoard>,
};

export const UnreadOutgoing = {
  render: () => <BubbleBoard><MessageBubble {...baseProps} msg={makeMsg({ senderId: 'u1', text: 'Still waiting on the mockups…', readBy: [] })} isOwn /></BubbleBoard>,
};

export const RichText = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          senderId: 'u1', readBy: ['u2'],
          text: '<b>Important:</b> <i>Please review</i> the <u>migration doc</u> before Friday.<br><ul><li>Auth flow</li><li>Webhooks</li><li>Presence API</li></ul>',
        })}
        isOwn
      />
    </BubbleBoard>
  ),
};

export const LongTextReadMore = {
  render: () => <BubbleBoard><MessageBubble {...baseProps} msg={makeMsg({ text: 'This is a pretty long message that should trigger the Read more collapse. '.repeat(8) })} isOwn={false} /></BubbleBoard>,
};

export const GroupFirstMessage = {
  render: () => (
    <BubbleBoard>
      <MessageBubble {...baseProps} isGroup msg={makeMsg({ senderId: 'u4', text: 'Team — sprint review Friday 3pm. Please update your tickets.' })} isOwn={false} />
    </BubbleBoard>
  ),
};

export const WithReactions = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          text: 'Nailed it — shipping today 🚀',
          reactions: [
            { emoji: '🚀', userIds: ['u1', 'u2', 'u4'] },
            { emoji: '🎉', userIds: ['u5'] },
            { emoji: '👍', userIds: ['u1'] },
          ],
        })}
        isOwn={false}
      />
    </BubbleBoard>
  ),
};

export const ReplyingToSomeone = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          senderId: 'u1',
          text: "Sounds good, let's pair on it tomorrow.",
          readBy: ['u2'],
          replyTo: { senderId: 'u2', id: 'prev', text: 'Can you review the auth flow before EOD?' },
        })}
        isOwn
      />
    </BubbleBoard>
  ),
};

export const ImageAttachment = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          text: "Here's the hero shot",
          file: { name: 'hero.png', size: '2.4 MB', type: 'image', previewUrl: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=600' },
        })}
        isOwn={false}
      />
    </BubbleBoard>
  ),
};

export const VideoAttachment = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({ senderId: 'u1', readBy: ['u2'], file: { name: 'demo.mp4', size: '8.1 MB', type: 'video', previewUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' } })}
        isOwn
      />
    </BubbleBoard>
  ),
};

export const DocumentAttachment = {
  render: () => (
    <BubbleBoard>
      <MessageBubble {...baseProps} msg={makeMsg({ text: 'Migration plan attached', file: { name: 'cometchat-migration.md', size: '8.2 KB', type: 'doc' } })} isOwn={false} />
    </BubbleBoard>
  ),
};

export const CollabWhiteboard = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          senderId: 'u1', readBy: ['u2'],
          file: { name: 'Collaborative Whiteboard', size: '', type: 'whiteboard', previewUrl: '/whiteboard preview.png', linkUrl: 'https://example.com/whiteboard' },
        })}
        isOwn
      />
    </BubbleBoard>
  ),
};

export const CollabDocument = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({ file: { name: 'Collaborative Document', size: '', type: 'collab-doc', previewUrl: '/doc preview.png', linkUrl: 'https://example.com/doc' } })}
        isOwn={false}
      />
    </BubbleBoard>
  ),
};

export const CallInBubble = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        isGroup
        msg={makeMsg({ senderId: 'u1', readBy: ['u2'], file: { type: 'group-call', callType: 'video', callTs: Date.now() - 60000 } })}
        isOwn
      />
    </BubbleBoard>
  ),
};

export const WithThreadReplies = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        isGroup
        msg={makeMsg({ senderId: 'u4', text: "Let's move the discussion to a thread — keeping channel clean.", threadCount: 3 })}
        isOwn={false}
      />
    </BubbleBoard>
  ),
};

export const PollBubble = {
  render: () => {
    const [poll, setPoll] = useState({
      question: 'Where should we get lunch?',
      options: [
        { text: 'Sushi', votes: ['u2', 'u3'] },
        { text: 'Pizza', votes: ['u4'] },
        { text: 'Tacos', votes: [] },
      ],
    });
    const handleVote = (_id, idx) => {
      setPoll(p => ({
        ...p,
        options: p.options.map((o, i) => {
          if (i !== idx) return { ...o, votes: o.votes.filter(v => v !== CURRENT_USER.id) };
          return { ...o, votes: o.votes.includes(CURRENT_USER.id) ? o.votes.filter(v => v !== CURRENT_USER.id) : [...o.votes, CURRENT_USER.id] };
        }),
      }));
    };
    return <BubbleBoard><MessageBubble {...baseProps} msg={makeMsg({ poll, text: undefined })} isOwn={false} onVote={handleVote} /></BubbleBoard>;
  },
};

export const PollVotesModalStory = {
  name: 'PollVotesModal',
  render: () => (
    <BubbleBoard>
      <PollVotesModal
        poll={{
          question: 'Lunch pick',
          options: [
            { text: 'Sushi', votes: ['u2', 'u3'] },
            { text: 'Pizza', votes: ['u4', 'u1'] },
            { text: 'Tacos', votes: [] },
          ],
        }}
        onClose={noop}
      />
    </BubbleBoard>
  ),
};

// A tiny silent WAV data URL so VoiceNotePlayer renders its waveform & play button.
// The audio element is display:none anyway, so the exact content doesn't matter.
const SILENT_WAV = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==';

export const VoiceNoteIncoming = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          senderId: 'u2',
          text: undefined,
          file: { type: 'audio', previewUrl: SILENT_WAV, duration: 23, name: 'Voice note (00:00:23)', size: '184 KB' },
        })}
        isOwn={false}
      />
    </BubbleBoard>
  ),
  parameters: { docs: { description: { story: 'Voice note received from another user. Rendered inside a real `.msg-bubble` so the play button (filled circle) and accent-colored waveform show correctly — exactly like the app.' } } },
};

export const VoiceNoteOutgoing = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          senderId: 'u1',
          readBy: ['u2'],
          text: undefined,
          file: { type: 'audio', previewUrl: SILENT_WAV, duration: 47, name: 'Voice note (00:00:47)', size: '312 KB' },
        })}
        isOwn
      />
    </BubbleBoard>
  ),
  parameters: { docs: { description: { story: 'Voice note you sent. The bubble uses the accent color, the play button turns white-on-tinted, and the waveform bars adapt to the own-bubble style.' } } },
};

export const VoiceNoteBothSides = {
  render: () => (
    <BubbleBoard>
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          id: 'v1', senderId: 'u2',
          file: { type: 'audio', previewUrl: SILENT_WAV, duration: 18, name: 'Voice note (00:00:18)', size: '140 KB' },
        })}
        isOwn={false}
      />
      <MessageBubble
        {...baseProps}
        msg={makeMsg({
          id: 'v2', senderId: 'u1', readBy: ['u2'],
          file: { type: 'audio', previewUrl: SILENT_WAV, duration: 62, name: 'Voice note (00:01:02)', size: '420 KB' },
        })}
        isOwn
      />
    </BubbleBoard>
  ),
  parameters: { docs: { description: { story: 'Incoming and outgoing voice notes stacked so you can compare the play-button and waveform styles side-by-side.' } } },
};

export const DeletedByYou = {
  render: () => <BubbleBoard><MessageBubble {...baseProps} msg={makeMsg({ senderId: 'u1', text: 'oops', deleted: true })} isOwn /></BubbleBoard>,
};

export const EditedMessage = {
  render: () => <BubbleBoard><MessageBubble {...baseProps} msg={makeMsg({ senderId: 'u1', text: 'Meet at 4pm instead of 3pm.', edited: true, readBy: ['u2'] })} isOwn /></BubbleBoard>,
};

export const GroupConversationPreview = {
  render: () => {
    const msgs = [
      makeMsg({ id: '1', senderId: 'u4', text: 'Sprint review Friday 3pm — please update your tickets.', reactions: [{ emoji: '👍', userIds: ['u1', 'u5'] }] }),
      makeMsg({ id: '2', senderId: 'u7', text: 'Kubernetes upgrade is done. All pods healthy 🚀', reactions: [{ emoji: '🚀', userIds: ['u1'] }] }),
      makeMsg({ id: '3', senderId: 'u5', text: 'Anyone else seeing flaky CI tests?', threadCount: 4 }),
      makeMsg({ id: '4', senderId: 'u1', readBy: ['u4'], text: 'I opened a PR — review please!' }),
    ];
    return (
      <BubbleBoard maxWidth={820}>
        {msgs.map((m, i) => (
          <MessageBubble key={m.id} {...baseProps} isGroup msg={m} prevMsg={msgs[i - 1]} isOwn={m.senderId === 'u1'} />
        ))}
      </BubbleBoard>
    );
  },
};
