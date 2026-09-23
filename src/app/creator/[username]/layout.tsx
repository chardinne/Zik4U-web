import localFont from 'next/font/local';

const bebasNeue = localFont({
  src: '../../../fonts/bebas-neue-400.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-bebas',
});

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return <div className={bebasNeue.variable}>{children}</div>;
}
