// Shared icon components — all use Material Symbols Rounded via the MIcon helper.
// The font is loaded globally via index.html and .storybook/preview-head.html.
const MIcon = ({ name, size = 20, fill = false, style }) => (
  <span
    className="material-symbols-rounded"
    aria-hidden="true"
    style={{
      fontSize: size,
      width: size,
      height: size,
      fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      userSelect: 'none',
      ...style,
    }}
  >
    {name}
  </span>
);

export const SearchIcon = ({ size = 14 }) => (
  <MIcon name="search" size={size} />
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

export const UserIcon = ({ size = 15 }) => (
  <MIcon name="person" size={size} />
);

export const UsersIcon = ({ size = 15 }) => (
  <MIcon name="group" size={size} />
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

export const MuteIcon = ({ size = 13 }) => (
  <MIcon name="mic_off" size={size} />
);

export const UnmuteIcon = ({ size = 13 }) => (
  <MIcon name="mic" size={size} />
);

export const BlockIcon = ({ size = 14 }) => (
  <MIcon name="block" size={size} />
);

export const CopyIcon = ({ size = 13 }) => (
  <MIcon name="content_copy" size={size} />
);

export const ForwardIcon = ({ size = 13 }) => (
  <MIcon name="shortcut" size={size} />
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

export const StopIcon = ({ size = 17 }) => (
  <MIcon name="stop" size={size} fill />
);

export const InfoIcon = ({ size = 13 }) => (
  <MIcon name="info" size={size} />
);

/* ── Additional Material Symbols used across the app (previously inline SVGs) ── */

export const BackIcon = ({ size = 18 }) => (
  <MIcon name="arrow_back_ios_new" size={size} />
);

export const ReplyIcon = ({ size = 15 }) => (
  <MIcon name="reply" size={size} />
);

export const AlertIcon = ({ size = 14 }) => (
  <MIcon name="error" size={size} />
);

export const LinkIcon = ({ size = 14 }) => (
  <MIcon name="link" size={size} />
);

export const BoldIcon = ({ size = 14 }) => (
  <MIcon name="format_bold" size={size} />
);

export const ItalicIcon = ({ size = 14 }) => (
  <MIcon name="format_italic" size={size} />
);

export const UnderlineIcon = ({ size = 14 }) => (
  <MIcon name="format_underlined" size={size} />
);

export const StrikeIcon = ({ size = 14 }) => (
  <MIcon name="format_strikethrough" size={size} />
);

export const OrderedListIcon = ({ size = 14 }) => (
  <MIcon name="format_list_numbered" size={size} />
);

export const UnorderedListIcon = ({ size = 14 }) => (
  <MIcon name="format_list_bulleted" size={size} />
);

export const QuoteIcon = ({ size = 14 }) => (
  <MIcon name="format_quote" size={size} />
);

export const CodeIcon = ({ size = 14 }) => (
  <MIcon name="code" size={size} />
);

export const CodeBlockIcon = ({ size = 14 }) => (
  <MIcon name="integration_instructions" size={size} />
);

export const PauseIcon = ({ size = 17 }) => (
  <MIcon name="pause" size={size} fill />
);

export const ChevronLeftIcon = ({ size = 18 }) => (
  <MIcon name="chevron_left" size={size} />
);

export const CallDirectionIcon = ({ direction = 'outgoing', size = 12, color }) => (
  <MIcon
    name={direction === 'outgoing' ? 'call_made' : 'call_received'}
    size={size}
    style={color ? { color } : undefined}
  />
);

export const PlayIcon = ({ size = 16 }) => (
  <MIcon name="play_arrow" size={size} fill />
);

export const DoubleCheckIcon = ({ size = 14, style }) => (
  <MIcon name="done_all" size={size} style={style} />
);

export const WhiteboardIcon = ({ size = 20 }) => (
  <MIcon name="draw" size={size} />
);

export const DocIcon = ({ size = 20 }) => (
  <MIcon name="article" size={size} />
);

export const CallAcceptIcon = ({ size = 24 }) => (
  <MIcon name="call" size={size} fill style={{ color: 'white' }} />
);

export const CallDeclineIcon = ({ size = 24 }) => (
  <MIcon name="call_end" size={size} fill style={{ color: 'white' }} />
);

export const VirtualBgIcon = ({ size = 16 }) => (
  <MIcon name="wallpaper" size={size} />
);

export const CameraOnIcon = ({ size = 16 }) => (
  <MIcon name="videocam" size={size} />
);

export const CameraOffIcon = ({ size = 16 }) => (
  <MIcon name="videocam_off" size={size} />
);

export const EndCallIcon = ({ size = 16 }) => (
  <MIcon name="call_end" size={size} fill style={{ color: 'white' }} />
);

export const TweaksIcon = ({ size = 18 }) => (
  <MIcon name="tune" size={size} />
);

export const ChatBubbleIcon = ({ size = 16 }) => (
  <MIcon name="forum" size={size} />
);

export const PublicGroupIcon = ({ size = 20 }) => (
  <MIcon name="public" size={size} />
);

export const PrivateGroupIcon = ({ size = 20 }) => (
  <MIcon name="lock" size={size} />
);

export const PasswordGroupIcon = ({ size = 20 }) => (
  <MIcon name="key" size={size} />
);

export const EmojiSmileIcon = ({ size = 12 }) => (
  <MIcon name="add_reaction" size={size} />
);

export const CameraIcon = ({ size = 20 }) => (
  <MIcon name="photo_camera" size={size} />
);
