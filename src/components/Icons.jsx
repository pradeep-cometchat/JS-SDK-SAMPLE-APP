// Shared SVG icon components
// Material Symbol helper
const MIcon = ({ name, size = 20, fill = false, style }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size, fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`, lineHeight: 1, display: 'inline-flex', ...style }}>{name}</span>
);

export const SearchIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
);

export const CloseIcon = ({ size = 16 }) => (
  <MIcon name="close" size={size} />
);

export const SendIcon = () => (
  <MIcon name="send" size={16} fill />
);

export const CheckIcon = ({ size = 15 }) => (
  <MIcon name="check" size={size} />
);

export const PhoneIcon = ({ size = 16 }) => (
  <MIcon name="call" size={size} />
);

export const VideoIcon = ({ size = 16 }) => (
  <MIcon name="videocam" size={size} />
);

export const ThreadIcon = ({ size = 14 }) => (
  <MIcon name="chat_bubble_outline" size={size} />
);

export const EditIcon = ({ size = 14 }) => (
  <MIcon name="edit" size={size} />
);

export const TrashIcon = ({ size = 14 }) => (
  <MIcon name="delete_outline" size={size} />
);

export const MoreDotsIcon = ({ size = 14 }) => (
  <MIcon name="more_horiz" size={size} />
);

export const VerticalDotsIcon = ({ size = 13 }) => (
  <MIcon name="more_vert" size={size} />
);

export const PlusIcon = ({ size = 17 }) => (
  <MIcon name="add" size={size} />
);

export const EmojiIcon = ({ size = 17 }) => (
  <MIcon name="sentiment_satisfied_alt" size={size} />
);

export const SettingsIcon = ({ size = 15 }) => (
  <MIcon name="settings" size={size} />
);

export const LogoutIcon = ({ size = 14 }) => (
  <MIcon name="logout" size={size} />
);

export const StarIcon = ({ size = 13 }) => (
  <MIcon name="star_outline" size={size} />
);

export const CopyIcon = ({ size = 13 }) => (
  <MIcon name="content_copy" size={size} />
);

export const PinIcon = ({ size = 13 }) => (
  <MIcon name="push_pin" size={size} />
);

export const BellIcon = ({ size = 13 }) => (
  <MIcon name="notifications_none" size={size} />
);

export const DownloadIcon = ({ size = 14 }) => (
  <MIcon name="download" size={size} />
);

export const ChevronRightIcon = ({ size = 14 }) => (
  <MIcon name="chevron_right" size={size} />
);

export const ChevronUpIcon = ({ size = 13 }) => (
  <MIcon name="expand_less" size={size} />
);

export const ChevronDownIcon = ({ size = 13 }) => (
  <MIcon name="expand_more" size={size} />
);

export const PollIcon = ({ size = 14 }) => (
  <MIcon name="poll" size={size} />
);

export const ScreenShareIcon = ({ size = 16 }) => (
  <MIcon name="screen_share" size={size} />
);

export const RecordIcon = ({ size = 16, recording = false }) => (
  <MIcon name="fiber_manual_record" size={size} fill={recording} style={recording ? { color: '#ef4444' } : {}} />
);

export const NewChatIcon = () => (
  <MIcon name="chat" size={16} />
);

export const NewGroupIcon = () => (
  <MIcon name="group_add" size={16} />
);

export const MicIcon = ({ size = 17 }) => (
  <MIcon name="mic" size={size} />
);

export const InfoIcon = ({ size = 13 }) => (
  <MIcon name="info" size={size} />
);
