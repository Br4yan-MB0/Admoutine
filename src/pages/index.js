import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Landing from '../components/Landing';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard/home');
    }
  }, [user, loading]);

  if (loading) return null;

  return <Landing />;
}
