import Link from 'next/link';

export default function Landing() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Admoutine</h1>

      <p className="landing-subtitle">
        Organize sua rotina. Controle seu tempo. Evolua todos os dias.
      </p>

      <div className="landing-buttons">
        <Link href="/login">
          <button className="btn-primary">Login</button>
        </Link>

        <Link href="/register">
          <button className="btn-secondary">Register</button>
        </Link>
      </div>
    </div>
  );
}