import { FileIcon } from '../../components/FileIcon';
import { Centered } from '../_helpers';

export default {
  title: 'Base Elements/File Icon',
  component: FileIcon,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'File-type icon backed by Material Symbols Rounded. Maps `type` → `image` | `picture_as_pdf` | `movie` | `audio_file` | `description` | `attach_file` (default).',
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

export const Default = { args: { type: 'image', size: 40, color: '#004EEB' } };
export const Image = { args: { type: 'image', size: 40, color: '#0ea5e9' } };
export const Pdf = { args: { type: 'pdf', size: 40, color: '#ef4444' } };
export const Video = { args: { type: 'video', size: 40, color: '#6366f1' } };
export const Audio = { args: { type: 'audio', size: 40, color: '#ec4899' } };
export const Doc = { args: { type: 'doc', size: 40, color: '#f59e0b' } };
export const DefaultAttachment = { args: { type: 'default', size: 40, color: '#6b7280' } };

export const AllVariantsShowcase = {
  decorators: [(Story) => <Story />],
  render: () => (
    <Centered maxWidth={640} padding={24}>
      <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 12, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
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
