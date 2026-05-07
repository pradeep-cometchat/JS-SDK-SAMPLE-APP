import { ConvItem } from '../../components/Sidebar';
import { CONVERSATIONS, DesktopSidebarSlice, noop } from '../_helpers';

export default {
  title: 'Web/Conversations/Conversation Item',
  component: ConvItem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Single conversation row (DM or group) shown inside the sidebar. Renders avatar + status dot for DMs or initialed tile for groups, plus name, preview, pin marker, unread badge, and a hover ⋮ context menu with Pin/Delete. Always wrapped in the dark `.sidebar` container so its white text is legible.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={CONVERSATIONS[0]} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const WithUnreadCount = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={CONVERSATIONS[0]} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const Pinned = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={{ ...CONVERSATIONS[0], pinned: true, unread: 3 }} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const Selected = {
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

export const AllVariantsShowcase = {
  render: () => (
    <DesktopSidebarSlice>
      {CONVERSATIONS.map(c => (
        <ConvItem key={c.id} conv={c} active={c.id === 'grp_eng'} onSelect={noop} onDelete={noop} onPin={noop} />
      ))}
    </DesktopSidebarSlice>
  ),
};
