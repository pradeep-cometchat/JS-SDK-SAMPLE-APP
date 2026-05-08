import { Centered } from '../_helpers';
import { USERS } from '../../data';
import { Avatar } from '../../components/Avatar';

export default {
  title: 'Web/Misc/Typing Indicator',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Animated dot-dot-dot row shown below the last message when another user is typing. Shows either a single user\'s name or a count when multiple users are typing.',
      },
    },
  },
};

const Card = ({ children }) => (
  <Centered maxWidth={520} padding={24}>
    <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
      {children}
    </div>
  </Centered>
);

const Dots = () => (
  <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', padding: '6px 12px', background: 'var(--bubble-other)', borderRadius: 999 }}>
    {[0, 1, 2].map(i => (
      <span
        key={i}
        style={{
          width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)',
          opacity: 0.5, animation: 'typingDots 1.2s infinite',
          animationDelay: `${i * 0.15}s`, display: 'inline-block',
        }}
      />
    ))}
    <style>{`@keyframes typingDots{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-3px);opacity:1}}`}</style>
  </span>
);

const TypingRow = ({ names }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <Avatar user={USERS[0]} size={28} />
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
        {names.length === 1 ? `${names[0]} is typing…` :
          names.length === 2 ? `${names[0]} and ${names[1]} are typing…` :
            `${names.length} people are typing…`}
      </div>
      <Dots />
    </div>
  </div>
);

export const Default = {
  render: () => <Card><TypingRow names={['Jordan']} /></Card>,
};

export const SingleUserTyping = {
  render: () => <Card><TypingRow names={['Jordan']} /></Card>,
};

export const MultipleUsersTyping = {
  render: () => <Card><TypingRow names={['Jordan', 'Sam', 'Casey']} /></Card>,
};

export const AllVariantsShowcase = {
  render: () => (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TypingRow names={['Jordan']} />
        <TypingRow names={['Jordan', 'Sam']} />
        <TypingRow names={['Jordan', 'Sam', 'Casey']} />
      </div>
    </Card>
  ),
};
