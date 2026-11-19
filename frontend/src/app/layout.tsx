import Providers from './providers';
import GoogleTranslateProvider from '@/components/GoogleTranslateProvider';
import SeasonalTheme from '@/components/SeasonalTheme';
import './globals.css';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SeasonalTheme />
          <GoogleTranslateProvider>{children}</GoogleTranslateProvider>
        </Providers>
      </body>
    </html>
  );
}