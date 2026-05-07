import { useState } from 'react';
import { ThreadPanel, ThreadReplyBubble } from '../../components/Overlays';
import { CURRENT_USER, THREAD_MESSAGES, INITIAL_MESSAGES, Centered, noop } from '../_helpers';

export default {
  title: 'Web/Overlays/ThreadPanel',
  component: ThreadPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Side panel for threaded replies. Shows the parent message, a list of replies, and a composer.',
      },
    },
  },
};

const Frame = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 24, background: 'var(--bg)', width: '100%', boxSizing: 'border-box' }}>
    <div style={{ height: 720, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
      {children}
    </div>
  </div>
);

const parent = INITIAL_MESSAGES.dm_u2[1];

export const WithReplies = {
  render: () => (
    <Frame>
      <ThreadPanel parentMsg={parent} replies={THREAD_MESSAGES.m2} currentUser={CURRENT_USER} onClose={noop} onSend={noop} onReactThread={noop} />
    </Frame>
  ),
};

export const EmptyThread = {
  render: () => (
    <Frame>
      <ThreadPanel parentMsg={parent} replies={[]} currentUser={CURRENT_USER} onClose={noop} onSend={noop} onReactThread={noop} />
    </Frame>
  ),
};

export const Interactive = {
  render: () => {
    const [replies, setReplies] = useState(THREAD_MESSAGES.m2);
    return (
      <Frame>
        <ThreadPanel
          parentMsg={parent}
          replies={replies}
          currentUser={CURRENT_USER}
          onClose={noop}
          onSend={(_pid, text) => setReplies(prev => [...prev, { id: 't' + Date.now(), senderId: CURRENT_USER.id, text, ts: Date.now(), reactions: [] }])}
          onReactThread={(replyId, emoji) => setReplies(prev => prev.map(r => {
            if (r.id !== replyId) return r;
            const reactions = [...(r.reactions || [])];
            const idx = reactions.findIndex(rx => rx.emoji === emoji);
            if (idx === -1) reactions.push({ emoji, userIds: [CURRENT_USER.id] });
            else {
              const rx = { ...reactions[idx] };
              rx.userIds = rx.userIds.includes(CURRENT_USER.id)
                ? rx.userIds.filter(u => u !== CURRENT_USER.id)
                : [...rx.userIds, CURRENT_USER.id];
              if (rx.userIds.length === 0) reactions.splice(idx, 1); else reactions[idx] = rx;
            }
            return { ...r, reactions };
          }))}
        />
      </Frame>
    );
  },
};

export const ThreadReplyBubbleStory = {
  name: 'ThreadReplyBubble',
  render: () => (
    <Centered maxWidth={480}>
      <div style={{ background: 'var(--surface)', padding: 20, border: '1px solid var(--border)', borderRadius: 12 }}>
        <ThreadReplyBubble r={{ id: 'r1', senderId: 'u2', text: 'Specifically the presence hook is great.', ts: Date.now() - 300000, reactions: [{ emoji: '👍', userIds: ['u1'] }] }} currentUser={CURRENT_USER} onReact={noop} />
        <ThreadReplyBubble r={{ id: 'r2', senderId: 'u1', text: 'Agreed. Way cleaner than polling.', ts: Date.now() - 120000, reactions: [] }} currentUser={CURRENT_USER} onReact={noop} />
      </div>
    </Centered>
  ),
};
