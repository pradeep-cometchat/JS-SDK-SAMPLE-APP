// CometChat Sample App — Mock Data

export const CURRENT_USER = {
  id: 'u1', name: 'Alex Chen', username: 'user-comet-chat-1',
  initials: 'AC', color: '#6851D6', status: 'online', role: 'Frontend Developer'
};

export const USERS = [
  { id: 'u2', name: 'Jordan Lee',   username: 'jordan.lee',  initials: 'JL', color: '#0ea5e9', status: 'online',  role: 'Product Designer',  avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'u3', name: 'Sam Rivera',   username: 'sam.rivera',  initials: 'SR', color: '#10b981', status: 'offline',    role: 'Product Manager',   avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'u4', name: 'Morgan Kim',   username: 'morgan.kim',  initials: 'MK', color: '#f59e0b', status: 'offline', role: 'Engineering Lead',  avatarUrl: null },
  { id: 'u5', name: 'Taylor Park',  username: 'taylor.park', initials: 'TP', color: '#ec4899', status: 'online',  role: 'Full-Stack Dev',    avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 'u6', name: 'Casey Wong',   username: 'casey.wong',  initials: 'CW', color: '#8b5cf6', status: 'offline',     role: 'Backend Engineer',  avatarUrl: null },
  { id: 'u7', name: 'Riley Okafor', username: 'riley.okafor',initials: 'RO', color: '#f97316', status: 'online',  role: 'DevOps Engineer',   avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg' },
];

export const ALL_USERS = [CURRENT_USER, ...USERS];

export const CONVERSATIONS = [
  { id: 'dm_u2', type: 'dm',    userId: 'u2', unread: 2,  pinned: true },
  { id: 'dm_u3', type: 'dm',    userId: 'u3', unread: 0,  pinned: false },
  { id: 'dm_u5', type: 'dm',    userId: 'u5', unread: 0,  pinned: false },
  { id: 'dm_u6', type: 'dm',    userId: 'u6', unread: 1,  pinned: false },
  {
    id: 'grp_eng', type: 'group', name: 'engineering', initials: 'EN',
    color: '#6851D6', icon: '⚙️', memberIds: ['u1','u2','u4','u5','u6','u7'],
    description: 'Engineering team discussions, code reviews, architecture decisions.',
    groupType: 'private', unread: 5, pinned: true, ownerId: 'u4',
  },
  {
    id: 'grp_design', type: 'group', name: 'design', initials: 'DS',
    color: '#ec4899', icon: '🎨', memberIds: ['u1','u2','u3','u5'],
    description: 'Design reviews, Figma links, and UI/UX discussions.',
    groupType: 'public', unread: 0, pinned: false, ownerId: 'u2',
  },
  {
    id: 'grp_random', type: 'group', name: 'random', initials: 'RD',
    color: '#10b981', icon: '🎲', memberIds: ['u1','u2','u3','u4','u5','u6','u7'],
    description: 'Off-topic conversations and fun stuff.',
    groupType: 'public', unread: 0, pinned: false, ownerId: 'u1',
  },
];

const now = Date.now();
const mins = (n) => now - n * 60000;
const hrs  = (n) => now - n * 3600000;

export const INITIAL_MESSAGES = {
  dm_u2: [
    { id: 'm1', senderId: 'u2', text: 'Hey! Did you check the new CometChat SDK v4 docs?', ts: hrs(2), reactions: [], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
    { id: 'm2', senderId: 'u1', text: 'Yeah, the new webhooks API looks really clean. Especially the real-time presence hooks.', ts: hrs(2) + 120000, reactions: [{ emoji: '👍', userIds: ['u2'] }], readBy: ['u2'], threadCount: 3, edited: false, deleted: false },
    { id: 'm3', senderId: 'u2', text: 'Exactly! I was thinking we migrate the current socket implementation this sprint.', ts: hrs(1) + 300000, reactions: [], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
    { id: 'm4', senderId: 'u1', text: 'Sounds good. Can you create a ticket and assign it to me? I can start with the auth flow.', ts: hrs(1) + 360000, reactions: [{ emoji: '🚀', userIds: ['u2'] }, { emoji: '✅', userIds: ['u2'] }], readBy: ['u2'], threadCount: 0, edited: false, deleted: false },
    { id: 'm5', senderId: 'u2', text: 'Done! Also sharing the architecture diagram I sketched out.', ts: mins(45), reactions: [], readBy: ['u1'], threadCount: 0, edited: false, deleted: false, file: { name: 'arch-diagram.png', size: '2.4 MB', type: 'image' } },
    { id: 'm6', senderId: 'u2', text: 'Let me know what you think when you get a chance 👀', ts: mins(3), reactions: [], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
  ],
  dm_u3: [
    { id: 'm10', senderId: 'u3', text: 'Quick sync tomorrow at 10am? Need to align on Q3 roadmap.', ts: hrs(5), reactions: [], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
    { id: 'm11', senderId: 'u1', text: 'Works for me. Should I invite Morgan too?', ts: hrs(5) + 180000, reactions: [], readBy: ['u3'], threadCount: 0, edited: false, deleted: false },
    { id: 'm12', senderId: 'u3', text: 'Yes please, she has context on the API priorities.', ts: hrs(4), reactions: [{ emoji: '👍', userIds: ['u1'] }], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
  ],
  dm_u5: [
    { id: 'm20', senderId: 'u5', text: "Hey, is the staging env down? Getting 502s on the auth endpoint.", ts: hrs(1), reactions: [], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
    { id: 'm21', senderId: 'u1', text: "Just checked — Casey deployed a hotfix 10 mins ago, should be back. Try now?", ts: mins(58), reactions: [], readBy: ['u5'], threadCount: 0, edited: false, deleted: false },
    { id: 'm22', senderId: 'u5', text: "Working now, thanks! 🙌", ts: mins(55), reactions: [{ emoji: '🙌', userIds: ['u1'] }], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
  ],
  dm_u6: [
    { id: 'm30', senderId: 'u6', text: 'The Redis cache config needs updating. Sent you the PR.', ts: mins(12), reactions: [], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
  ],
  grp_eng: [
    { id: 'g1', senderId: 'u4', text: 'Team — reminder that the sprint review is Friday 3pm. Please update your tickets by Thursday EOD.', ts: hrs(3), reactions: [{ emoji: '👍', userIds: ['u1','u2','u5'] }, { emoji: '✅', userIds: ['u6'] }], readBy: ['u1','u2','u5','u6'], threadCount: 2, edited: false, deleted: false },
    { id: 'g2', senderId: 'u7', text: 'Kubernetes upgrade is done. All pods healthy. Rollback procedure is documented in Confluence.', ts: hrs(2), reactions: [{ emoji: '🚀', userIds: ['u1','u2','u4','u5'] }], readBy: ['u1','u2','u4','u5'], threadCount: 0, edited: false, deleted: false },
    { id: 'g3', senderId: 'u5', text: 'Anyone else seeing the flaky tests in CI? Three of my builds failed in the last hour for no obvious reason.', ts: hrs(1) + 600000, reactions: [{ emoji: '😅', userIds: ['u6'] }], readBy: ['u1','u6'], threadCount: 4, edited: false, deleted: false },
    { id: 'g4', senderId: 'u6', text: "It's the jest version mismatch after the Node upgrade. I'll push a fix now.", ts: hrs(1) + 660000, reactions: [{ emoji: '🙏', userIds: ['u5'] }], readBy: ['u1','u5'], threadCount: 0, edited: false, deleted: false },
    { id: 'g5', senderId: 'u1', text: 'FYI — I opened a PR for the CometChat SDK migration. Would love a review from whoever has bandwidth.', ts: mins(30), reactions: [], readBy: ['u4'], threadCount: 0, edited: false, deleted: false, file: { name: 'cometchat-migration.md', size: '8.2 KB', type: 'doc' } },
    { id: 'g6', senderId: 'u2', text: "I'll review it after standup 👍", ts: mins(25), reactions: [], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
    { id: 'g7', senderId: 'u4', text: 'Alex, can you also add test coverage for the new webhook handlers?', ts: mins(10), reactions: [], readBy: ['u1'], threadCount: 0, edited: false, deleted: false },
    { id: 'g8', senderId: 'u5', text: 'Heads up: I found a memory leak in the WebSocket reconnect logic. Creating a ticket now.', ts: mins(5), reactions: [{ emoji: '👀', userIds: ['u1','u6'] }], readBy: ['u1','u6'], threadCount: 0, edited: false, deleted: false },
  ],
  grp_design: [
    { id: 'd1', senderId: 'u2', text: "New Figma file is ready for the mobile redesign. Sharing the link — please comment by EOW.", ts: hrs(6), reactions: [{ emoji: '🎨', userIds: ['u1','u3'] }, { emoji: '👀', userIds: ['u5'] }], readBy: ['u1','u3','u5'], threadCount: 1, edited: false, deleted: false },
    { id: 'd2', senderId: 'u3', text: "Love the new component system Jordan. The auto-layout frames are way cleaner.", ts: hrs(5), reactions: [{ emoji: '💙', userIds: ['u2'] }], readBy: ['u2','u1'], threadCount: 0, edited: false, deleted: false },
    { id: 'd3', senderId: 'u1', text: "One question — are the icon sizes aligned with the design tokens? I see some 20px icons where the system specifies 24px.", ts: hrs(4), reactions: [], readBy: ['u2'], threadCount: 0, edited: false, deleted: false },
    { id: 'd4', senderId: 'u2', text: "Good catch! Those are intentional for the compact mode variant, but I'll add a note.", ts: hrs(3) + 600000, reactions: [{ emoji: '👍', userIds: ['u1'] }], readBy: ['u1','u3'], threadCount: 0, edited: false, deleted: false },
  ],
  grp_random: [
    { id: 'r1', senderId: 'u7', text: 'Anyone else think the new GitHub Copilot workspace feature is wild? 🤯', ts: hrs(8), reactions: [{ emoji: '🤯', userIds: ['u1','u2','u5','u6'] }], readBy: ['u1','u2','u5','u6'], threadCount: 0, edited: false, deleted: false },
    { id: 'r2', senderId: 'u5', text: "Honestly yeah. It refactored my entire auth module while I made coffee. Not sure how to feel 😂", ts: hrs(7) + 600000, reactions: [{ emoji: '😂', userIds: ['u1','u2','u3','u7'] }], readBy: ['u1','u2','u3','u7'], threadCount: 0, edited: false, deleted: false },
    { id: 'r3', senderId: 'u3', text: "Okay but did it break anything?", ts: hrs(7), reactions: [], readBy: ['u1','u2','u5','u7'], threadCount: 0, edited: false, deleted: false },
    { id: 'r4', senderId: 'u5', text: "...only 3 tests 😅", ts: hrs(6) + 300000, reactions: [{ emoji: '😅', userIds: ['u1','u2','u3','u7'] }], readBy: ['u1','u2','u3','u7'], threadCount: 0, edited: false, deleted: false },
  ],
};

export const THREAD_MESSAGES = {
  m2: [
    { id: 't1', senderId: 'u2', text: 'Specifically the `onUserStatusChanged` hook is great for presence tracking.', ts: hrs(1) + 400000, reactions: [] },
    { id: 't2', senderId: 'u1', text: 'Agreed. Way cleaner than polling the REST endpoint every 30s.', ts: hrs(1) + 420000, reactions: [{ emoji: '💯', userIds: ['u2'] }] },
    { id: 't3', senderId: 'u2', text: "And it works offline too — queues up when reconnected.", ts: hrs(1) + 440000, reactions: [] },
  ],
  g3: [
    { id: 'gt1', senderId: 'u6', text: 'Saw this too. Pretty sure it started with the jest-environment-node update.', ts: hrs(1) + 630000, reactions: [] },
    { id: 'gt2', senderId: 'u7', text: 'Running `jest --clearCache` first might help as a temp fix.', ts: hrs(1) + 650000, reactions: [{ emoji: '👍', userIds: ['u5'] }] },
    { id: 'gt3', senderId: 'u5', text: "Tried it, didn't fix. I think it's deeper.", ts: hrs(1) + 680000, reactions: [] },
    { id: 'gt4', senderId: 'u6', text: 'Fix is in the PR I just opened — updates jest config to use swc transformer.', ts: hrs(1) + 720000, reactions: [{ emoji: '🙏', userIds: ['u5','u7'] }] },
  ],
  g1: [
    { id: 'gt5', senderId: 'u1', text: 'Will my ticket for the WebSocket refactor count even if the PR is still open?', ts: hrs(2) + 700000, reactions: [] },
    { id: 'gt6', senderId: 'u4', text: 'Yes, just link the PR in the ticket and mark it In Review.', ts: hrs(2) + 720000, reactions: [{ emoji: '👍', userIds: ['u1'] }] },
  ],
  d1: [
    { id: 'dt1', senderId: 'u1', text: 'The nav component looks great. Are there dark mode variants?', ts: hrs(5) + 200000, reactions: [] },
  ],
};

export const EMOJIS = ['👍','❤️','😂','😮','😢','🙏','🚀','👀','🎉','💯','✅','🔥','💙','🤯','😅','🙌','✨','👋'];

export const STATUS_COLORS = { online: '#22c55e', offline: '#9ca3af' };

export const formatTime = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const formatFullTime = (ts) => new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const getUserById = (id) => ALL_USERS.find(u => u.id === id);

export const getConvName = (conv) => {
  if (conv.type === 'dm') { const u = getUserById(conv.userId); return u ? u.name : 'Unknown'; }
  return conv.name;
};

export const getConvInitials = (conv) => {
  if (conv.type === 'dm') { const u = getUserById(conv.userId); return u ? u.initials : '??'; }
  return conv.initials;
};

export const getConvColor = (conv) => {
  if (conv.type === 'dm') { const u = getUserById(conv.userId); return u ? u.color : '#999'; }
  return conv.color;
};

export const FILE_ICONS = { image: '🖼️', doc: '📄', pdf: '📑', zip: '🗜️', video: '🎬', audio: '🎵', default: '📎' };
export const getFileIcon = (type) => FILE_ICONS[type] || FILE_ICONS.default;

export const CALL_HISTORY = [
  { id: 'c1', type: 'video', withUserId: 'u2', direction: 'outgoing', status: 'completed', duration: 847, ts: hrs(2) },
  { id: 'c2', type: 'audio', withUserId: 'u3', direction: 'incoming', status: 'missed',    duration: 0,   ts: hrs(5) },
  { id: 'c3', type: 'audio', withUserId: 'u5', direction: 'outgoing', status: 'completed', duration: 312, ts: hrs(6) },
  { id: 'gc1', type: 'video', groupId: 'grp_eng', groupName: 'engineering', direction: 'outgoing', status: 'completed', duration: 1820, members: 4, ts: hrs(8) },
  { id: 'c4', type: 'video', withUserId: 'u6', direction: 'incoming', status: 'declined',  duration: 0,   ts: hrs(24) },
  { id: 'gc2', type: 'audio', groupId: 'grp_design', groupName: 'design', direction: 'outgoing', status: 'completed', duration: 960, members: 3, ts: hrs(26) },
  { id: 'c5', type: 'audio', withUserId: 'u2', direction: 'incoming', status: 'completed', duration: 1203,ts: hrs(30) },
  { id: 'c6', type: 'video', withUserId: 'u4', direction: 'outgoing', status: 'missed',    duration: 0,   ts: hrs(48) },
  { id: 'c7', type: 'audio', withUserId: 'u7', direction: 'incoming', status: 'completed', duration: 524, ts: hrs(50) },
];

export const fmtCallDuration = (s) => {
  if (!s) return '';
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

export const EMOJI_CATEGORIES = [
  { id:'recent', label:'Recently Used', emojis:['👍','❤️','😂','🔥','🚀','✅','🙏','👀','😮','💯','🎉','✨','😊','🤝','💪'] },
  { id:'smileys', label:'Smileys & People', emojis:['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬'] },
  { id:'gestures', label:'Gestures', emojis:['👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾'] },
  { id:'animals', label:'Animals & Nature', emojis:['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🦆','🦅','🦉','🦇','🐺','🐴','🦄','🐝','🦋','🐌','🐞','🐜','🐢','🐍','🦎','🐙','🦑','🐟','🐬','🐳','🐋','🦈','🐊','🐘','🦒','🦓','🦍','🐕','🐈','🐓','🕊','🐇'] },
  { id:'food', label:'Food & Drink', emojis:['🍎','🍊','🍋','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🌽','🌶','🧄','🧅','🥔','🍠','🍞','🥐','🥖','🧀','🥚','🍳','🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🌮','🌯','🥙','🍱','🍣','🍜','🍝','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🍫','🍬','🍭','☕','🍵','🧃','🥤','🧋','🍺','🍻','🥂','🍷','🍸','🍹'] },
  { id:'objects', label:'Objects', emojis:['⌚','📱','💻','⌨️','🖥','🖱','🖲','🎮','💽','💾','💿','📀','📷','📸','📹','🎥','📺','📻','🧭','⏱','⌛','📡','🔋','🔌','💡','🔦','🕯','💰','💳','💹','✉️','📧','📦','📝','💼','📁','📂','📅','📆','📊','📋','📌','📍','📎','🔒','🔓','🔑','🔨','⚒','🛠','🔧','🔩','⚙️','⚖️','🔗','🧲','⚗️','🔬','🔭'] },
  { id:'symbols', label:'Symbols', emojis:['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','☮️','✝️','☪️','✡️','☸️','☯️','🛐','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','❌','⭕','🛑','⛔','📛','🚫','💯','♨️','✅','❎','🌐','💠','♻️','⚠️','🔱','⚜️','🔰','💤','🏧','♿','🎦','📶','ℹ️','🆖','🆗','🆙','🆒','🆕','🆓','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','➕','➖','➗','✖️','💲','💱','™️','©️','®️','➰','➿','✔️','☑️','🔔','🔕'] },
];
