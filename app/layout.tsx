import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Lea QZZ — Final Exam',
  description: 'Bài kiểm tra cuối kỳ gồm 80 câu hỏi: Toán, Tiếng Việt, Tiếng Anh và Logic.',
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📝</text></svg>" },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0f14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* Preconnect for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload the fonts used in page.tsx */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
        />
        <style>{`
          /* Hard reset so dark theme applies instantly — prevents white flash on load */
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          html {
            background: #0d0f14;
            color-scheme: dark;
            scroll-behavior: smooth;
            /* Prevent layout shift from scrollbar appearing/disappearing */
            overflow-y: scroll;
          }
          body {
            background: #0d0f14;
            color: #e8eaf0;
            font-family: 'Sora', system-ui, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            /* Prevent text size jump on mobile rotation */
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
            min-height: 100dvh;
          }
          /* Remove iOS tap flash on interactive elements */
          * {
            -webkit-tap-highlight-color: transparent;
          }
          /* Better tap targets & prevent double-tap zoom */
          button, label, input {
            touch-action: manipulation;
          }
          /* Prevent iOS from zooming into radio inputs */
          input[type="radio"] {
            font-size: 16px;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
