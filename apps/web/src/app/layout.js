// apps/web/src/app/layout.js
import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Alumnia — Engage. Refer. Grow.',
  description: 'Centralized alumni engagement & career referral platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
