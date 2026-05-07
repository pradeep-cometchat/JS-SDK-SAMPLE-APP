import { useState } from 'react';
import { Centered } from '../_helpers';
import {
  SendIcon, PhoneIcon, VideoIcon, PlusIcon, CheckIcon, TrashIcon, LogoutIcon,
  SettingsIcon, EmojiIcon, PollIcon, NewChatIcon, NewGroupIcon, MicIcon,
  CameraIcon, CallAcceptIcon, CallDeclineIcon, EndCallIcon,
} from '../../components/Icons';

export default {
  title: 'Web/Primitives/Button',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'All button variants used across the CometChat sample app. Each one comes from `app.css` — no Button component, just utility classes you apply to `<button>`.',
      },
    },
  },
};

const Card = ({ title, children, maxWidth = 720, desc }) => (
  <Centered maxWidth={maxWidth} padding={24}>
    <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
      <h3 style={{ margin: 0, color: 'var(--text)', fontSize: 15 }}>{title}</h3>
      {desc && <p style={{ margin: '4px 0 16px', color: 'var(--text-muted)', fontSize: 13 }}>{desc}</p>}
      {!desc && <div style={{ height: 16 }} />}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
    </div>
  </Centered>
);

const DarkCard = ({ title, children, desc }) => (
  <Centered maxWidth={720} padding={24}>
    <div style={{ background: 'var(--sb-bg)', padding: 24, borderRadius: 12, border: '1px solid var(--sb-border)' }}>
      <h3 style={{ margin: 0, color: '#fff', fontSize: 15 }}>{title}</h3>
      {desc && <p style={{ margin: '4px 0 16px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{desc}</p>}
      {!desc && <div style={{ height: 16 }} />}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
    </div>
  </Centered>
);

/* ─── Primary / Ghost / Danger ─────────────────────────── */
export const PrimaryAndGhost = {
  render: () => (
    <Card title="btn-primary / btn-ghost" desc="Full-size modal / dialog buttons. Primary carries the main action, ghost is the secondary.">
      <button className="btn-primary">Save changes</button>
      <button className="btn-primary" disabled>Save changes</button>
      <button className="btn-ghost">Cancel</button>
      <button className="btn-primary">
        <SendIcon />
        <span style={{ marginLeft: 6 }}>Send</span>
      </button>
    </Card>
  ),
};

export const SmallButtons = {
  render: () => (
    <Card title="btn-primary-sm / btn-ghost-sm / btn-danger-sm" desc="Compact variants used in inline confirmations (e.g. delete confirms, call quick actions).">
      <button className="btn-primary-sm">Ring</button>
      <button className="btn-ghost-sm">Open</button>
      <button className="btn-danger-sm">Delete</button>
    </Card>
  ),
};

export const LoginButton = {
  render: () => (
    <Card title="login-btn" desc="Full-width accent button used on the Sign-In and App Credentials screens." maxWidth={480}>
      <button className="login-btn">Continue</button>
    </Card>
  ),
};

/* ─── Icon-only buttons ────────────────────────────────── */
export const IconButton = {
  render: () => (
    <Card title="icon-btn" desc="Small, rounded, transparent-by-default icon button. Used in modal headers, message toolbars, search bars.">
      <button className="icon-btn"><SendIcon /></button>
      <button className="icon-btn"><SettingsIcon /></button>
      <button className="icon-btn"><TrashIcon /></button>
      <button className="icon-btn"><EmojiIcon /></button>
    </Card>
  ),
};

export const HeaderButton = {
  render: () => (
    <Card title="header-btn" desc="Chat-panel header icons (call, video, search, more menu).">
      <button className="header-btn"><PhoneIcon size={18} /></button>
      <button className="header-btn active"><VideoIcon size={18} /></button>
      <button className="header-btn"><SettingsIcon size={18} /></button>
    </Card>
  ),
};

export const SidebarIconButton = {
  render: () => (
    <DarkCard title="sb-icon-btn / sb-action-btn" desc="Dark-themed icon buttons inside the sidebar (new message, new group, settings).">
      <button className="sb-icon-btn sb-action-btn"><NewChatIcon /></button>
      <button className="sb-icon-btn sb-action-btn"><NewGroupIcon /></button>
      <button className="sb-icon-btn"><SettingsIcon /></button>
    </DarkCard>
  ),
};

/* ─── Composer buttons ─────────────────────────────────── */
export const ComposerButtons = {
  render: () => (
    <Card title="input-btn / send-btn" desc="The 34×34 composer buttons — attach, emoji, mic, and send (with active state).">
      <button className="input-btn"><PlusIcon /></button>
      <button className="input-btn active"><EmojiIcon /></button>
      <button className="input-btn"><MicIcon /></button>
      <button className="send-btn"><SendIcon /></button>
      <button className="send-btn active"><SendIcon /></button>
    </Card>
  ),
};

/* ─── Call controls ────────────────────────────────────── */
const CallStage = ({ title, children, desc }) => (
  <Centered maxWidth={720} padding={24}>
    <div style={{ background: '#0b0f19', padding: 32, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 style={{ margin: 0, color: '#fff', fontSize: 15 }}>{title}</h3>
      {desc && <p style={{ margin: '4px 0 20px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{desc}</p>}
      {!desc && <div style={{ height: 20 }} />}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  </Centered>
);

export const CallControlLarge = {
  render: () => (
    <CallStage title="call-ctrl-btn" desc="Large 60×60 accept / decline buttons shown on a ringing call.">
      <button className="call-ctrl-btn accept"><CallAcceptIcon size={24} /></button>
      <button className="call-ctrl-btn decline"><CallDeclineIcon size={24} /></button>
    </CallStage>
  ),
};

export const CallControlSmall = {
  render: () => (
    <CallStage title="call-ctrl-sm" desc="In-call control pill with stacked icon + label. Variants: default, active, recording, end-call.">
      <button className="call-ctrl-sm">
        <MicIcon size={16} />
        <span>Mute</span>
      </button>
      <button className="call-ctrl-sm active">
        <VideoIcon size={16} />
        <span>Camera</span>
      </button>
      <button className="call-ctrl-sm active rec">
        <CheckIcon size={16} />
        <span>Recording</span>
      </button>
      <button className="call-ctrl-sm end-call">
        <EndCallIcon size={16} />
        <span>End</span>
      </button>
    </CallStage>
  ),
};

/* ─── Region picker ────────────────────────────────────── */
export const RegionButton = {
  render: () => {
    const [region, setRegion] = useState('US');
    return (
      <Card title="region-btn" desc="Tri-state region picker used on the App Credentials view of the Login screen." maxWidth={520}>
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          {[{ id: 'US', flag: '🇺🇸' }, { id: 'EU', flag: '🇪🇺' }, { id: 'IN', flag: '🇮🇳' }].map(r => (
            <button
              key={r.id}
              className={`region-btn${region === r.id ? ' selected' : ''}`}
              onClick={() => setRegion(r.id)}
            >
              <span style={{ fontSize: 18 }}>{r.flag}</span> {r.id}
            </button>
          ))}
        </div>
      </Card>
    );
  },
};

/* ─── Attach menu item ─────────────────────────────────── */
export const AttachMenuItem = {
  render: () => (
    <Card title="attach-item" desc="Single tile from the attach menu grid — colored icon well + label.">
      {[
        { label: 'Camera', color: '#004EEB', icon: <CameraIcon size={20} /> },
        { label: 'Poll', color: '#10b981', icon: <PollIcon size={20} /> },
        { label: 'Voice note', color: '#ec4899', icon: <MicIcon size={20} /> },
      ].map(i => (
        <button key={i.label} className="attach-item" style={{ width: 84 }}>
          <div className="attach-item-icon" style={{ background: i.color + '18', color: i.color }}>{i.icon}</div>
          <span className="attach-item-label">{i.label}</span>
        </button>
      ))}
    </Card>
  ),
};

/* ─── Gallery ──────────────────────────────────────────── */
export const AllVariantsGallery = {
  render: () => (
    <Centered maxWidth={820} padding={24}>
      <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 12, border: '1px solid var(--border)' }}>
        <h3 style={{ marginTop: 0, color: 'var(--text)' }}>All button classes</h3>
        {[
          { label: 'Primary', el: <button className="btn-primary">Button</button> },
          { label: 'Primary disabled', el: <button className="btn-primary" disabled>Button</button> },
          { label: 'Ghost', el: <button className="btn-ghost">Button</button> },
          { label: 'Primary sm', el: <button className="btn-primary-sm">Button</button> },
          { label: 'Ghost sm', el: <button className="btn-ghost-sm">Button</button> },
          { label: 'Danger sm', el: <button className="btn-danger-sm">Button</button> },
          { label: 'Login', el: <div style={{ width: 220 }}><button className="login-btn">Continue</button></div> },
          { label: 'Icon', el: <button className="icon-btn"><TrashIcon /></button> },
          { label: 'Header', el: <button className="header-btn"><PhoneIcon size={18} /></button> },
          { label: 'Send (idle)', el: <button className="send-btn"><SendIcon /></button> },
          { label: 'Send (active)', el: <button className="send-btn active"><SendIcon /></button> },
          { label: 'Input', el: <button className="input-btn"><PlusIcon /></button> },
        ].map((row, i) => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', padding: '12px 0', borderBottom: i < 11 ? '1px dashed var(--border)' : 'none' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.label}</span>
            <div>{row.el}</div>
          </div>
        ))}
      </div>
    </Centered>
  ),
};
