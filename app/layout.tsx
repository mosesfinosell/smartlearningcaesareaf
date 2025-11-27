import type { Metadata } from 'next';
import './globals.css';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const logoImage = '/images/smartlearninglogo.jpeg';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SmartLearning by Caesarea College',
    template: '%s | SmartLearning by Caesarea College'
  },
  description: 'SmartLearning by Caesarea College – Online Learning Management System',
  openGraph: {
    title: 'SmartLearning by Caesarea College',
    description: 'SmartLearning by Caesarea College – Online Learning Management System',
    url: siteUrl,
    siteName: 'SmartLearning by Caesarea College',
    images: [
      {
        url: logoImage,
        width: 1200,
        height: 630,
        alt: 'SmartLearning by Caesarea College'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartLearning by Caesarea College',
    description: 'SmartLearning by Caesarea College – Online Learning Management System',
    images: [logoImage]
  },
  icons: {
    icon: logoImage
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={logoImage} />
      </head>
      <body>{children}</body>
    </html>
  );
}
