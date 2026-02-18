import { AuthProvider } from '../context/AuthContext';
import '../styles/global.css';
import { useEffect } from 'react';
import TimerService from '../lib/TimerService';

export default function MyApp({ Component, pageProps }) {

  useEffect(() => {
    TimerService.start(30000);
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(savedTheme);
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
