import { ConvItem } from '../../components/Sidebar';
import { CONVERSATIONS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Conversations/Conversation Item',
  component: ConvItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Single conversation row on mobile. Long-press opens the action bottom sheet.',
      },
    },
  },
};

const Wrap = ({ children }) => (
  <MobileFrame>
    <div className="sidebar" style={{ width: '100%', height: '100%', padding: 8 }}>
      {children}
    </div>
  </MobileFrame>
);

export const Default = {
  render: () => <Wrap><ConvItem conv={CONVERSATIONS[0]} active={false} onSelect={noop} onDelete={noop} onPin={noop} /></Wrap>,
};

export const MixedList = {
  render: () => (
    <Wrap>
      {CONVERSATIONS.map(c => (
        <ConvItem key={c.id} conv={c} active={c.id === 'grp_eng'} onSelect={noop} onDelete={noop} onPin={noop} />
      ))}
    </Wrap>
  ),
};

export const AllVariantsShowcase = MixedList;
