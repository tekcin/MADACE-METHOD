import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MADACE IDE - Monaco Editor',
  description: 'Full-featured code editor powered by Monaco Editor (VS Code engine)',
  keywords: ['MADACE', 'IDE', 'Monaco', 'Code Editor', 'Development'],
};

/**
 * Custom layout for IDE page
 *
 * This layout removes Bootstrap CSS which conflicts with Tailwind dark mode.
 * The IDE page uses only Tailwind CSS and custom Monaco/XTerm styling.
 */
export default function IDELayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>{/* No Bootstrap - IDE uses only Tailwind + Monaco + XTerm */}</head>
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        {/* No Navigation or Footer - Full-screen IDE */}
        {children}
      </body>
    </html>
  );
}
