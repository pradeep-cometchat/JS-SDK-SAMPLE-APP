import { FileIcon } from '../../components/FileIcon';
import { Centered } from '../_helpers';

export default {
  title: 'Web/Primitives/FileIcon',
  component: FileIcon,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'SVG icon that switches on file type. Used in attachment previews and the attach menu.',
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['image', 'pdf', 'video', 'audio', 'doc', 'default'] },
    size: { control: { type: 'range', min: 16, max: 64, step: 2 } },
    color: { control: 'color' },
  },
  decorators: [
    (Story) => (
      <Centered maxWidth={520} padding={48}>
        <div style={{ background: 'var(--surface)', padding: 32, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'center', color: 'var(--text)' }}>
          <Story />
        </div>
      </Centered>
    ),
  ],
};

export const Playground = { args: { type: 'image', size: 40, color: '#004EEB' } };

export const AllTypes = {
  decorators: [(Story) => <Story />],
  render: () => (
    <Centered maxWidth={560}>
      <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {['image', 'pdf', 'video', 'audio', 'doc', 'default'].map(t => (
          <div key={t} style={{ textAlign: 'center', padding: 20, background: 'var(--bg)', borderRadius: 8, color: 'var(--text)' }}>
            <FileIcon type={t} size={40} color="var(--accent)" />
            <div style={{ fontSize: 12, marginTop: 10, textTransform: 'capitalize', color: 'var(--text)' }}>{t}</div>
          </div>
        ))}
      </div>
    </Centered>
  ),
};
