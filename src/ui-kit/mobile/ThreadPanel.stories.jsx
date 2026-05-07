import { ThreadPanel } from '../../components/Overlays';
import { CURRENT_USER, THREAD_MESSAGES, INITIAL_MESSAGES, MobileFrame, noop } from '../_helpers';

export default {
  title: 'Mobile/Overlays/ThreadPanel',
  component: ThreadPanel,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Thread panel on mobile. Takes the full width so replies are easy to read.' } },
  },
};

const parent = INITIAL_MESSAGES.dm_u2[1];

export const WithReplies = {
  render: () => (
    <MobileFrame>
      <ThreadPanel parentMsg={parent} replies={THREAD_MESSAGES.m2} currentUser={CURRENT_USER} onClose={noop} onSend={noop} onReactThread={noop} />
    </MobileFrame>
  ),
};

export const EmptyThread = {
  render: () => (
    <MobileFrame>
      <ThreadPanel parentMsg={parent} replies={[]} currentUser={CURRENT_USER} onClose={noop} onSend={noop} onReactThread={noop} />
    </MobileFrame>
  ),
};
