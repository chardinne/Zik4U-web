import type { Metadata } from 'next';
import { pathMetadata } from '@/lib/pathTexts';

export const metadata: Metadata = pathMetadata('listeners');

export default function ListenersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
