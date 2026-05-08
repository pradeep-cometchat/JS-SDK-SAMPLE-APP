import { useState } from 'react';
import { EmojiKeyboard } from '../../components/ChatPanel';
import { Centered, noop } from '../_helpers';

export default {
  title: 'Base Elements/Emoji Keyboard',
  component: EmojiKeyboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Emoji picker used by the composer and reaction menus. Has Recent, Smileys, Gestures, Animals, Food, Objects, Symbols tabs plus a keyword search (maps words to categories). Absolutely positioned — opens upward from its anchor.',
      },
    },
  },
};

const Stage = ({ children, height = 440, width = 380 }) => (
  <div style={{ position: 'relative', width, height, margin: '0 auto' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 0 }}>
      {children}
    </div>
  </div>
);

export const Default = {
  render: () => (
    <Centered maxWidth={480} padding={24}>
      <Stage height={420} width={370}>
        <EmojiKeyboard onSelect={noop} onClose={noop} />
      </Stage>
    </Centered>
  ),
  parameters: { docs: { description: { story: 'The full 348px emoji keyboard centered in the canvas.' } } },
};

export const WithSelection = {
  render: () => {
    const [picked, setPicked] = useState('');
    return (
      <Centered maxWidth={820} padding={24}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Stage height={420} width={370}>
            <EmojiKeyboard onSelect={setPicked} onClose={noop} />
          </Stage>
          <div style={{ minWidth: 180, background: 'var(--surface)', padding: 16, borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Last picked</div>
            <div style={{ fontSize: 56, marginTop: 8, minHeight: 64 }}>{picked || '–'}</div>
          </div>
        </div>
      </Centered>
    );
  },
};

export const AllVariantsShowcase = Default;
