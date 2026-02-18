import ProtectedRoute from '../ProtectedRoute';
import Navbar from '../Layout/NavBar';

export default function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <main style={{ padding: '1.5rem' }}>{children}</main>
    </ProtectedRoute>
  );
}
