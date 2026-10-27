import type { Metadata } from 'next';
import { pathMetadata } from '@/lib/pathTexts';

export const metadata: Metadata = pathMetadata('fans');

export default function FansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
