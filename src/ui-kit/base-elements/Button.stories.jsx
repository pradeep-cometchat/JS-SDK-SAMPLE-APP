import { useState } from 'react';
import { Centered } from '../_helpers';
import {
  SendIcon, PhoneIcon, VideoIcon, PlusIcon, TrashIcon, SettingsIcon,
  EmojiIcon, MicIcon, CameraIcon, CallAcceptIcon, CallDeclineIcon,
  EndCallIcon, NewChatIcon, NewGroupIcon, PollIcon, CheckIcon,
} from '../../components/Icons';

export default {
  title: 'Base Elements/Button',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'All button variants used across the CometChat sample app. No React wrapper — every variant is a utility class you apply to a native `<button>`.',
      },
    },
  },
};

const Card = ({ title, desc, children, maxWidth = 720 }) => (
  <Centered maxWidth={maxWidth} padding={24}>
    <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
      <h3 style={{ margin: 0, color: 'var(--text)', fontSize: 15 }}>{title}</h3>
      {desc && <p style={{ margin: '4px 0 18px', color: 'var(--text-muted)', fontSize: 13 }}>{desc}</p>}
      {!desc && <div style={{ height: 18 }} />}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
    </div>
  </Centered>
);

const DarkCard = ({ title, desc, children }) => (
  <Centered maxWidth={720} padding={24}>
    <div style={{ background: 'var(--sb-bg)', padding: 24, borderRadius: 12, border: '1px solid var(--sb-border)' }}>
      <h3 style={{ margin: 0, color: '#fff', fontSize: 15 }}>{title}</h3>
      {desc && <p style={{ margin: '4px 0 18px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{desc}</p>}
      {!desc && <div style={{ height: 18 }} />}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
    </div>
  </Centered>
);

const CallStage = ({ title, desc, children }) => (
  <Centered maxWidth={720} padding={24}>
    <div style={{ background: '#0b0f19', padding: 32, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 style={{ margin: 0, color: '#fff', fontSize: 15 }}>{title}</h3>
      {desc && <p style={{ margin: '4px 0 20px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{desc}</p>}
      {!desc && <div style={{ height: 20 }} />}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  </Centered>
);

export const Primary = {
  render: () => (
    <Card title="Primary" desc="Main action. Full 9px×20px padding, accent background, white text. Ideal for modal submit buttons.">
      <button className="btn-primary">Save changes</button>
      <button className="btn-primary" disabled>Disabled</button>
      <button className="btn-primary"><SendIcon /><span style={{ marginLeft: 6 }}>Send</span></button>
    </Card>
  ),
};

export const Ghost = {
  render: () => (
    <Card title="Ghost" desc="Secondary action. Outlined border, no fill. Usually paired with a Primary.">
      <button className="btn-ghost">Cancel</button>
      <button className="btn-ghost">Learn more</button>
    </Card>
  ),
};

export const Small = {
  render: () => (
    <Card title="Small buttons (-sm variants)" desc="Used inline — call demo, delete confirms, quick actions.">
      <button className="btn-primary-sm">Ring</button>
      <button className="btn-ghost-sm">Open</button>
      <button className="btn-danger-sm">Delete</button>
    </Card>
  ),
};

export const Login = {
  render: () => (
    <Card title="Login button" desc="Full-width accent button used on the Sign-In and App Credentials screens." maxWidth={460}>
      <button className="login-btn">Continue</button>
    </Card>
  ),
};

export const Icon = {
  render: () => (
    <Card title="Icon buttons" desc="Transparent hover. Used in modal headers, composer toolbars, search bars.">
      <button className="icon-btn"><SendIcon /></button>
      <button className="icon-btn"><SettingsIcon /></button>
      <button className="icon-btn"><TrashIcon /></button>
      <button className="icon-btn"><EmojiIcon /></button>
    </Card>
  ),
};

export const ChatHeader = {
  render: () => (
    <Card title="Chat header buttons" desc="Call, video, search, more-menu buttons in the top of ChatPanel.">
      <button className="header-btn"><PhoneIcon size={18} /></button>
      <button className="header-btn active"><VideoIcon size={18} /></button>
      <button className="header-btn"><SettingsIcon size={18} /></button>
    </Card>
  ),
};

export const SidebarIcon = {
  render: () => (
    <DarkCard title="Sidebar icon buttons" desc="Dark-themed. New message, new group, settings — sit inside the dark sidebar.">
      <button className="sb-icon-btn sb-action-btn"><NewChatIcon /></button>
      <button className="sb-icon-btn sb-action-btn"><NewGroupIcon /></button>
      <button className="sb-icon-btn"><SettingsIcon /></button>
    </DarkCard>
  ),
};

export const Composer = {
  render: () => (
    <Card title="Composer buttons" desc="The 34×34 buttons in the message composer: attach, emoji, mic, send (idle + active).">
      <button className="input-btn"><PlusIcon /></button>
      <button className="input-btn active"><EmojiIcon /></button>
      <button className="input-btn"><MicIcon /></button>
      <button className="send-btn"><SendIcon /></button>
      <button className="send-btn active"><SendIcon /></button>
    </Card>
  ),
};

export const CallControls = {
  render: () => (
    <>
      <CallStage title="Large call controls" desc="60×60 accept / decline on a ringing call.">
        <button className="call-ctrl-btn accept"><CallAcceptIcon size={24} /></button>
        <button className="call-ctrl-btn decline"><CallDeclineIcon size={24} /></button>
      </CallStage>
      <CallStage title="In-call control pills" desc="Stacked icon + label. Variants: default, active, recording, end-call.">
        <button className="call-ctrl-sm"><MicIcon size={16} /><span>Mute</span></button>
        <button className="call-ctrl-sm active"><VideoIcon size={16} /><span>Camera</span></button>
        <button className="call-ctrl-sm active rec"><CheckIcon size={16} /><span>Recording</span></button>
        <button className="call-ctrl-sm end-call"><EndCallIcon size={16} /><span>End</span></button>
      </CallStage>
    </>
  ),
};

export const Region = {
  render: () => {
    const [region, setRegion] = useState('US');
    return (
      <Card title="Region picker" desc="Tri-state selectable button (interactive)." maxWidth={520}>
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          {[{ id: 'US', flag: '🇺🇸' }, { id: 'EU', flag: '🇪🇺' }, { id: 'IN', flag: '🇮🇳' }].map(r => (
            <button key={r.id} className={`region-btn${region === r.id ? ' selected' : ''}`} onClick={() => setRegion(r.id)}>
              <span style={{ fontSize: 18 }}>{r.flag}</span> {r.id}
            </button>
          ))}
        </div>
      </Card>
    );
  },
};

export const AttachMenuItem = {
  render: () => (
    <Card title="Attach menu tile" desc="Single colored-icon tile from the attach menu grid.">
      {[
        { label: 'Camera', color: '#004EEB', icon: <CameraIcon size={20} /> },
        { label: 'Poll', color: '#10b981', icon: <PollIcon size={20} /> },
        { label: 'Voice', color: '#ec4899', icon: <MicIcon size={20} /> },
      ].map(i => (
        <button key={i.label} className="attach-item" style={{ width: 84 }}>
          <div className="attach-item-icon" style={{ background: i.color + '18', color: i.color }}>{i.icon}</div>
          <span className="attach-item-label">{i.label}</span>
        </button>
      ))}
    </Card>
  ),
};

export const AllVariantsShowcase = {
  render: () => (
    <Centered maxWidth={860} padding={24}>
      <div style={{ background: 'var(--surface)', padding: 28, borderRadius: 12, border: '1px solid var(--border)' }}>
        <h3 style={{ marginTop: 0, color: 'var(--text)' }}>All button classes</h3>
        {[
          ['Primary', <button className="btn-primary">Button</button>],
          ['Primary disabled', <button className="btn-primary" disabled>Button</button>],
          ['Ghost', <button className="btn-ghost">Button</button>],
          ['Primary sm', <button className="btn-primary-sm">Button</button>],
          ['Ghost sm', <button className="btn-ghost-sm">Button</button>],
          ['Danger sm', <button className="btn-danger-sm">Button</button>],
          ['Login', <div style={{ width: 220 }}><button className="login-btn">Continue</button></div>],
          ['Icon', <button className="icon-btn"><TrashIcon /></button>],
          ['Header', <button className="header-btn"><PhoneIcon size={18} /></button>],
          ['Send (idle)', <button className="send-btn"><SendIcon /></button>],
          ['Send (active)', <button className="send-btn active"><SendIcon /></button>],
          ['Input', <button className="input-btn"><PlusIcon /></button>],
        ].map(([label, el], i) => (
          <div key={label} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', padding: '12px 0', borderBottom: i < 11 ? '1px dashed var(--border)' : 'none' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
            <div>{el}</div>
          </div>
        ))}
      </div>
    </Centered>
  ),
};
