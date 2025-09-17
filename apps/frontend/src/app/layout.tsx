import './global.css';
import { ToastProvider } from '../components/Toast';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata = {
  title: 'Multi-Tenant SaaS',
  description: 'A modern multi-tenant SaaS application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
