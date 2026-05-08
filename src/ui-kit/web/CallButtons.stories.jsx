import { Centered } from '../_helpers';
import { PhoneIcon, VideoIcon } from '../../components/Icons';

export default {
  title: 'Web/Calls/Call Buttons',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The pair of call icons (audio + video) shown in the chat header. Wraps the underlying `.header-btn` style.',
      },
    },
  },
};

const Card = ({ children, label }) => (
  <Centered maxWidth={520} padding={24}>
    <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 12, border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, marginBottom: 14 }}>{label}</div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  </Centered>
);

export const Default = {
  render: () => (
    <Card label="Both enabled">
      <button className="header-btn"><PhoneIcon size={18} /></button>
      <button className="header-btn"><VideoIcon size={18} /></button>
    </Card>
  ),
};

export const BothEnabled = Default;

export const AudioOnly = {
  render: () => (
    <Card label="Audio only">
      <button className="header-btn"><PhoneIcon size={18} /></button>
    </Card>
  ),
};

export const VideoOnly = {
  render: () => (
    <Card label="Video only">
      <button className="header-btn"><VideoIcon size={18} /></button>
    </Card>
  ),
};

export const AllVariantsShowcase = {
  render: () => (
    <Centered maxWidth={520} padding={24}>
      <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[{ l: 'Both enabled', els: [<PhoneIcon key="p" size={18} />, <VideoIcon key="v" size={18} />] },
        { l: 'Audio only', els: [<PhoneIcon key="p" size={18} />] },
        { l: 'Video only', els: [<VideoIcon key="v" size={18} />] }].map(({ l, els }) => (
          <div key={l} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l}</span>
            <div style={{ display: 'flex', gap: 12 }}>
              {els.map((icon, i) => <button key={i} className="header-btn">{icon}</button>)}
            </div>
          </div>
        ))}
      </div>
    </Centered>
  ),
};
