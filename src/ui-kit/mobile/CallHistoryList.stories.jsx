import { CallHistoryList } from '../../components/Sidebar';
import { CALL_HISTORY, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Sidebar/CallHistoryList',
  component: CallHistoryList,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Call history inside the mobile viewport. Tap to expand the detail card.' } },
  },
};

export const Collapsed = {
  render: () => (
    <MobileFrame>
      <div className="sidebar" style={{ width: '100%', height: '100%', padding: 8 }}>
        <CallHistoryList callHistory={CALL_HISTORY} onCallSelect={noop} onCallStart={noop} />
      </div>
    </MobileFrame>
  ),
};

export const FirstRowExpanded = {
  render: () => (
    <MobileFrame>
      <div className="sidebar" style={{ width: '100%', height: '100%', padding: 8 }}>
        <CallHistoryList callHistory={CALL_HISTORY} onCallSelect={noop} onCallStart={noop} />
        <AutoClickFirst />
      </div>
    </MobileFrame>
  ),
};

const AutoClickFirst = () => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const doc = document.querySelector('iframe[title="mobile-preview"]')?.contentDocument;
      const row = doc?.querySelector('.call-hist-item');
      if (row) row.click();
    }, 150);
  }
  return null;
};
