import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Coded CV - Your Resume, Written in Code';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1e1e1e',
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '60px',
          fontFamily: 'JetBrains Mono',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(78, 201, 176, 0.06)',
            filter: 'blur(80px)',
            transform: 'translateY(-50%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '50%',
            paddingRight: '40px',
          }}
        >
          <div style={{ color: '#6A9955', fontSize: '18px', marginBottom: '16px' }}>
            {'// cv builder for developers'}
          </div>
          <div style={{ color: '#d4d4d4', fontSize: '52px', fontWeight: 700, lineHeight: 1.1 }}>
            Your Resume,
          </div>
          <div
            style={{
              color: '#4EC9B0',
              fontSize: '52px',
              fontWeight: 700,
              lineHeight: 1.1,
              marginTop: '4px',
            }}
          >
            Written in Code
          </div>
          <div
            style={{
              color: '#808080',
              fontSize: '18px',
              marginTop: '28px',
              lineHeight: 1.5,
            }}
          >
            6 languages. PDF export. Free.
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
            }}
          >
            {['C#', 'Python', 'TypeScript', 'Go', 'Rust', 'Java'].map((lang) => (
              <div
                key={lang}
                style={{
                  border: '1px solid #3e3e3e',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  color: '#808080',
                  fontSize: '14px',
                }}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            background: '#0a0e14',
            borderRadius: '12px',
            border: '1px solid #3e3e3e',
            padding: '28px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '0',
              marginBottom: '20px',
              borderBottom: '1px solid #3e3e3e',
              paddingBottom: '8px',
            }}
          >
            <div style={{ color: '#d4d4d4', fontSize: '13px', paddingRight: '16px' }}>
              resume.ts
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '15px' }}>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>1</span>
              <span style={{ color: '#569CD6' }}>interface</span>
              <span style={{ color: '#4EC9B0', marginLeft: '8px' }}>Developer</span>
              <span style={{ color: '#d4d4d4', marginLeft: '8px' }}>{'{'}</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>2</span>
              <span style={{ color: '#9CDCFE', marginLeft: '24px' }}>name</span>
              <span style={{ color: '#d4d4d4' }}>:</span>
              <span style={{ color: '#4EC9B0', marginLeft: '8px' }}>string</span>
              <span style={{ color: '#d4d4d4' }}>;</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>3</span>
              <span style={{ color: '#9CDCFE', marginLeft: '24px' }}>role</span>
              <span style={{ color: '#d4d4d4' }}>:</span>
              <span style={{ color: '#4EC9B0', marginLeft: '8px' }}>string</span>
              <span style={{ color: '#d4d4d4' }}>;</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>4</span>
              <span style={{ color: '#9CDCFE', marginLeft: '24px' }}>skills</span>
              <span style={{ color: '#d4d4d4' }}>:</span>
              <span style={{ color: '#4EC9B0', marginLeft: '8px' }}>string[]</span>
              <span style={{ color: '#d4d4d4' }}>;</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>5</span>
              <span style={{ color: '#9CDCFE', marginLeft: '24px' }}>experience</span>
              <span style={{ color: '#d4d4d4' }}>:</span>
              <span style={{ color: '#4EC9B0', marginLeft: '8px' }}>Experience[]</span>
              <span style={{ color: '#d4d4d4' }}>;</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>6</span>
              <span style={{ color: '#d4d4d4' }}>{'}'}</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>7</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>8</span>
              <span style={{ color: '#569CD6' }}>const</span>
              <span style={{ color: '#4FC1FF', marginLeft: '8px' }}>me</span>
              <span style={{ color: '#d4d4d4' }}>:</span>
              <span style={{ color: '#4EC9B0', marginLeft: '8px' }}>Developer</span>
              <span style={{ color: '#d4d4d4', marginLeft: '8px' }}>=</span>
              <span style={{ color: '#d4d4d4', marginLeft: '8px' }}>{'{'}</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>9</span>
              <span style={{ color: '#9CDCFE', marginLeft: '24px' }}>name</span>
              <span style={{ color: '#d4d4d4' }}>:</span>
              <span style={{ color: '#CE9178', marginLeft: '8px' }}>{'"Your Name"'}</span>
              <span style={{ color: '#d4d4d4' }}>,</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#858585', width: '30px' }}>10</span>
              <span style={{ color: '#9CDCFE', marginLeft: '24px' }}>role</span>
              <span style={{ color: '#d4d4d4' }}>:</span>
              <span style={{ color: '#CE9178', marginLeft: '8px' }}>{'"Full Stack Dev"'}</span>
              <span style={{ color: '#d4d4d4' }}>,</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
