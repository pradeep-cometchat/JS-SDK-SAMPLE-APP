import { CallHistoryList } from '../../components/Sidebar';
import { CALL_HISTORY, DesktopSidebarSlice, noop } from '../_helpers';

export default {
  title: 'Web/Calls/Call Logs',
  component: CallHistoryList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Call history list shown when the sidebar's Calls tab is active. Each row expands into a detail card with type, direction, status, duration, time, and quick Call-back / Video actions.",
      },
    },
  },
};

const AutoClickFirst = () => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const row = document.querySelector('.call-hist-item');
      if (row && !row.classList.contains('selected')) row.click();
    }, 30);
  }
  return null;
};

export const Default = {
  render: () => (
    <DesktopSidebarSlice>
      <CallHistoryList callHistory={CALL_HISTORY} onCallSelect={noop} onCallStart={noop} />
    </DesktopSidebarSlice>
  ),
};

export const WithCallHistory = Default;

export const ExpandedRow = {
  render: () => (
    <DesktopSidebarSlice>
      <CallHistoryList callHistory={CALL_HISTORY} onCallSelect={noop} onCallStart={noop} />
      <AutoClickFirst />
    </DesktopSidebarSlice>
  ),
};

export const OnlyMissed = {
  render: () => (
    <DesktopSidebarSlice>
      <CallHistoryList callHistory={CALL_HISTORY.filter(c => c.status === 'missed')} onCallSelect={noop} onCallStart={noop} />
    </DesktopSidebarSlice>
  ),
};

export const EmptyLogs = {
  render: () => (
    <DesktopSidebarSlice>
      <CallHistoryList callHistory={[]} onCallSelect={noop} onCallStart={noop} />
    </DesktopSidebarSlice>
  ),
};

export const AllVariantsShowcase = Default;
