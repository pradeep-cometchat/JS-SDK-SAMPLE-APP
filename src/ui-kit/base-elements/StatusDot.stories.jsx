import { Avatar, StatusDot } from '../../components/Avatar';
import { USERS, Centered } from '../_helpers';

export default {
  title: 'Base Elements/Status Dot',
  component: StatusDot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Online-presence indicator. Renders nothing when status is `offline`; renders a small green dot when status is `online`. Used over an Avatar in every user list.",
      },
    },
  },
  argTypes: {
    status: { control: 'select', options: ['online', 'offline'] },
    size: { control: { type: 'range', min: 6, max: 20, step: 1 } },
  },
  decorators: [
    (Story) => (
      <Centered maxWidth={520} padding={48}>
        <div style={{ background: 'var(--surface)', padding: 32, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
          <Story />
        </div>
      </Centered>
    ),
  ],
};

export const Default = {
  render: ({ status, size }) => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar user={USERS[0]} size={56} />
      <StatusDot status={status} size={size} />
    </div>
  ),
  args: { status: 'online', size: 10 },
};

export const Online = { ...Default, args: { status: 'online', size: 12 } };
export const Offline = { ...Default, args: { status: 'offline', size: 12 } };

export const AllVariantsShowcase = {
  decorators: [(Story) => <Story />],
  render: () => (
    <Centered maxWidth={460} padding={24}>
      <div style={{ background: 'var(--surface)', padding: 32, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-evenly' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar user={USERS[0]} size={56} />
            <StatusDot status="online" />
          </div>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 500 }}>Online</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar user={USERS[2]} size={56} />
            <StatusDot status="offline" />
          </div>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 500 }}>Offline (no dot)</div>
        </div>
      </div>
    </Centered>
  ),
};
