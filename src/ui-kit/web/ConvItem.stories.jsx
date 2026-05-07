import { ConvItem } from '../../components/Sidebar';
import { CONVERSATIONS, DesktopSidebarSlice, noop } from '../_helpers';

export default {
  title: 'Web/Sidebar/ConvItem',
  component: ConvItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Single conversation row. Wrapped in the dark `.sidebar` container so the white text matches the real app. Hover any row to reveal the ⋮ menu for Pin/Delete.',
      },
    },
  },
};

export const DM = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={CONVERSATIONS[0]} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const DMUnreadPinned = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={{ ...CONVERSATIONS[0], pinned: true, unread: 3 }} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const DMActive = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={CONVERSATIONS[1]} active={true} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const Group = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={CONVERSATIONS[4]} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const GroupWithUnread = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={{ ...CONVERSATIONS[4], unread: 12 }} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const MixedList = {
  render: () => (
    <DesktopSidebarSlice>
      {CONVERSATIONS.map(c => (
        <ConvItem key={c.id} conv={c} active={c.id === 'grp_eng'} onSelect={noop} onDelete={noop} onPin={noop} />
      ))}
    </DesktopSidebarSlice>
  ),
};
