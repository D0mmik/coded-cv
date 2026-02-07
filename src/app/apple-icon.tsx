import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1e1e1e',
          borderRadius: '36px',
          fontSize: '100px',
          fontWeight: 700,
          color: '#4EC9B0',
          fontFamily: 'monospace',
        }}
      >
        {'</>'}
      </div>
    ),
    { ...size }
  );
}
