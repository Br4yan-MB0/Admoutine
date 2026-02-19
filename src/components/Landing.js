import Link from 'next/link';

export default function Landing() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ 
        fontSize: '4rem', 
        color: '#c59d5f', 
        margin: '0', 
        letterSpacing: '8px', 
        fontWeight: '900',
        textTransform: 'uppercase'
      }}>
        CHROUTINE
      </h1>

      <p style={{ 
        color: '#888', 
        fontSize: '1.1rem', 
        maxWidth: '500px', 
        lineHeight: '1.6',
        margin: '20px 0 40px 0',
        letterSpacing: '1px'
      }}>
        Organize sua rotina com a precisão de um relógio suíço. 
        <span style={{ color: '#c59d5f' }}> Evolua todos os dias.</span>
      </p>

      <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '400px' }}>
        <Link href="/login" style={{ flex: 1, textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            padding: '15px',
            background: '#c59d5f',
            color: '#000',
            border: 'none',
            borderRadius: '30px',
            fontWeight: '900',
            cursor: 'pointer',
            transition: '0.3s',
            letterSpacing: '1px'
          }}> LOGIN </button>
        </Link>

        <Link href="/register" style={{ flex: 1, textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            padding: '15px',
            background: 'transparent',
            color: '#c59d5f',
            border: '2px solid #c59d5f',
            borderRadius: '30px',
            fontWeight: '900',
            cursor: 'pointer',
            transition: '0.3s',
            letterSpacing: '1px'
          }}> REGISTRAR </button>
        </Link>
      </div>

      <footer style={{ position: 'absolute', bottom: '30px', color: '#333', fontSize: '0.8rem', letterSpacing: '2px' }}>
        CHROUTINE © 2026 - O LUXO DA PRODUTIVIDADE
      </footer>
    </div>
  );
}