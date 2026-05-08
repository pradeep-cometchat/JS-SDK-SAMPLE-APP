import { Centered } from '../_helpers';
import { formatTime, formatFullTime, fmtCallDuration } from '../../data';

export default {
  title: 'Base Elements/Date',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Timestamp helpers used across the app. `formatTime(ts)` shows a smart short label (time today, 'Yesterday', weekday name, month+day). `formatFullTime(ts)` shows a full date+time label. `fmtCallDuration(seconds)` formats durations like `14m 7s`.",
      },
    },
  },
};

const Card = ({ children }) => (
  <Centered maxWidth={680} padding={24}>
    <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 12, border: '1px solid var(--border)' }}>
      {children}
    </div>
  </Centered>
);

const Row = ({ label, value }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
    <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font)' }}>{value}</span>
  </div>
);

const now = Date.now();
const ago = (ms) => now - ms;

export const FormatTime = {
  render: () => (
    <Card>
      <h3 style={{ margin: 0, marginBottom: 16, color: 'var(--text)' }}>formatTime()</h3>
      <Row label="30s ago" value={formatTime(ago(30 * 1000))} />
      <Row label="15m ago" value={formatTime(ago(15 * 60 * 1000))} />
      <Row label="3h ago" value={formatTime(ago(3 * 60 * 60 * 1000))} />
      <Row label="Yesterday" value={formatTime(ago(28 * 60 * 60 * 1000))} />
      <Row label="4 days ago" value={formatTime(ago(4 * 24 * 60 * 60 * 1000))} />
      <Row label="14 days ago" value={formatTime(ago(14 * 24 * 60 * 60 * 1000))} />
    </Card>
  ),
};

export const FormatFullTime = {
  render: () => (
    <Card>
      <h3 style={{ margin: 0, marginBottom: 16, color: 'var(--text)' }}>formatFullTime()</h3>
      <Row label="Now" value={formatFullTime(now)} />
      <Row label="3h ago" value={formatFullTime(ago(3 * 60 * 60 * 1000))} />
      <Row label="2d ago" value={formatFullTime(ago(2 * 24 * 60 * 60 * 1000))} />
    </Card>
  ),
};

export const CallDuration = {
  render: () => (
    <Card>
      <h3 style={{ margin: 0, marginBottom: 16, color: 'var(--text)' }}>fmtCallDuration()</h3>
      <Row label="30 seconds" value={fmtCallDuration(30) || 'no output'} />
      <Row label="72 seconds" value={fmtCallDuration(72)} />
      <Row label="600 seconds" value={fmtCallDuration(600)} />
      <Row label="3607 seconds" value={fmtCallDuration(3607)} />
    </Card>
  ),
};

export const AllVariantsShowcase = {
  render: () => (
    <Card>
      <h3 style={{ marginTop: 0, color: 'var(--text)' }}>All formats</h3>
      <Row label="formatTime(30s ago)" value={formatTime(ago(30 * 1000))} />
      <Row label="formatTime(3h ago)" value={formatTime(ago(3 * 60 * 60 * 1000))} />
      <Row label="formatTime(yesterday)" value={formatTime(ago(28 * 60 * 60 * 1000))} />
      <Row label="formatTime(week+)" value={formatTime(ago(10 * 24 * 60 * 60 * 1000))} />
      <Row label="formatFullTime(now)" value={formatFullTime(now)} />
      <Row label="fmtCallDuration(72)" value={fmtCallDuration(72)} />
    </Card>
  ),
};
