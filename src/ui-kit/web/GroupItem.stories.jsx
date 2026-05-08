import { ConvItem } from '../../components/Sidebar';
import { CONVERSATIONS, DesktopSidebarSlice, noop } from '../_helpers';

export default {
  title: 'Web/Groups/Group Item',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Single group row inside the sidebar. Renders the group initials tile (colored background), the group name, and a member count. Shares the `ConvItem` component with direct-message rows but uses the group-specific avatar and sub-line.',
      },
    },
  },
};

const groupEng = CONVERSATIONS.find(c => c.id === 'grp_eng');
const groupDesign = CONVERSATIONS.find(c => c.id === 'grp_design');
const groupRandom = CONVERSATIONS.find(c => c.id === 'grp_random');

export const Default = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={groupDesign} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const WithMemberCount = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={groupEng} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const WithUnread = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={{ ...groupEng, unread: 12 }} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const Pinned = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={{ ...groupEng, pinned: true, unread: 5 }} active={false} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const Active = {
  render: () => (
    <DesktopSidebarSlice>
      <ConvItem conv={groupRandom} active={true} onSelect={noop} onDelete={noop} onPin={noop} />
    </DesktopSidebarSlice>
  ),
};

export const AllVariantsShowcase = {
  render: () => (
    <DesktopSidebarSlice>
      {[groupEng, groupDesign, groupRandom].map(c => (
        <ConvItem key={c.id} conv={c} active={c.id === 'grp_eng'} onSelect={noop} onDelete={noop} onPin={noop} />
      ))}
    </DesktopSidebarSlice>
  ),
};
