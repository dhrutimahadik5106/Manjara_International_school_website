
import React, { useEffect, useState } from 'react';

const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return 'MIS';

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (
    words[0][0] + words[words.length - 1][0]
  ).toUpperCase();
};

export default function ProfileAvatar({
  src,
  name = 'School User',
  size = 40,
  className = '',
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const initials = getInitials(name);
  const showImage = Boolean(src) && !imageError;

  return (
    <div
      className={`relative shrink-0 rounded-full
        p-[2px] bg-gradient-to-br
        from-sky-300 via-indigo-300 to-violet-400
        shadow-md shadow-indigo-200/40
        ${className}`}
      style={{
        width: size,
        height: size,
      }}
      role="img"
      aria-label={`${name}'s profile picture`}
      title={name}
    >
      <div
        className="w-full h-full rounded-full overflow-hidden
          flex items-center justify-center
          bg-gradient-to-br from-sky-50
          via-blue-100 to-indigo-100"
      >
        {showImage ? (
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span
            className="font-extrabold text-indigo-700
              tracking-tight select-none"
            style={{
              fontSize: size * (initials.length > 2 ? 0.27 : 0.35),
            }}
          >
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
