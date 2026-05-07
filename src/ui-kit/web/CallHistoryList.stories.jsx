import { CallHistoryList } from '../../components/Sidebar';
import { CALL_HISTORY, DesktopSidebarSlice, noop } from '../_helpers';

export default {
  title: 'Web/Sidebar/CallHistoryList',
  component: CallHistoryList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Call history shown when the Calls tab is active. Each row is clickable — expanding it reveals a detail card with type, direction, status, duration, time, and quick Call back / Video actions.',
      },
    },
  },
};

export const Collapsed = {
  render: () => (
    <DesktopSidebarSlice>
      <CallHistoryList callHistory={CALL_HISTORY} onCallSelect={noop} onCallStart={noop} />
    </DesktopSidebarSlice>
  ),
};

export const FirstRowExpanded = {
  render: () => (
    <DesktopSidebarSlice>
      <CallHistoryList callHistory={CALL_HISTORY} onCallSelect={noop} onCallStart={noop} />
      <AutoClickFirst />
    </DesktopSidebarSlice>
  ),
  parameters: { docs: { description: { story: 'The detail card that opens when you click a call row — shows type, direction, status, duration, time, and quick actions.' } } },
};

export const GroupCallExpanded = {
  render: () => (
    <DesktopSidebarSlice>
      <CallHistoryList callHistory={CALL_HISTORY} onCallSelect={noop} onCallStart={noop} />
      <AutoClickFirstGroup />
    </DesktopSidebarSlice>
  ),
  parameters: { docs: { description: { story: 'Group call detail — includes Members count and no Call back action (since it is not a 1:1 call).' } } },
};

export const OnlyMissed = {
  render: () => (
    <DesktopSidebarSlice>
      <CallHistoryList
        callHistory={CALL_HISTORY.filter(c => c.status === 'missed')}
        onCallSelect={noop}
        onCallStart={noop}
      />
    </DesktopSidebarSlice>
  ),
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

const AutoClickFirstGroup = () => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const rows = document.querySelectorAll('.call-hist-item');
      for (const r of rows) {
        if (r.querySelector('.conv-name')?.textContent.includes('(Group)')) { r.click(); return; }
      }
    }, 30);
  }
  return null;
};
