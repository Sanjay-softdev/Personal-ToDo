import React from 'react';

export const AVATAR_SPRITES = {
  penguin: { c: 0, r: 0 },
  panda: { c: 1, r: 0 },
  mouse: { c: 2, r: 0 },
  chick: { c: 3, r: 0 },
  bear: { c: 0, r: 1 },
  seal: { c: 1, r: 1 },
  pig: { c: 2, r: 1 },
  duck: { c: 3, r: 1 },
  sheep: { c: 0, r: 2 },
  frog: { c: 1, r: 2 },
  donkey: { c: 2, r: 2 },
  crocodile: { c: 3, r: 2 },
  owl: { c: 0, r: 3 },
  lion: { c: 1, r: 3 },
  totoro: { c: 2, r: 3 },
  cow: { c: 3, r: 3 },
  dino: { c: 0, r: 4 },
  monkey: { c: 1, r: 4 },
  giraffe: { c: 2, r: 4 },
  fox: { c: 3, r: 4 }
};

export const SPRITE_EMOJIS = {
  penguin: '🐧',
  panda: '🐼',
  mouse: '🐹',
  chick: '🐥',
  bear: '🐻',
  seal: '🦭',
  pig: '🐷',
  duck: '🦆',
  sheep: '🐑',
  frog: '🐸',
  donkey: '🫏',
  crocodile: '🐊',
  owl: '🦉',
  lion: '🦁',
  totoro: '🐰',
  cow: '🐮',
  dino: '🦖',
  monkey: '🐵',
  giraffe: '🦒',
  fox: '🦊'
};

export function isBase64Image(str) {
  return typeof str === 'string' && str.startsWith('data:image/');
}

export default function Avatar({ emojiOrUrl, isPill = false, style = {} }) {
  if (typeof emojiOrUrl === 'string' && emojiOrUrl.startsWith('sprite:')) {
    const key = emojiOrUrl.substring(7);
    const sprite = AVATAR_SPRITES[key];
    if (sprite) {
      const size = isPill ? '24px' : '64px';
      const borderSize = isPill ? '1.5px' : '3px';
      const r = isPill ? '4px' : '10px';
      const shadow = isPill ? '1px 1px 0px #000' : '3px 3px 0px #000';
      const x = sprite.c * 33.333;
      const y = sprite.r * 25;
      return (
        <div 
          style={{
            width: size,
            height: size,
            borderRadius: r,
            border: `${borderSize} solid #000`,
            boxShadow: shadow,
            backgroundImage: "url('/avatars-grid.png')",
            backgroundSize: '400% 500%',
            backgroundPosition: `${x}% ${y}%`,
            backgroundRepeat: 'no-repeat',
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: '4px',
            ...style
          }}
        />
      );
    }
  }

  if (isBase64Image(emojiOrUrl)) {
    const size = isPill ? '24px' : '48px';
    const borderSize = isPill ? '1.5px' : '3px';
    return (
      <img 
        src={emojiOrUrl} 
        alt="Avatar"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `${borderSize} solid #000`,
          objectFit: 'cover',
          display: 'inline-block',
          verticalAlign: 'middle',
          marginRight: '4px',
          ...style
        }} 
      />
    );
  }

  const font = isPill ? '1.05rem' : '4.5rem';
  return (
    <span 
      style={{
        fontSize: font,
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '4px',
        ...style
      }}
    >
      {emojiOrUrl || '⭐'}
    </span>
  );
}
