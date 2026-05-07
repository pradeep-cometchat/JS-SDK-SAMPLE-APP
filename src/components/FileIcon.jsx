// File-type icons backed by Material Symbols Rounded so they match the rest of the app.
export const FileIcon = ({ type, size = 22, color = 'currentColor' }) => {
  const name =
    type === 'image' ? 'image' :
    type === 'pdf'   ? 'picture_as_pdf' :
    type === 'video' ? 'movie' :
    type === 'audio' ? 'audio_file' :
    type === 'doc'   ? 'description' :
                       'attach_file';

  return (
    <span
      className="material-symbols-rounded"
      aria-hidden="true"
      style={{
        fontSize: size,
        width: size,
        height: size,
        color,
        fontVariationSettings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {name}
    </span>
  );
};
