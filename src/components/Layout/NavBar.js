import Link from 'next/link';
import styles from '../../styles/NavBar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <span className={styles.logo}>Admoutine</span>
        <Link href="/tasks/new" className={styles.navLink}>Tasks</Link>
        <Link href="/routine" className={styles.navLink}>Routine</Link>
        <Link href="/calendar/calendary" className={styles.navLink}>Events</Link>
      </div>

      <div className={styles.right}>
        <Link href="/settings/profile" className={styles.navLink}>Settings</Link>
      </div>
    </nav>
  );
}