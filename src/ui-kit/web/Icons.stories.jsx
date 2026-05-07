import * as Icons from '../../components/Icons';
import { Centered } from '../_helpers';

export default {
  title: 'Web/Primitives/Icons',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every icon in the app is a Material Symbols Rounded glyph, served via the Google Fonts CDN and rendered through the internal `MIcon` helper. Each component accepts a `size` prop.',
      },
    },
  },
};

// All named exports from Icons.jsx that are icon components
const ICON_COMPONENTS = Object.entries(Icons).filter(([name, value]) =>
  typeof value === 'function' && /Icon$/.test(name),
);

export const Gallery = {
  render: () => (
    <Centered maxWidth={1020}>
      <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
        <h3 style={{ margin: 0, marginBottom: 4, color: 'var(--text)' }}>Icon library</h3>
        <p style={{ margin: 0, marginBottom: 20, color: 'var(--text-muted)', fontSize: 13 }}>
          {ICON_COMPONENTS.length} icons, all from Material Symbols Rounded.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {ICON_COMPONENTS.map(([name, C]) => (
            <div
              key={name}
              style={{
                padding: 14,
                background: 'var(--bg)',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                color: 'var(--text)',
              }}
            >
              <div style={{ fontSize: 24, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {name === 'RecordIcon' ? <C recording size={24} /> :
                 name === 'CallDirectionIcon' ? <C direction="outgoing" size={24} /> :
                 <C size={24} />}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textAlign: 'center' }}>{name}</div>
            </div>
          ))}
        </div>
      </div>
    </Centered>
  ),
};

export const Sizes = {
  render: () => (
    <Centered maxWidth={640}>
      <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, justifyContent: 'center' }}>
          {[12, 16, 20, 24, 32, 48].map(s => (
            <div key={s} style={{ textAlign: 'center', color: 'var(--text)' }}>
              <Icons.PhoneIcon size={s} />
              <div style={{ fontSize: 11, marginTop: 10, color: 'var(--text-muted)' }}>{s}px</div>
            </div>
          ))}
        </div>
      </div>
    </Centered>
  ),
  parameters: { docs: { description: { story: 'Icons scale crisply because Material Symbols is a variable font — not pixel sprites.' } } },
};

export const RecordIconStates = {
  render: () => (
    <Centered maxWidth={400}>
      <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: 48 }}>
        <div style={{ textAlign: 'center', color: 'var(--text)' }}>
          <Icons.RecordIcon size={32} />
          <div style={{ fontSize: 12, marginTop: 8 }}>Idle</div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text)' }}>
          <Icons.RecordIcon size={32} recording />
          <div style={{ fontSize: 12, marginTop: 8 }}>Recording</div>
        </div>
      </div>
    </Centered>
  ),
};

export const CallDirectionStates = {
  render: () => (
    <Centered maxWidth={400}>
      <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: 48 }}>
        <div style={{ textAlign: 'center', color: 'var(--text)' }}>
          <Icons.CallDirectionIcon direction="outgoing" size={28} color="#22c55e" />
          <div style={{ fontSize: 12, marginTop: 8 }}>Outgoing</div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text)' }}>
          <Icons.CallDirectionIcon direction="incoming" size={28} color="#dc2626" />
          <div style={{ fontSize: 12, marginTop: 8 }}>Incoming</div>
        </div>
      </div>
    </Centered>
  ),
};
