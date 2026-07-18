import {ImageResponse} from 'next/og';

export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 72,
          background: 'radial-gradient(circle at 20% 20%, rgba(63,232,244,0.26), transparent 32%), radial-gradient(circle at 80% 18%, rgba(230,60,216,0.22), transparent 30%), linear-gradient(135deg, #05060F 0%, #0A0E1F 100%)',
          color: '#F2F4FF',
          fontFamily: 'Arial'
        }}
      >
        <div style={{fontSize: 28, letterSpacing: 8, color: '#3FE8F4', textTransform: 'uppercase'}}>AI · Automation · Web Development</div>
        <div style={{marginTop: 34, fontSize: 88, fontWeight: 800, lineHeight: 0.95, letterSpacing: -6}}>Hoosh Yar</div>
        <div style={{marginTop: 18, fontSize: 54, fontWeight: 700, color: '#E63CD8'}}>هوش‌یار</div>
        <div style={{marginTop: 42, maxWidth: 880, fontSize: 30, lineHeight: 1.35, color: '#8A91B0'}}>Aware intelligence for premium digital systems.</div>
      </div>
    ),
    size
  );
}
