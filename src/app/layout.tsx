import { pretendard } from '@/utils/fonts';
import type { Metadata } from 'next';
import './globals.css';
import { OuterProvider, InnerProvider } from './providers/Providers';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '월드코리아',
  description: 'Generated by create next app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OuterProvider>
      <html lang="ko">
        <body
          className={`${pretendard.variable} ${pretendard.className} bg-gray-50 w-full`}
        >
          <Script src="https://cdn.iamport.kr/v1/iamport.js" />
          <InnerProvider>{children}</InnerProvider>
        </body>
      </html>
    </OuterProvider>
  );
}
