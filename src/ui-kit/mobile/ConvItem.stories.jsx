import { ConvItem } from '../../components/Sidebar';
import { CONVERSATIONS, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Sidebar/ConvItem',
  component: ConvItem,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Single conversation row in a mobile viewport. Long-press opens the actions bottom sheet.' } },
  },
};

export const MixedList = {
  render: () => (
    <MobileFrame>
      <div className="sidebar" style={{ width: '100%', height: '100%', padding: 8 }}>
        {CONVERSATIONS.map(c => (
          <ConvItem key={c.id} conv={c} active={c.id === 'grp_eng'} onSelect={noop} onDelete={noop} onPin={noop} />
        ))}
      </div>
    </MobileFrame>
  ),
};

export const SingleDM = {
  render: () => (
    <MobileFrame>
      <div className="sidebar" style={{ width: '100%', height: '100%', padding: 8 }}>
        <ConvItem conv={CONVERSATIONS[0]} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
      </div>
    </MobileFrame>
  ),
};
