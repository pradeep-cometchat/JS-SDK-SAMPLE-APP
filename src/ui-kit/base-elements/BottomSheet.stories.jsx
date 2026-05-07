import { Centered } from '../_helpers';
import {
  ReplyIcon, ThreadIcon, CopyIcon, PinIcon, BellIcon, EditIcon, TrashIcon,
  LogoutIcon, StarIcon, PlusIcon,
} from '../../components/Icons';

export default {
  title: 'Base Elements/Bottom Sheet',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Mobile action sheet that slides up from the bottom. Used by message long-press, conversation row long-press, block confirms, sign-out, and reaction picker. No React component — `.bottomsheet` + child classes.',
      },
    },
  },
};

const MobileCanvas = ({ children, height = 520 }) => (
  <Centered maxWidth={420} padding={24}>
    <div style={{ width: 360, height, margin: '0 auto', border: '10px solid #1f2937', borderRadius: 32, overflow: 'hidden', background: 'var(--bg)', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--surface)', padding: 20, fontSize: 12, color: 'var(--text-muted)' }}>
        <em>Background content (chat, list, etc.)</em>
      </div>
      {children}
    </div>
  </Centered>
);

export const MessageActions = {
  render: () => (
    <MobileCanvas>
      <div className="bottomsheet-backdrop" style={{ position: 'absolute' }} />
      <div className="bottomsheet" style={{ position: 'absolute' }}>
        <div className="bottomsheet-handle" />
        <div className="bottomsheet-emoji-row">
          {['👍', '❤️', '😂', '😮', '🚀', '🙏'].map(e => (
            <button key={e} className="tb-emoji-btn">{e}</button>
          ))}
          <button className="bottomsheet-emoji-add" aria-label="More reactions"><PlusIcon size={18} /></button>
        </div>
        <div className="bottomsheet-divider" />
        <div className="bottomsheet-actions">
          <button className="bottomsheet-action"><ReplyIcon size={16} /> Reply</button>
          <button className="bottomsheet-action"><ThreadIcon size={16} /> Reply in thread</button>
          <button className="bottomsheet-action"><CopyIcon size={16} /> Copy text</button>
          <button className="bottomsheet-action"><PinIcon size={16} /> Pin message</button>
          <button className="bottomsheet-action"><BellIcon size={16} /> Mark unread</button>
          <button className="bottomsheet-action"><EditIcon size={16} /> Edit message</button>
          <div className="bottomsheet-divider" />
          <button className="bottomsheet-action danger"><TrashIcon size={16} /> Delete</button>
        </div>
      </div>
    </MobileCanvas>
  ),
  parameters: { docs: { description: { story: 'Shown when a user long-presses a message bubble on mobile.' } } },
};

export const SignOutMenu = {
  render: () => (
    <MobileCanvas height={360}>
      <div className="bottomsheet-backdrop" style={{ position: 'absolute' }} />
      <div className="bottomsheet" style={{ position: 'absolute' }}>
        <div className="bottomsheet-handle" />
        <div className="bottomsheet-actions">
          <button className="bottomsheet-action danger"><LogoutIcon size={16} /> Sign out</button>
        </div>
      </div>
    </MobileCanvas>
  ),
};

export const ConversationActions = {
  render: () => (
    <MobileCanvas height={360}>
      <div className="bottomsheet-backdrop" style={{ position: 'absolute' }} />
      <div className="bottomsheet" style={{ position: 'absolute' }}>
        <div className="bottomsheet-handle" />
        <div className="bottomsheet-title">Jordan Lee</div>
        <div className="bottomsheet-actions">
          <button className="bottomsheet-action"><StarIcon size={16} /> Pin</button>
          <div className="bottomsheet-divider" />
          <button className="bottomsheet-action danger"><TrashIcon size={16} /> Delete conversation</button>
        </div>
      </div>
    </MobileCanvas>
  ),
  parameters: { docs: { description: { story: 'Long-press on a conversation row opens this sheet.' } } },
};

export const BlockConfirm = {
  render: () => (
    <MobileCanvas height={360}>
      <div className="bottomsheet-backdrop" style={{ position: 'absolute' }} />
      <div className="bottomsheet" style={{ position: 'absolute' }}>
        <div className="bottomsheet-handle" />
        <div className="bottomsheet-confirm">
          <p>Block Jordan Lee? They won't be able to message you.</p>
          <div className="bottomsheet-confirm-btns">
            <button className="btn-ghost">Cancel</button>
            <button className="btn-danger-sm">Block</button>
          </div>
        </div>
      </div>
    </MobileCanvas>
  ),
};

export const AllVariantsShowcase = MessageActions;
