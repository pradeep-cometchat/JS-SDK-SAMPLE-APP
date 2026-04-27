import { useState } from 'react';
import { STATUS_COLORS } from '../data';

const lighten = (hex, pct) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (n >> 16) + Math.round(pct * 255));
  const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(pct * 255));
  const b = Math.min(255, (n & 0xff) + Math.round(pct * 255));
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
};

export const Avatar = ({ user, size = 36 }) => {
  const [imgErr, setImgErr] = useState(false);

  if (user.avatarUrl && !imgErr) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: `0 2px 8px ${user.color}44` }}>
        <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
      </div>
    );
  }

  const colorLight = lighten(user.color, 0.18);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(145deg,${colorLight},${user.color})`,
      color: '#fff', fontSize: size * 0.36, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, userSelect: 'none', letterSpacing: '-0.5px',
      boxShadow: `0 2px 8px ${user.color}44`,
    }}>{user.initials}</div>
  );
};

export const StatusDot = ({ status, size = 10 }) => (
  <div style={{
    position: 'absolute', bottom: -1, right: -1,
    width: size, height: size, borderRadius: '50%',
    background: STATUS_COLORS[status] || '#9ca3af',
    border: '2px solid var(--surface)',
    boxSizing: 'border-box',
  }} />
);
